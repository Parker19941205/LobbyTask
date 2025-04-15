import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskUI from "./DayTaskUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DayTaskCell extends ListItem {
    @property(cc.Label)
    title: cc.Label = null;
    @property(cc.Label)
    jinduLab: cc.Label = null;
    @property(cc.Label)
    btnLab: cc.Label = null;

    private dataList: any[] = [];
    private taskConfig: any = null;
    private delegate: DayTaskUI = null;

    onLoad() {
    }

    start() {

    }

    updateView(taskConfig,delegate) {
        this.taskConfig = taskConfig
        this.delegate = delegate
        let data = PlayerMgr.getInstance().getDayTaskData().getTaskByID(taskConfig.id);
        this.title.string = taskConfig.title
        this.jinduLab.string = "功德" + "+" + taskConfig.reward
        this.btnLab.string = data.isfinish ? "领取" : "前往"
    }

    onClickBtn(){
        this.delegate.closeUI()
        UIMgr.getInstance().openUI(UIID.LobbyUI,Number(this.taskConfig.gotoid))
    }
}
