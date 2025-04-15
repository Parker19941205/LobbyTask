import BaseUI from "../../framework/base/BaseUI";
import List from "../../framework/commonts/List";
import { PlayerMgr } from "../manager/PlayerMgr";
import BagCell from "./BagCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BagUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    onLoad() {

    }

    start() {
       
        this.updateList()
    }

    updateList(){
        let bagList = PlayerMgr.getInstance().getBagData().data.bagList
        cc.log("BagUI:", bagList)
        for (let i = 0; i < bagList.length; i++) {
            let cell = cc.instantiate(this.cell)
            cell.active = true
            cell.setPosition(0, 0)
            cell.parent = this.content
            let item = cell.getComponent(BagCell)
            item.updateView(bagList[i])
        }
    }

}
