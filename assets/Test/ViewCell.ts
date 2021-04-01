// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import iViewCell from "../Framework/Components/iViewCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewCell extends iViewCell {
    @property(cc.Label)
    label: cc.Label = null;

    updateView(idx: number): void {
        this.label.string = 'idx: ' + idx + '; data: ' + this.data.value;
    }
}
