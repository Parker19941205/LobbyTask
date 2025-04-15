import { BaseData } from "../../framework/base/BaseData";
import { EventMgr } from "../../framework/manager/EventMgr";
import { TimeUtils } from "../../framework/utils/TimeUtils";
import { EventName, GameConfig } from "../config/Config";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import { DayTasksCfg } from "./GameData";


export class DayTaskInfo{
    /** 任务id */
    taskID:number
    /** 当前完成进度 */
    finishrate:number = 0
    /** 是否领取 */
    isget:boolean = false
    /** 是否达成 */
    isfinish:boolean = false
}

class Data {
    /**任务列表 */
    dayTask: DayTaskInfo[] = []  //每日任务的完成情况
}

export class DayTaskData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "TaskData";

    public createData(): Data {
        this.data = new Data();
        this.saveData();
        return this.data;
    }

    initData() {
        cc.log("TaskData:initData");
        // if(TimeUtils.compareIsToday(this.data.taskTime)){
        //     cc.log("今天已经初始化过任务数据了")
        //     return
        // }
        // cc.log("初始化任务数据")
        // this.data.taskTime = TimeUtils.GetTimeBySecond();
        // for(var i = 0; i < this.data.taskList.length; i++){
        //     let task = this.data.taskList[i];
        //     task.currentNum = 0;
        //     task.isFinish = false;
        //     task.isGet = false;
        // }
        // this.saveData()
    }

    getAllTask() :DayTasksCfg[] {
        let data = DataMgr.getInstance().getAllDayTaskCfg()
        return data;
    }

    getTaskByID(taskID: number) :DayTaskInfo {
        let data = this.data.dayTask.find(task => task.taskID == taskID)
        if(!data){
            data = new DayTaskInfo()
            data.taskID = taskID
            this.data.dayTask.push(data)
        }
        return data;
    }

    getTodayTask() {
        let list = []
        let configData = this.getAllTask()
        for(var i = 0; i < configData.length; i++){
            let config = configData[i];
            let task = this.getTaskByID(config.id)
            if(task.isget == false || task.isfinish == false){
                list.push(config)
            }
        }
        return list;
    }

    updateTaskData(mtaskType: TaskType) {
        for(var i = 0; i < this.data.taskList.length; i++){
            let task = this.data.taskList[i];
            let taskType = task.taskType
            if(mtaskType == taskType && !task.isFinish){
                task.currentNum++
                if(task.currentNum >= task.targetNum){
                    task.isFinish = true
                }
            }              
        }
        this.saveData()
        EventMgr.getInstance().emit(EventName.RefreshTaskView)
    }

    setRewardGet(taskID: number) {
        for(var i = 0; i < this.data.taskList.length; i++){
            let task = this.data.taskList[i];
            if(task.taskID == taskID){
                task.isGet = true
                break;
            }
        }
        this.saveData()
        EventMgr.getInstance().emit(EventName.RefreshTaskView)
    }
}