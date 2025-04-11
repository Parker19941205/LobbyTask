import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { ResourceMgr } from "../../framework/manager/ResourceMgr";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { GoodsType } from "../config/GameEnum";
import { IRewardConfig } from "../config/InterFaceConfig";
import { PlayerMgr } from "../manager/PlayerMgr";
import DayTaskCell from "./DayTaskCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FangShengUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(sp.Skeleton)
    fishSpine: sp.Skeleton = null;

    onLoad() {

    }

    start() {
        // let animationJson = this.petList[index].animationJson
        // let animationAtlas = this.petList[index].animationAtlas
        // let animationPng = this.petList[index].animationPng
        // this.setRemoteSpine(this.fishSpine,animationJson,animationAtlas,animationPng)

        this.loadBundleSpine(this.fishSpine,"fishani","fish01")
    }

    onFangShengBtn() {
        let item = PlayerMgr.getInstance().getBagData().getGoodsByType(GoodsType.Animal)
        UIMgr.getInstance().openUI(UIID.SelectUI, item)
    }
}
