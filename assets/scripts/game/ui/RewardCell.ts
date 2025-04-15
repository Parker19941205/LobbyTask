import { ScoreExchangeCfg } from "../../../resources/configs/GameDataCfg";
import ListItem from "../../framework/commonts/ListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RewardCell extends ListItem {
    @property(cc.Label)
    numLab: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    onLoad() {
    }

    start() {

    }

    updateView(data: ScoreExchangeCfg) {
        this.setSprite(this.icon, "item", "" + data.goodsid)
        this.numLab.string =  data.score + '积分'
    }
}
