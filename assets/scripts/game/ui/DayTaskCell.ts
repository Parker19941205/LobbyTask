import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { DayTasksExtendedCfg } from "../datas/DayTaskData";
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
    @property(cc.Node)
    btnNode: cc.Node = null;

    private taskConfig: DayTasksExtendedCfg = null;
    private delegate: DayTaskUI = null;

    onLoad() {
    }

    start() {

    }

    updateView(taskConfig:DayTasksExtendedCfg,delegate) {
        this.taskConfig = taskConfig
        this.delegate = delegate
        this.title.string = taskConfig.title
        this.jinduLab.string = "功德" + "+" + taskConfig.reward
        this.btnLab.string = taskConfig.isCompleted ? "领取" : "前往"
        this.btnNode.getComponent(UIToggle).setToggle(taskConfig.isCompleted ? 1 : 0)
    }

    onClickBtn(){
        if(this.taskConfig.isCompleted){
            PlayerMgr.getInstance().getDayTaskData().getTaskReward(this.taskConfig.id)
            PlayerMgr.getInstance().getUserData().changeMerit(this.taskConfig.reward)
        }else{
            this.delegate.closeUI()
            UIMgr.getInstance().openUI(UIID.LobbyUI,this.taskConfig.gotoid)
        }
    }
}
