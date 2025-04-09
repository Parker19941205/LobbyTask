import { DayTasksCfg, GameData, GoodsCfg, RankCfg, ScoreExchangeCfg, SignCfg, VideoCfg } from "../../../resources/configs/GameDataCfg";
import { BaseEventName, LoadingProcess } from "../../framework/configs/Appcfg";
import { EventMgr } from "../../framework/manager/EventMgr";
import { LogMgr } from "../../framework/manager/LogMgr";
import { ResourceMgr } from "../../framework/manager/ResourceMgr";

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
    }

    
    public getAllDayTaskCfg(): DayTasksCfg[] {
        return this.data.DayTasksCfg;
    }

    public getAllSignCfg(): SignCfg[] {
        return this.data.SignCfg;
    }

    public getAllGoodsCfg(): GoodsCfg[] {
        return this.data.GoodsCfg;
    }

    public getAllScoreExCfg(): ScoreExchangeCfg[] {
        return this.data.ScoreExchangeCfg;
    }

    public getAllRankCfg(): RankCfg[] {
        return this.data.RankCfg;
    }

    public getAllVideoCfg(): VideoCfg[] {
        return this.data.VideoCfg;
    }


    public getSignCfgByDay(day: number): SignCfg {
        return this.data.SignCfg.find((cfg) => cfg.id == day);
    }


    public getRankData(): RankCfg[] {
        return this.getAllRankCfg().sort((a, b) => { return a.gongde - b.gongde })
    }
}