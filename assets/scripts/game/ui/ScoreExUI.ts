import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";
import ScoreExCell from "./ScoreExCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreExUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;
    @property(cc.Label)
    scoreLab: cc.Label = null;

    onLoad() {
    }

    start() {
        let list = DataMgr.getInstance().getAllScoreExCfg()
        for(let i = 0; i < list.length; i++){
            let cell = cc.instantiate(this.cell)
            cell.parent = this.content
            cell.getComponent(ScoreExCell).updateView(list[i])
        }

        let score = PlayerMgr.getInstance().getUserInfo().score
        this.scoreLab.string = score + ""

    }

}
