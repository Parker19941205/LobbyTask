import { RankCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { EventName } from "../config/Config";
import { DayTasksExtendedCfg } from "../datas/DayTaskData";
import { DataMgr } from "../manager/DataMgr";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";
import RankCell from "./RankCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankUI extends BaseUI {
    @property(cc.Label)
    nameLab: cc.Label = null;
    @property(cc.Label)
    gongdeLab: cc.Label = null;
    @property(cc.Sprite)
    head: cc.Sprite = null;
    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(List) uList: List = null;
    private dataList: RankCfg[] = [];

    onLoad() {
        this.addEvent(EventName.RefreshTask, this.updateList)
    }

    start() {
        this.getRankData()
        this.updateMyInfo()
    }

    closeUI(){
        super.closeUI()
    }

    getRankData(){
        let allData = DataMgr.getInstance().getRankData()
        allData.sort((a, b) => {
            return b.gongde - a.gongde
        })
        for(let i = 0; i < allData.length; i++){
            allData[i].id = i + 1
            allData[i].rank = i + 1
        }
        this.dataList = allData
        this.updateList()
    }

    updateList(){
        cc.log("DayTaskUI::list", this.dataList)
        this.uList.numItems = this.dataList.length;
        this.uList.scrollTo(0,0.1);
    }
      /**
     * 复用的item回调
     */
    public itemRefresh(obj: cc.Node, idx: number) {
        //cc.log("itemRefresh ::", idx)
        let dateSource = this.dataList
        let tItem = obj
        let ctl = tItem.getComponent(RankCell)
        let singleData = dateSource[idx]
        if (idx <= dateSource.length) {
            ctl.updateView(singleData,this)
        }
    }

    updateMyInfo(){
        this.nameLab.string = PlayerMgr.getInstance().getUserInfo().nickname
        this.gongdeLab.string =  "" + PlayerMgr.getInstance().getUserInfo().merit
        this.rankLab.string =  "" + this.getMyRank()
        //this.setSprite(this.head,)
    }

    //获取自己的排名
    getMyRank():number{
        let item = this.dataList.find(item => item.uid == PlayerMgr.getInstance().getUserInfo().uid)
        return item && item.rank
    }
}
