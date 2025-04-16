import { ScoreExchangeCfg } from "../../../resources/configs/GameDataCfg";
import ListItem from "../../framework/commonts/ListItem";
import { IRewardConfig } from "../config/InterFaceConfig";
import { BagInfo } from "../datas/BagData";
import SelectUI from "./SelectUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectCell extends ListItem {
    @property(cc.Label)
    numLab: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    
    private delegate:SelectUI
    private data: BagInfo
    onLoad() {
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onItemClick, this)
    }

    updateView(data: BagInfo,delegate) {
        this.delegate = delegate;
        this.data = data
        this.setSprite(this.icon, "item", "" + data.goodsID)
        this.numLab.string =  "x"+ data.goodsNum
    }

    onItemClick(){
        //this.delegate.onSelect(this.data)
    }
}
