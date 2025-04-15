import { BaseData } from "../../framework/base/BaseData"
import { EventMgr } from "../../framework/manager/EventMgr";
import { UIMgr } from "../../framework/manager/UIMgr";
import { EventName, GameConfig } from "../config/Config"

class Data {
    /**玩家uid */
    uid: string = "";
    /**昵称 */
    nickname: string = "";
    /**头像 */
    avatar:string = "";
    /**积分 */
    score:number = 0;
}


export class UserData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "USER_DATA"

    /**没有数据时候 执行 */
    public createData(): Data {
        this.data = new Data();
        cc.log("加载用户数据===========>",this.data)
        return this.data;
    };
  

    initData() {
    }

    setUserData(data){

    }


    /**
     * 更新积分值
     * @param num 正数增加，负数减少
     * */
    changeEnergy(num:number){
        if(num > 0){
            this.data.score += num;
            UIMgr.getInstance().showTips("获得能量+"+num)
            EventMgr.getInstance().emit(EventName.FlyCurrency, num)
        }else{
            this.data.score -= Math.abs(num);
            UIMgr.getInstance().showTips("消耗能量-"+Math.abs(num))
            EventMgr.getInstance().emit(EventName.RefreshEenergy,num)
        }
    }

}
