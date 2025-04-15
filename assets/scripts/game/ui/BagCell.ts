import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import { BagInfo } from "../datas/BagData";
import { PlayerMgr } from "../manager/PlayerMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BagCell extends ListItem {
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
        this.numLab.string = "" + data.goodsNum
    }
}
