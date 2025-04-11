import { ScoreExchangeCfg } from "../../../resources/configs/GameDataCfg";
import ListItem from "../../framework/commonts/ListItem";
import { IRewardConfig } from "../config/InterFaceConfig";
import { BagInfo } from "../datas/BagData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectCell extends ListItem {
    @property(cc.Label)
    numLab: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    onLoad() {
    }

    start() {

    }

    updateView(data: BagInfo) {
        this.setSprite(this.icon, "item", "" + data.goodsID)
        this.numLab.string =  "x"+ data.goodsNum
    }
}
