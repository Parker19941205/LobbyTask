import { ScoreExchangeCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { IRewardConfig } from "../config/InterFaceConfig";
import { BagInfo } from "../datas/BagData";
import { PlayerMgr } from "../manager/PlayerMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreExCell extends ListItem {
    @property(cc.Label)
    scoreLab: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    private config: ScoreExchangeCfg = null;
    onLoad() {
    }

    start() {

    }

    updateView(config: ScoreExchangeCfg) {
        this.config = config
        this.setSprite(this.icon, "item", "" + config.goodsid)
        this.scoreLab.string =  config.score + '积分'
    }

    onExchangeBtn() {
        //检查积分是否足够
        let score = PlayerMgr.getInstance().getUserInfo().score
        if(score < this.config.score) {
            UIMgr.getInstance().showTips("积分不足")
            return
        }
        
        PlayerMgr.getInstance().getUserData().changeScore(-this.config.score)

        //领取奖励
        let rewardItem:IRewardConfig[] = [
            {goodsid: this.config.goodsid,num:1}
        ]
        UIMgr.getInstance().openUI(UIID.RewardUI, rewardItem)
    }
}
 





