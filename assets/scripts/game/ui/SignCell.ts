import { SignCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import { BaseButton } from "../../framework/commonts/BaseButton";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { EventName, UIID } from "../config/Config";
import { IRewardConfig } from "../config/InterFaceConfig";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignCell extends BaseUI {
    @property(cc.Node)
    btn: cc.Node = null;
    @property(cc.Sprite)
    title: cc.Sprite = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    private day: number = 0;
    private cfg: SignCfg = null;
    onLoad() {
        this.addEvent(EventName.RefreshSign, this.updateSignInfo)
    }

    start() {
    }

    updateView(day: number) {
        this.day = day
        let sign_in = PlayerMgr.getInstance().getSignData().checkIsSigned(day)
        let cfg = DataMgr.getInstance().getSignCfgByDay(day)
        this.cfg = cfg

        this.setSprite(this.title, "sign",""+day)
        this.setSprite(this.icon, "item","" + cfg.reward)

        let sign_today = PlayerMgr.getInstance().getSignData().checkCanSign(day)
        this.btn.getComponent(UIToggle).setToggle(sign_today && !sign_in?1:0)
        this.node.getComponent(UIToggle).setToggle(sign_today?1:0)
        this.btn.getComponent(BaseButton).interactable = sign_today && !sign_in
    }

    onClickBtn() {
        UIMgr.getInstance().showTips("签到成功")
        //领取奖励
        let rewardItem:IRewardConfig[] = [
            {goodsid: this.cfg.reward,num:1}
        ]
        UIMgr.getInstance().openUI(UIID.RewardUI, rewardItem)
        PlayerMgr.getInstance().getSignData().startSign(this.day)
    }

    updateSignInfo(day: number) {
        if(this.day == day) {
            this.updateView(day)
        }
    }
}
