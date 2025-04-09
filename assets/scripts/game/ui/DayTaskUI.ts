import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { EventName } from "../config/Config";
import { DayTasksExtendedCfg } from "../datas/DayTaskData";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DayTaskUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(List) uList: List = null;
    private dataList: DayTasksExtendedCfg[] = [];

    onLoad() {
        this.addEvent(EventName.RefreshTask, this.updateList)
    }

    start() {
        this.updateList()
    }

    closeUI(){
        super.closeUI()
    }

    updateList(){
        this.dataList = PlayerMgr.getInstance().getDayTaskData().getTodayTask()
        cc.log("DayTaskUI::list", this.dataList)
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
            ctl.updateView(singleData,this)
        }
    }
}
