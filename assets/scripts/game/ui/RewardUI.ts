import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { IRewardConfig } from "../config/InterFaceConfig";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";
import RewardCell from "./RewardCell";
import ScoreExCell from "./ScoreExCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RewardUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    onLoad() {
        this.cell.active = false
    }

    start() {
    }

    init(rewardItem:IRewardConfig[]) {
        if(rewardItem.length < 4) {
            this.content.getComponent(cc.Widget).isAlignHorizontalCenter = true
            this.content.getComponent(cc.Widget).horizontalCenter = 0
        }

        this.content.removeAllChildren()
        for(let i = 0; i < rewardItem.length; i++){
            let cell = cc.instantiate(this.cell)
            cell.active = true
            cell.parent = this.content
            cell.getComponent(RewardCell).updateView(rewardItem[i])
            PlayerMgr.getInstance().getBagData().addGoods(rewardItem[i].goodsid)
        }

    }
}
