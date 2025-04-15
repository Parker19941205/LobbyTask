import { BaseData } from "../../framework/base/BaseData"
import { EventMgr } from "../../framework/manager/EventMgr"
import { EventName, GameConfig } from "../config/Config"

class Data {
    /**是否获得入口奖励 */
    isEnterReward: boolean = false;
   

}

export class GameData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "USER_DATA";


    /**没有数据时候 执行 */
    public createData(): Data {
        this.data = new Data();
        return this.data;
    };
  

    initData() {
        cc.log("GameData initData")
    }

    getEnterReward():boolean{
       return this.data.isEnterReward;
    }

    setEnterReward(value:boolean){
        this.data.isEnterReward = value;
        this.saveData()
    }

   
}
