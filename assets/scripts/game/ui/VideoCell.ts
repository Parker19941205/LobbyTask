import { ScoreExchangeCfg, VideoCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { IRewardConfig } from "../config/InterFaceConfig";
import { PlatformManager } from "../manager/PlatformManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VideoCell extends ListItem {
    @property(cc.Node)
    btn: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    private isCanGet: boolean = false
    private config: VideoCfg = null;
    onLoad() {
    }

    start() {

    }

    updateView(config: VideoCfg) {
        this.config = config
        this.setSprite(this.icon, "item", "" + config.goodsid)
    }

    onVideoBtn(){
        if(!this.isCanGet){
            PlatformManager.getInstance().showVideoAd(() => {
                this.isCanGet = true
                this.updateBtn()
            })
        } else {
            //领取奖励
            let rewardItem:IRewardConfig[] = [
                {goodsid: this.config.goodsid,num:1}
            ]
            UIMgr.getInstance().openUI(UIID.RewardUI, rewardItem)
            this.isCanGet = false
            this.updateBtn()
        }
    }

    updateBtn(){
        this.btn.getComponent(UIToggle).setToggle(this.isCanGet ? 1 : 0)
    }
}
