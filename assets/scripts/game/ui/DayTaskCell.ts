import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import { PlayerMgr } from "../manager/PlayerMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DayTaskCell extends ListItem {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    private dataList: any[] = [];
    
    onLoad() {
    }

    start() {

    }

    updateView(taskData){

    }
}
