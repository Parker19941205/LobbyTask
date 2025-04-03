import { BaseEventName, LoadingProcess } from "../../framework/configs/Appcfg";
import { EventMgr } from "../../framework/manager/EventMgr";
import { LogMgr } from "../../framework/manager/LogMgr";
import { ResourceMgr } from "../../framework/manager/ResourceMgr";
import { Utils } from "../../framework/utils/Utils";
import { EventName } from "../config/Config";
import { DayTasksCfg, GameData } from "../config/GameDataCfg";



export class DataMgr {
    private static instance: DataMgr;
    private constructor() { }
    public static getInstance(): DataMgr {
        if (this.instance == null) {
            this.instance = new DataMgr();
        }
        return this.instance;
    }


    private data: GameData;
    /**加载 */
    public preload() {
        ResourceMgr.getInstance().loadFromRes("configs/GameJsonCfg", (res: cc.JsonAsset) => {
            this.data = res.json as GameData;
            res.decRef();
            EventMgr.getInstance().emit(BaseEventName.Loading, LoadingProcess.ExcelCfg)
            LogMgr.getInstance().debug("游戏配置表数据========>",this.data)

        })
        EventMgr.getInstance().emit(BaseEventName.Loading, LoadingProcess.ExcelCfg)
    }

    
    public getAllDayTaskCfg(): DayTasksCfg[] {
        return this.data.DayTasksCfg;
    }

}