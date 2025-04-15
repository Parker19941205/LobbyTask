import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FangShengUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
   
    onLoad() {

    }

    start() {
   
    }

}
