import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { LobbyType, LobbyTypeStr } from "../config/GameEnum";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyUI extends BaseUI {
    @property(cc.Label)
    titleLab: cc.Label = null;
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;
    @property(cc.Node)
    success: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Sprite)
    roleSprite: cc.Sprite = null;
    @property(sp.Skeleton)
    xiangani: sp.Skeleton = null;

    private lobbyType: LobbyType
    onLoad() {

    }

    start() {
    }

    init(lobbyType:LobbyType){
        this.lobbyType = lobbyType
        this.titleLab.string = LobbyTypeStr[lobbyType]
        this.setSprite(this.bgSprite, "lobby", "" + lobbyType)
        this.setSprite(this.roleSprite, "role", "" + lobbyType)
    }

    onBottomBtn(event: cc.Event.EventTouch,type:string) {
        cc.log("onBottomBtn",event,type)
        this.hideBtn()
        event.target.getChildByName("btn").active = true
    }

    onShangGongBtn(event: cc.Event.EventTouch,type:string) {
        this.success.active = true
        cc.log("onShangGongBtn",type)
        PlayerMgr.getInstance().getDayTaskData().doTask(this.lobbyType,Number(type))
        this.success.opacity = 0
        this.xiangani.paused = false
        this.xiangani.setAnimation(0, "idle1", true)
        cc.tween(this.success).to(1,{opacity:255}).delay(1).call(() => {
            this.success.active = false
            this.xiangani.paused = true
        }).start()
    }

    hideBtn(){
        this.content.children.forEach((item:cc.Node) => {
            item.getChildByName("btn").active = false
        })
    }
}
