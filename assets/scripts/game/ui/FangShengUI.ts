import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { ResourceMgr } from "../../framework/manager/ResourceMgr";
import { UIMgr } from "../../framework/manager/UIMgr";
import { Utils } from "../../framework/utils/Utils";
import { UIID } from "../config/Config";
import { GoodsType, LobbyType } from "../config/GameEnum";
import { IRewardConfig } from "../config/InterFaceConfig";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FangShengUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    fishCell: cc.Node = null;

    onLoad() {

    }

    start() {
        this.updateFsData()
    }
    
    updateFsData(){
        this.content.removeAllChildren()
        let data = PlayerMgr.getInstance().getUserData().getGoodsByLobbyType(LobbyType.FangShengChi)
        for(let i = 0;i<data.length;i++){
            let cfg = DataMgr.getInstance().getGoodsCfgByID(data[i].goodsid)
            for(let j = 0;j<data[i].num;j++){
                let cell = cc.instantiate(this.fishCell)
                cell.parent = this.content
                cell.setPosition(cc.v2(0,0))
                this.loadBundleSpine(cell.getComponent(sp.Skeleton),"fishani",cfg.resid)

                //动物左右移动并翻转
                let size = this.content.getContentSize()
                let time = Utils.randomRang(10,15)
                let action = cc.sequence(
                    cc.spawn(cc.moveTo(time,cc.v2(-size.width/2,0)),cc.scaleTo(0.1,1,1)),
                    cc.spawn(cc.moveTo(time,cc.v2(size.width/2,0)),cc.scaleTo(0.1,-1,1))
                )
                cell.runAction(cc.repeatForever(action))
            }
        }
    }

    onFangShengBtn() {
        let item = PlayerMgr.getInstance().getBagData().getGoodsByType(GoodsType.Animal)
        if(item.length == 0){
            UIMgr.getInstance().showTips("没有可以放生的动物")
            return
        }

        UIMgr.getInstance().openUI(UIID.SelectUI, item,(goodsID:number)=>{
            UIMgr.getInstance().showTips("放生成功")
            PlayerMgr.getInstance().getBagData().removeGoods(goodsID,1)
            PlayerMgr.getInstance().getUserData().addGoodsData(goodsID,LobbyType.FangShengChi)
            this.updateFsData()
        })
    }
}
