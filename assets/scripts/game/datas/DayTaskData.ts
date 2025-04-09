import { DayTasksCfg } from "../../../resources/configs/GameDataCfg";
import { BaseData } from "../../framework/base/BaseData";
import { EventMgr } from "../../framework/manager/EventMgr";
import { TimeUtils } from "../../framework/utils/TimeUtils";
import { EventName, GameConfig } from "../config/Config";
import { LobbyType, ShangGongType } from "../config/GameEnum";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";

export interface DayTasksExtendedCfg extends DayTasksCfg {
    /** 新增字段：任务是否已完成 */
    isCompleted: boolean;
    /** 新增字段：是否领取 */
    isGet: boolean;
    /** 新增字段：当前进度 */
    currentNum: number;
}

class Data {
    /**任务列表 */
    dayTask: DayTasksExtendedCfg[] = []
    lastSaveTime: number = -1; //上次保存数据的时间
}

export class DayTaskData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "TaskData";

    public createData(): Data {
        this.data = new Data();

        //初始化任务数据
        let newData:DayTasksExtendedCfg[] = []
        let taskList = this.getAllTask()
        for(var i = 0; i < taskList.length; i++){
            let task = taskList[i]
            let newTask:DayTasksExtendedCfg = task as DayTasksExtendedCfg
            newTask.isCompleted = false
            newTask.isGet = false
            newTask.currentNum = 0
            newData.push(newTask)
        }
        this.data.dayTask = newData
        this.data.lastSaveTime = TimeUtils.GetTimeBySecond();

        this.saveData();
        return this.data;
    }

    initData(isNew:boolean) {
        cc.log("TaskData:initData",isNew,this.data.dayTask);
        if(!isNew){
            if(TimeUtils.compareIsToday(this.data.lastSaveTime)){
                return
            }
            cc.log("初始化任务数据")
            this.data.lastSaveTime = TimeUtils.GetTimeBySecond();
            for(var i = 0; i < this.data.dayTask.length; i++){
                let task = this.data.dayTask[i];
                task.currentNum = 0;
                task.isGet = false;
                task.isCompleted = false;
            }
            this.saveData()
        }
    }

    getDayTaskByType(lobbyType: LobbyType,shangGongType:ShangGongType) :DayTasksExtendedCfg {
        let data = this.data.dayTask.find(item => item.gotoid == lobbyType && item.tasktype == shangGongType)
        return data
    }

    getDayTaskByID(taskid:number) :DayTasksExtendedCfg {
        let data = this.data.dayTask.find(item => item.id == taskid)
        return data
    }

    doTask(lobbyType: LobbyType,shangGongType:ShangGongType) {
        cc.log("完成任务",lobbyType,shangGongType)
        let data = this.getDayTaskByType(lobbyType,shangGongType)
        cc.log("data",data)
        if(data){
            data.currentNum += 1
            if(data.currentNum >= data.targetnum){
                data.isCompleted = true
            }
        }
        this.saveData()
    }

    getAllTask() :DayTasksCfg[] {
        let data = DataMgr.getInstance().getAllDayTaskCfg()
        return data;
    }

    getTodayTask() :DayTasksExtendedCfg[] {
        let list = []
        let dayTask = this.data.dayTask
        for(var i = 0; i < dayTask.length; i++){
            let config = dayTask[i];
            if(config.isGet == false){
                list.push(config)
            }
        }
        return list;
    }

    /**领取任务奖励 */
    getTaskReward(taskid:number) {
        let data = this.getDayTaskByID(taskid)
        if(data){
            data.isGet = true
        }
        this.saveData()
        EventMgr.getInstance().emit(EventName.RefreshTask)
    }

}