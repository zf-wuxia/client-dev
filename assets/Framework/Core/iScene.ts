import { iMain } from "../iMain";
import { iMediator } from "./iMediator";
import { iView } from "./iView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class iScene extends iView {
    // 是否启用过场动画
    public enableChangeAnimation: boolean = false;
    protected mediator: iMediator;

    private layers: cc.Node[] = [];

    @property({ serializable: true })
    private _creatLayer: boolean = false;
    @property({ serializable: true })
    public get creatLayer(): boolean { return this._creatLayer }
    public set creatLayer(val: boolean) {
        this._creatLayer = val
        if (val) { this.initLayers() }
    }

    public onLoad(): void {
        iMain.Init();
        iMain.setCurrScene(this);
        this.initLayers();
        if (this.enableChangeAnimation) {
            this.showAnimation();
        }
    }

    public start(): void {
        if (this.mediator != null) {
            this.mediator.initialize();
        }
    }

    public showAnimation(): void {
        cc.tween(this.node)
            .set({ opacity: 10 })
            .to(0.3, { opacity: 255 }, { easing: cc.easing.quadIn })
            .start();
    }

    public hideAnimation(callback: Function): void {
        cc.tween(this.node)
            .to(0.3, { opacity: 0 }, { easing: cc.easing.quadOut })
            .call(() => {
                callback && callback();
            })
            .start();
    }

    private initLayers(): void {
        for (let i = 0; i < [].length; i++) {
            let layer = this.node.getChildByName('');
            if (layer == null) {
                layer = new cc.Node('');
                this.node.addChild(layer);
                layer.setContentSize(0, 0);
            }
            this.layers.push(layer);
        }
    }

    public onGetSceneData(data: any): void {

    }

    public onDisable(): void {
        if (this.mediator != null) {
            this.mediator.dispose();
            this.mediator = null;
        }
        super.onDisable();
    }

    public onDestroy(): void {

    }
}
