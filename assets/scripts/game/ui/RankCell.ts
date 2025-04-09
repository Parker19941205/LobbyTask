import { RankCfg } from "../../../resources/configs/GameDataCfg";
import BaseUI from "../../framework/base/BaseUI";
import ListItem from "../../framework/commonts/ListItem";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { IRewardConfig } from "../config/InterFaceConfig";
import { DayTasksExtendedCfg } from "../datas/DayTaskData";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskUI from "./DayTaskUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankCell extends ListItem {
    @property(cc.Label)
    nicknameLab: cc.Label = null;
    @property(cc.Label)
    gongdeLab: cc.Label = null;
    @property(cc.Label)
    rankLab: cc.Label = null;
    @property(cc.Sprite)
    headImg: cc.Sprite = null;
    @property(cc.Node)
    btn: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;

    private config: RankCfg = null;
    private delegate: DayTaskUI = null;
    private rewardCfg:{rank: number, goodsid: number}[] = [
        {rank: 1, goodsid: 1},
        {rank: 2, goodsid: 2},
        {rank: 3, goodsid: 3},
    ]

    onLoad() {
    }

    start() {
    }

    updateView(config:RankCfg,delegate) {
        this.config = config
        this.delegate = delegate
        this.nicknameLab.string = config.nickname
        this.rankLab.string = "" + config.rank
        this.gongdeLab.string = "" + config.gongde
        this.bg.getComponent(UIToggle).setToggle(config.rank < 4 ? config.rank-1 : 3)
        this.btn.active = config.rank < 4 && config.uid == PlayerMgr.getInstance().getUserInfo().uid
    }

    onClickBtn(){
        let goodsid = this.rewardCfg[this.config.rank-1].goodsid
        //领取奖励
        let rewardItem:IRewardConfig[] = [
            {goodsid: goodsid,num:1}
        ]
        UIMgr.getInstance().openUI(UIID.RewardUI, rewardItem)
    }
}
