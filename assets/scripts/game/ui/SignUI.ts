import BaseUI from "../../framework/base/BaseUI";
import { EventName } from "../config/Config";

import SignCell from "./SignCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
    }

    start() {
        this.updateSignInfo()
    }

    updateSignInfo(){
        let children = this.content.children
        for (let i = 0; i < children.length; i++) {
            let cell = children[i].getComponent(SignCell)
            cell.updateView(i+1)
        }
    }
}
