import BaseUI from "../../framework/base/BaseUI";
import UIToggle from "../../framework/commonts/UIToggle";
import { UIMgr } from "../../framework/manager/UIMgr";
import { UIID } from "../config/Config";
import EggController from "./EggController";


const { ccclass, property } = cc._decorator;

enum PropType{
    /**球 */
    Ball = 1,
    /*交换 */
    Swap = 2,
    /*锤子 */
    Hammer = 3,
    /**闪电 */
    Lightning = 4
}

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

  
  
    
    
}
