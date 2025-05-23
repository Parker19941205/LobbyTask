import { GameConfig, UIID } from "../../game/config/Config";
import { PlayerMgr } from "../../game/manager/PlayerMgr";
import LoadingCicle from "../../game/ui/common/LoadingCicle";
import { UIMgr } from "../manager/UIMgr";
import { ISocket, INetworkTips, IProtocolHelper, RequestObject, CallbackObject, NetData, NetCallFunc } from "./NetInterface";

/*
*   CocosCreator网络节点基类，以及网络相关接口定义
*   1. 网络连接、断开、请求发送、数据接收等基础功能
*   2. 心跳机制
*   3. 断线重连 + 请求重发
*   4. 调用网络屏蔽层
*
*   2018-5-7 by 宝爷
*/

type ExecuterFunc = (callback: CallbackObject, buffer: NetData) => void;
type CheckFunc = (checkedFunc : VoidFunc ) => void;
type VoidFunc = () => void;
type BoolFunc = () => boolean;

export enum NetTipsType {
    Connecting,
    ReConnecting,
    Requesting,
}

export enum NetNodeState {
    Closed,                     // 已关闭
    Connecting,                 // 连接中
    Checking,                   // 验证中
    Working,                    // 可传输数据
}

export interface NetConnectOptions {
    host?: string,              // 地址
    port?: number,              // 端口
    url?: string,               // url，与地址+端口二选一
    autoReconnect?: number,     // -1 永久重连，0不自动重连，其他正整数为自动重试次数
}

export class NetNode {
    protected _connectOptions: NetConnectOptions = null;
    protected _autoReconnect: number = 100;
    protected _isSocketInit: boolean = false;                               // Socket是否初始化过
    protected _isSocketOpen: boolean = false;                               // Socket是否连接成功过
    protected _state: NetNodeState = NetNodeState.Closed;                   // 节点当前状态
    protected _socket: ISocket = null;                                      // Socket对象（可能是原生socket、websocket、wx.socket...)

    protected _networkTips: INetworkTips = null;                            // 网络提示ui对象（请求提示、断线重连提示等）
    protected _protocolHelper: IProtocolHelper = null;                      // 包解析对象
    protected _connectedCallback: CheckFunc = null;                         // 连接完成回调
    protected _disconnectCallback: BoolFunc = null;                         // 断线回调
    protected _callbackExecuter: ExecuterFunc = null;                       // 回调执行
    protected _connectedFinishCallback: Function = null;                          // 连接成功回调

    protected _keepAliveTimer: any = null;                                  // 心跳定时器
    protected _receiveMsgTimer: any = null;                                 // 接收数据定时器
    protected _reconnectTimer: any = null;                                  // 重连定时器
    protected _heartTime: number = 5000;                                   // 心跳间隔
    protected _receiveTime: number = 1800000;                               // 多久没收到数据断开
    protected _reconnetTimeOut: number = 5000;                           // 重连间隔
    protected _requests: RequestObject[] = Array<RequestObject>();          // 请求列表
    protected _listener: { [key: number]: CallbackObject[] } = {}           // 监听者列表
    protected _isNeedReconnect: boolean = true;                             // Socket是否需要自动重连

    /********************** 网络相关处理 *********************/
    public init(socket: ISocket, protocol: IProtocolHelper, networkTips: any = null, execFunc : ExecuterFunc = null) {
        console.log(`NetNode init socket`);
        this._socket = socket;
        this._protocolHelper = protocol;
        this._networkTips = networkTips;
        this._callbackExecuter = execFunc ? execFunc : (callback: CallbackObject, buffer: NetData) => {
            callback.callback.call(callback.target, 0, buffer);
        }
    }

    public connect(options: NetConnectOptions,callback?:Function): boolean {
        cc.log("connect:state=========>",this._state,JSON.stringify(options))
        if (this._socket && this._state == NetNodeState.Closed) {
            if (!this._isSocketInit) {
                this.initSocket();
            }
            this._state = NetNodeState.Connecting;
            if (!this._socket.connect(options)) {
                return false;
            }
            this._connectedFinishCallback = callback

            if (this._connectOptions == null) {
                options.autoReconnect = options.autoReconnect;
            }
            this._connectOptions = options;
            return true;
        }
        return false;
    }

    protected initSocket() {
        this._socket.onConnected = (event) => { this.onConnected(event) };
        this._socket.onMessage = (msg) => { this.onMessage(msg) };
        this._socket.onError = (event) => { this.onError(event) };
        this._socket.onClosed = (event) => { this.onClosed(event) };
        this._isSocketInit = true;
    }



    // 网络连接成功
    protected onConnected(event) {
        console.log("NetNode:onConnected!")
        this._isNeedReconnect = true
        this._isSocketOpen = true;
        this._autoReconnect = 100

        if (this._connectedFinishCallback) {
            this._connectedFinishCallback()
            this._connectedFinishCallback = null
        }

        // 心跳包发送器
        //this.resetHearbeatTimer();

        // 如果设置了鉴权回调，在连接完成后进入鉴权阶段，等待鉴权结束
        if (this._connectedCallback !== null) {
            this._state = NetNodeState.Checking;
            this._connectedCallback(() => { this.onChecked() });
        } else {
            this.onChecked();
        }
        console.log("NetNode onConnected! state =" + this._state);
        let baseUI = UIMgr.getInstance().getUIById(UIID.LoadingCicle)
        if (baseUI) {
            baseUI.getComponent(LoadingCicle).hide();
        }
    }

    // 连接验证成功，进入工作状态
    protected onChecked() {
        console.log("NetNode onChecked!")
        this._state = NetNodeState.Working;
        // 关闭连接或重连中的状态显示

        // 重发待发送信息
        console.log(`NetNode flush ${this._requests.length} request`)
        if (this._requests.length > 0) {
            for (var i = 0; i < this._requests.length;) {
                let req = this._requests[i];
                this._socket.send(req.buffer);
                if (req.rspObject == null || req.rspCmd <= 0) {
                    this._requests.splice(i, 1);
                } else {
                    ++i;
                }
            }
        }
    }

    // 接收到一个完整的消息包
    protected onMessage(msg): void {
        console.log(`NetNode onMessage status = ` + this._state,msg);
        // 进行头部的校验（实际包长与头部长度是否匹配）
        if (!this._protocolHelper.checkPackage(msg)) {
            console.error(`NetNode checkHead Error`);
            return;
        }
        // 接受到数据，重新定时收数据计时器
        this.resetReceiveMsgTimer();
        // 重置心跳包发送器
        //this.resetHearbeatTimer();
        // 触发消息执行
        let rspCmd = this._protocolHelper.getPackageId(msg);
        //console.log(`NetNode onMessage rspCmd = ` + rspCmd);
        // 优先触发request队列
        if (this._requests.length > 0) {
            for (let reqIdx in this._requests) {
                let req = this._requests[reqIdx];
                if (req.rspCmd == rspCmd) {
                    //console.log(`NetNode execute request rspcmd ${rspCmd}`);
                    this._callbackExecuter(req.rspObject, JSON.parse(msg));
                    this._requests.splice(parseInt(reqIdx), 1);
                    break;
                }
            }
            console.log(`NetNode still has ${this._requests.length} request watting`);
        }

        let listeners = this._listener[rspCmd];
        if (null != listeners) {
            for (const rsp of listeners) {
                //console.log(`NetNode execute listener cmd ${rspCmd}`);
                this._callbackExecuter(rsp,JSON.parse(msg));
            }
        }
    }

    protected onError(event) {
        console.log("socket:error",JSON.stringify(event));
        this.clearTimer();

        // 自动重连
        if (this.isAutoReconnect()) {
            this._reconnectTimer = setTimeout(() => {
                console.log("自动重连")
                this._socket.close();
                this._state = NetNodeState.Closed;
                let command = PlayerMgr.getInstance().getGameData().getCommand()
                this._connectOptions.url = GameConfig.socketUrl + "?" + command;
                this.connect(this._connectOptions);
                if (this._autoReconnect > 0) {
                    this._autoReconnect -= 1;
                }
            }, this._reconnetTimeOut);
        } else {
            this._state = NetNodeState.Closed;
        }

        //显示重连loading
        let baseUI = UIMgr.getInstance().getUIById(UIID.LoadingCicle)
        if (baseUI && this._isNeedReconnect) {
            baseUI.getComponent(LoadingCicle).show();
        }
    }

    protected onClosed(event) {
        cc.log("socket:onClosed");
        this.clearTimer();

        // 执行断线回调，返回false表示不进行重连
        if (this._disconnectCallback && !this._disconnectCallback()) {
            console.log(`disconnect return!`)
            return;
        }

        // 自动重连
        if (this.isAutoReconnect()) {
            this._reconnectTimer = setTimeout(() => {
                console.log("自动重连")
                this._socket.close();
                this._state = NetNodeState.Closed;
                let command = PlayerMgr.getInstance().getGameData().getCommand()
                this._connectOptions.url = GameConfig.socketUrl + "?" + command;
                this.connect(this._connectOptions);
                if (this._autoReconnect > 0) {
                    this._autoReconnect -= 1;
                }
            }, this._reconnetTimeOut);
        } else {
            this._state = NetNodeState.Closed;
        }

        //显示重连loading
        let baseUI = UIMgr.getInstance().getUIById(UIID.LoadingCicle)
        if (baseUI && this._isNeedReconnect) {
            baseUI.getComponent(LoadingCicle).show();
        }
    }

    public close(code?: number, reason?: string) {
        this.clearTimer();
        this._listener = {};
        this._requests.length = 0;
        if (this._networkTips) {
            this._networkTips.connectTips(false);
            this._networkTips.reconnectTips(false);
            this._networkTips.requestTips(false);
        }
        if (this._socket) {
            this._socket.close(code, reason);
        } else {
            this._state = NetNodeState.Closed;
        }
    }

    // 只是关闭Socket套接字（仍然重用缓存与当前状态）
    public closeSocket(code?: number, reason?: string) {
        if (this._socket) {
            this._socket.close(code, reason);
        }
    }

    // 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
    public send(buf: NetData, force: boolean = false): boolean {
        if (this._state == NetNodeState.Working || force) {
            console.log(`socket send ...`,buf);
            return this._socket.send(buf);
        } else if (this._state == NetNodeState.Checking ||
            this._state == NetNodeState.Connecting) {
            this._requests.push({
                buffer: buf,
                rspCmd: 0,
                rspObject: null
            });
            console.log("NetNode socket is busy, push to send buffer, current state is " + this._state);
            return true;
        } else {
            console.error("NetNode request error! current state is " + this._state);
            return false;
        }
    }

    // 发起请求，并进入缓存列表
    public request(buf: NetData, rspCmd: number, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false) {
        if (this._state == NetNodeState.Working || force) {
            console.log(`socket send ...`,buf);
            this._socket.send(buf);
        }
        console.log(`NetNode request with timeout for ${rspCmd}`);
        // 进入发送缓存列表
        this._requests.push({
            buffer: buf, rspCmd, rspObject
        });
    }

    // 唯一request，确保没有同一响应的请求（避免一个请求重复发送，netTips界面的屏蔽也是一个好的方法）
    public requestUnique(buf: NetData, rspCmd: number, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false): boolean {
        for (let i = 0; i < this._requests.length; ++i) {
            if (this._requests[i].rspCmd == rspCmd) {
                console.log(`NetNode requestUnique faile for ${rspCmd}`);
                return false;
            }
        }
        this.request(buf, rspCmd, rspObject, showTips, force);
        return true;
    }

    /********************** 回调相关处理 *********************/
    public setResponeHandler(cmd: number, callback: NetCallFunc, target?: any): boolean {
        if (callback == null) {
            console.error(`NetNode setResponeHandler error ${cmd}`);
            return false;
        }
        this._listener[cmd] = [{ target, callback }];
        return true;
    }

    public addResponeHandler(cmd: number, callback: NetCallFunc, target?: any): boolean {
        if (callback == null) {
            console.error(`NetNode addResponeHandler error ${cmd}`);
            return false;
        }
        let rspObject = { target, callback };
        if (null == this._listener[cmd]) {
            this._listener[cmd] = [rspObject];
        } else {
            let index = this.getNetListenersIndex(cmd, rspObject);
            if (-1 == index) {
                this._listener[cmd].push(rspObject);
            }
        }
        //cc.log("_listener===>",this._listener)
        return true;
    }

    public removeResponeHandler(cmd: number, callback: NetCallFunc, target?: any) {
        if (null != this._listener[cmd] && callback != null) {
            let index = this.getNetListenersIndex(cmd, { target, callback });
            if (-1 != index) {
                this._listener[cmd].splice(index, 1);
            }
        }
        //cc.log("_listener===>",this._listener)
    }

    public cleanListeners(cmd: number = -1) {
        if (cmd == -1) {
            this._listener = {}
        } else {
            this._listener[cmd] = null;
        }
    }

    protected getNetListenersIndex(cmd: number, rspObject: CallbackObject): number {
        let index = -1;
        for (let i = 0; i < this._listener[cmd].length; i++) {
            let iterator = this._listener[cmd][i];
            if (iterator.callback == rspObject.callback
                && iterator.target == rspObject.target) {
                index = i;
                break;
            }
        }
        return index;
    }

    /********************** 心跳、超时相关处理 *********************/
    protected resetReceiveMsgTimer() {
        if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
        }

        this._receiveMsgTimer = setTimeout(() => {
            console.warn("NetNode recvieMsgTimer close socket!");
            this._socket.close();
        }, this._receiveTime);
    }

    protected resetHearbeatTimer() {
        if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
        }

        this._keepAliveTimer = setTimeout(() => {
            console.log("NetNode keepAliveTimer send Hearbeat")
            this.send(this._protocolHelper.getHearbeat());
        }, this._heartTime);
    }

    protected clearTimer() {
        if (this._receiveMsgTimer !== null) {
            clearTimeout(this._receiveMsgTimer);
        }
        if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
        }
        if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
        }
    }

    public isAutoReconnect() {
        return this._autoReconnect != 0 && this._isNeedReconnect;
    }

    public rejectReconnect() {
        this._autoReconnect = 0;
        this.clearTimer();
    }
}