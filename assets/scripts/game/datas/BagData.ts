import { BaseData } from "../../framework/base/BaseData";
import { EventName, GameConfig } from "../config/Config";
import { GoodsType } from "../config/GameEnum";
import { DataMgr } from "../manager/DataMgr";

export class BagInfo{
    /** 物品id */
    goodsID:number
    /** 物品数量 */
    goodsNum:number = 1
}

class Data {
    bagList: BagInfo[] = []
}

export class BagData extends BaseData {
    data: Data;
    gameKey: string = GameConfig.AppCacheName + "BagData";

    public createData(): Data {
        this.data = new Data();
        this.saveData();
        return this.data;
    }

    initData() {
    }

    addGoods(id: number)  {
        let data = this.data.bagList.find(item => item.goodsID == id)
        if(!data){
            data = new BagInfo()
            data.goodsID = id
            this.data.bagList.push(data)
        }else{
            data.goodsNum += 1
        }
        this.saveData()
    }

    getGoodsByType(type: GoodsType) :BagInfo[] {
        let list = []
        for(let i = 0; i < this.data.bagList.length; i++){
            let goodsID = this.data.bagList[i].goodsID
            let item = DataMgr.getInstance().getGoodsCfgByID(goodsID)
            if(item.type == type){
                list.push(this.data.bagList[i])
            }
        }
        return list
    }

    
}