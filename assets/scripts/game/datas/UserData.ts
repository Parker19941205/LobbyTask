import { RankCfg } from "../../../resources/configs/GameDataCfg";
import { BaseData } from "../../framework/base/BaseData"
import { EventMgr } from "../../framework/manager/EventMgr";
import { UIMgr } from "../../framework/manager/UIMgr";
import { EventName, GameConfig } from "../config/Config"
import { LobbyType } from "../config/GameEnum";
import { IRewardConfig } from "../config/InterFaceConfig";
import { DataMgr } from "../manager/DataMgr";

class Data {
    /**玩家uid */
    uid: string = "0000";
    /**昵称 */
    nickname: string = "哈哈哈";
    /**头像 */
    avatarid:number = 0;
    /**积分 */
    score:number = 1000;
    /**功德 */
    merit:number = 0;
    /**放生池数据 */
    fangshengData:IRewardConfig[] = [];
}



export class UserData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "USER_DATA"

    /**没有数据时候 执行 */
    public createData(): Data {
        this.data = new Data();
        cc.log("加载用户数据===========>",this.data)
        this.saveData()
        return this.data;
    };
  

    initData() {
        let allData = DataMgr.getInstance().getRankData()
        //将自己的排名插入到数据中，根据功德值排序
        let myData:RankCfg = {
            id:0,
            gongde: this.data.merit,
            nickname: this.data.nickname,
            headid: this.data.avatarid,
            rank: 0,
            uid: this.data.uid,
        }
        cc.log("将自己的排名插入到数据中", myData)
        allData.push(myData)
    }
    

    setUserData(data){
    }


    /**
     * 更新积分值
     * @param num 正数增加，负数减少
     * */
    changeScore(num:number){
        if(num > 0){
            this.data.score += num;
            UIMgr.getInstance().showTips("获得积分+"+num)
        }else{
            this.data.score -= Math.abs(num);
            //UIMgr.getInstance().showTips("消耗能量-"+Math.abs(num))
        }
        EventMgr.getInstance().emit(EventName.FlyCurrency, num)
        this.saveData()
    }

     /**
     * 更新功德值
     * @param num 正数增加，负数减少
     * */
    changeMerit(num:number){
        if(num > 0){
            this.data.merit += num;
            UIMgr.getInstance().showTips("获得功德+"+num)
            //EventMgr.getInstance().emit(EventName.FlyCurrency, num)
        }else{
            this.data.merit -= Math.abs(num);
            UIMgr.getInstance().showTips("消耗功德-"+Math.abs(num))
            //EventMgr.getInstance().emit(EventName.RefreshEenergy,num)
        }
        this.updateRank()
        this.saveData()
    }

    addFsGoods(id: number)  {
        let data = this.data.fangshengData.find(item => item.goodsid == id)
        if(!data){
            data = {
                goodsid: id,
                num: 1,
            }
            this.data.fangshengData.push(data)
        }else{
            data.num += 1
        }
        this.saveData()
    }

    //更新排名数据
    updateRank(){
        let allData = DataMgr.getInstance().getRankData()
        allData.find(item => item.uid == this.data.uid).gongde = this.data.merit
    }

}
