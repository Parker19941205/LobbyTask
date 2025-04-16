import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { UIMgr } from "../../framework/manager/UIMgr";
import { IRewardConfig } from "../config/InterFaceConfig";
import { BagInfo } from "../datas/BagData";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";
import RewardCell from "./RewardCell";
import ScoreExCell from "./ScoreExCell";
import SelectCell from "./SelectCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    private selectCallback:Function = null

    onLoad() {
        this.cell.active = false
    }

    start() {
    }

    init(rewardItem:BagInfo[], selectCallback:Function) {
        this.selectCallback = selectCallback
        if(rewardItem.length < 4) {
            this.content.getComponent(cc.Widget).isAlignHorizontalCenter = true
            this.content.getComponent(cc.Widget).horizontalCenter = 0
        }

        this.content.removeAllChildren()
        for(let i = 0; i < rewardItem.length; i++){
            let cell = cc.instantiate(this.cell)
            cell.active = true
            cell.parent = this.content
            cell.attr({data: rewardItem[i]})
            cell.getComponent(SelectCell).updateView(rewardItem[i],this)
        }
    }

    onOkClick() {
        let goodsID = []
        for(let i = 0; i < this.content.children.length; i++){
            let toggle = this.content.children[i].getComponent(cc.Toggle)
            if(toggle.isChecked) {
                let data = this.content.children[i]["data"] as BagInfo
                goodsID.push(data.goodsID)
            }
        }
        if(goodsID.length == 0) {
            UIMgr.getInstance().showTips("请选择物品")
            return
        }

        if(this.selectCallback) {
            this.selectCallback(goodsID)
            this.closeUI()
        }
    }
}
