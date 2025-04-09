import BaseUI from "../../framework/base/BaseUI";
import { DataMgr } from "../manager/DataMgr";
import VideoCell from "./VideoCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VideoUI extends BaseUI {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    cell: cc.Node = null;

    onLoad() {
        this.cell.active = false
    }

    start() {
        let list = DataMgr.getInstance().getAllVideoCfg()
        for(let i = 0; i < list.length; i++){
            let cell = cc.instantiate(this.cell)
            cell.active = true
            cell.parent = this.content
            cell.getComponent(VideoCell).updateView(list[i])
        }
        
    }

    updateView(){
        
    }
}
