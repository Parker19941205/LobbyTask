import { ScoreExchangeCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { BagInfo } from "../datas/BagData";
import { PlayerMgr } from "../manager/PlayerMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreExCell extends ListItem {
    @property(cc.Label)
    scoreLab: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    onLoad() {
    }

    start() {

    }

    updateView(data: ScoreExchangeCfg) {
        this.setSprite(this.icon, "item", "" + data.goodsid)
        this.scoreLab.string =  data.score + '积分'
    }

    onExchangeBtn() {
         UIMgr.getInstance().openUI(UIID.RewardUI)
    }
}
 





