import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";
import ScoreExCell from "./ScoreExCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RewardUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    onLoad() {

    }

    start() {
    }

    updateView(){
        
    }
}
