import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { UIMgr } from "../../framework/manager/UIMgr";
import { EventName, UIID } from "../config/Config";
import { GoodsType, LobbyType, LobbyTypeStr, SGToGoodsType } from "../config/GameEnum";
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
    @property(cc.Node)
    xiangguoNode: cc.Node = null
    @property(cc.Node)
    qifNodeArr: cc.Node[] = [];
    @property(cc.Node)
    shuiguoNodeArr: cc.Node[] = [];

    private lobbyType: LobbyType
    onLoad() {
        this.addEvent(EventName.RefreshGoodsData, this.refreshGoodsData)
    }

    start() {
        this.refreshGoodsData()
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
        let item = PlayerMgr.getInstance().getBagData().getGoodsByType(SGToGoodsType[Number(type)])
        if(item.length == 0){
            UIMgr.getInstance().showTips("没有物品")
            return
        }

        UIMgr.getInstance().openUI(UIID.SelectUI, item,(goodsID:number)=>{
            PlayerMgr.getInstance().getBagData().removeGoods(goodsID,1)
            
            this.success.active = true
            cc.log("onShangGongBtn",type)
            PlayerMgr.getInstance().getDayTaskData().doTask(this.lobbyType,Number(type))
            PlayerMgr.getInstance().getUserData().addGoodsData(goodsID,this.lobbyType)
            this.success.opacity = 0
            this.xiangani.paused = false
            this.xiangani.setAnimation(0, "idle1", true)
            cc.tween(this.success).to(1,{opacity:255}).delay(1).call(() => {
                this.success.active = false
                this.xiangani.paused = true
            }).start()
        })
    }

    hideBtn(){
        this.content.children.forEach((item:cc.Node) => {
            item.getChildByName("btn").active = false
        })
    }

    refreshGoodsData(){
        let xhdata = PlayerMgr.getInstance().getUserData().getGoodsByAllType(this.lobbyType,GoodsType.XiangHuo)
        let qfdata = PlayerMgr.getInstance().getUserData().getGoodsByAllType(this.lobbyType,GoodsType.QiFu)
        let sgdata = PlayerMgr.getInstance().getUserData().getGoodsByAllType(this.lobbyType,GoodsType.Fruit)
        let fdata = PlayerMgr.getInstance().getUserData().getGoodsByAllType(this.lobbyType,GoodsType.Flower)

        if(xhdata.length > 0){
            let newData = xhdata[xhdata.length - 1]
            this.xiangguoNode.active = true
            let sprite = this.xiangguoNode.getComponent(cc.Sprite)
            this.setSprite(sprite, "item", "" + newData.goodsid)
        }

        let num = 0
        for(let i = 0;i < qfdata.length;i++){
            let newData = qfdata[i]
            //最新的两个
            if(i == qfdata.length - 1 || i == qfdata.length - 2){
                this.qifNodeArr[num].active = true
                let sprite = this.qifNodeArr[num].getComponent(cc.Sprite)
                this.setSprite(sprite, "item", "" + newData.goodsid)
                num+=1
            }
        }

        let num2 = 0
        cc.log("sgdata===>",sgdata)
        for(let i = 0;i < sgdata.length;i++){
            let newData = sgdata[i]
            //最新的两个
            cc.log("num2===>",num2)
            if(i == sgdata.length - 1 || i == sgdata.length - 2){
                this.shuiguoNodeArr[num2].active = true
                let sprite = this.shuiguoNodeArr[num2].getChildByName("icon").getComponent(cc.Sprite)
                this.setSprite(sprite, "item", "" + newData.goodsid)
                num2+=1
            }
        }

        let num3 = 0
        for(let i = 0;i < fdata.length;i++){
            let newData = fdata[i]
            //最新的两个
            if(i == fdata.length - 1 || i == fdata.length - 2){
                this.shuiguoNodeArr[num3].active = true
                let sprite = this.shuiguoNodeArr[num3].getChildByName("icon").getComponent(cc.Sprite)
                this.setSprite(sprite, "item", "" + newData.goodsid)
                num3+=1
            }
        }
    }
}
