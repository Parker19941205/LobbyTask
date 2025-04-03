import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DayTaskUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(List) uList: List = null;
    private dataList: any[] = [];

    onLoad() {

    }

    start() {
        this.dataList = PlayerMgr.getInstance().getDayTaskData().getAllTask()
        cc.log("DayTaskUI::start111", this.dataList)
        this.updateList()
    }

    updateList(){
        this.uList.numItems = this.dataList.length;
        this.uList.scrollTo(0,0.1);
    }
      /**
     * 复用的item回调
     */
    public itemRefresh(obj: cc.Node, idx: number) {
        //cc.log("itemRefresh ::", idx)
        let dateSource = this.dataList
        let tItem = obj
        let ctl = tItem.getComponent(DayTaskCell)
        let singleData = dateSource[idx]
        if (idx <= dateSource.length) {
            ctl.updateView(singleData)
        }
    }
}
