import BaseUI from "../../framework/base/BaseUI";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import { LobbyType } from "../config/GameEnum";
import EggController from "./EggController";

const { ccclass, property } = cc._decorator;

/**主界面 */
@ccclass
export default class UIHome extends BaseUI {
    @property(cc.Node)
    root: cc.Node = null;

    onLoad(){
        console.log("UIHome:onLoad")
    }

    onToggleHide(){
        console.log("UIHome:onToggleHide")
    }

    onToggleShow(){
        console.log("UIHome:onToggleShow")

    }

    onDestroy(){
        super.onDestroy()
    }

    start(){
        console.log("UIHome:start")
    

        // let angle = this.calculateEntryRelativeAngle(cc.v2(200, -100))
        // cc.log("angle===>",angle)
    }
  

    onDayTaskBtn(){
        UIMgr.getInstance().openUI(UIID.DayTaskUI)
    }

    onBagBtn(){
        UIMgr.getInstance().openUI(UIID.BagUI)
    }

    onSignBtn(){
        UIMgr.getInstance().openUI(UIID.SignUI)
    }

    onScoreBtn(){
        UIMgr.getInstance().openUI(UIID.ScoreExUI)
    }

    onGotoBtn(event:cc.Event.EventTouch,lobbyType:LobbyType){
        console.log("UIHome:onGotoBtn",lobbyType)
        UIMgr.getInstance().openUI(lobbyType == LobbyType.FangShengChi ? UIID.FangShengUI : UIID.LobbyUI,Number(lobbyType))
    }
  
    
    
}
