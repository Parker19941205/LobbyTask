const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../game/config/Config";
import menu = cc._decorator.menu;

@ccclass
@menu('自定义组件/背景适配屏幕')
export default class BgScreenAdapter extends cc.Component {
 
    onLoad() {
        this.adjustForNotch();
    }

    adjustForNotch() {
        let winRatio = cc.winSize.width/cc.winSize.height  //屏幕宽高比
        let scaleRatio = GameConfig.DesignResolution.width/GameConfig.DesignResolution.height   //设计宽高比

        if(winRatio > scaleRatio){ //适配宽度
            //cc.log("适配宽====>", cc.winSize.width/GameConfig.DesignResolution.width)
            this.node.scale = cc.winSize.width/GameConfig.DesignResolution.width
        }else{ //适配高
            //cc.log("适配高====>", cc.winSize.height/GameConfig.DesignResolution.height)
            this.node.scale = cc.winSize.height/GameConfig.DesignResolution.height
        }
    }
}
