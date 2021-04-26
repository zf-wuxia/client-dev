import { iScene } from "../Framework/Core/iScene";
import { DefaultEnter } from "./Scheme/DefaultEnter";
import { NativeEnter } from "./Scheme/NativeEnter";

const { ccclass, property } = cc._decorator;

// 进度条总长度
export const PROGRESS_WIDTH = 504;

@ccclass
export default class LauncherScene extends iScene {
    @property(cc.Node)
    barProgress: cc.Node = null;

    @property(cc.Node)
    layProgress: cc.Node = null;

    @property(cc.Label)
    lblProgress: cc.Label = null;

    @property(cc.Label)
    lblMessage: cc.Label = null;

    public onLoad(): void {
        super.onLoad();

        this.layProgress.active = false;
        
        CC_JSB ? this.node.addComponent(NativeEnter) : this.node.addComponent(DefaultEnter);
    }
}
