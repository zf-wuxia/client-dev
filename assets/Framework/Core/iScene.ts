import { iMain } from "../iMain";
import { GameLayer, GameLayerNames } from "../Support/Enum/GameLayer";
import { iMediator } from "./iMediator";
import { iView } from "./iView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class iScene extends iView {
    protected mediator: iMediator;

    private layers: cc.Node[] = [];

    public onLoad(): void {
        iMain.Init();
        iMain.SetCurrScene(this);
        this.initLayers();
    }

    private initLayers(): void {
        for (let i = 0; i < GameLayerNames.length; i++) {
            let layer = this.node.getChildByName(GameLayerNames[i]);
            if (layer == null) {
                layer = new cc.Node(GameLayerNames[i]);
                this.node.addChild(layer);
                layer.setContentSize(iMain.stageWidth, iMain.stageHeight);
            }
            this.layers.push(layer);
        }

        this.onReady();

        if (this.mediator != null) {
            this.mediator.initModules();
            this.mediator.showModules();
        }
    }

    public onGetSceneData(data: any): void {

    }

    public onReady(): void {
        // TODO ...
    }

    public onDisable(): void {
        if (this.mediator != null) {
            this.mediator.dispose();
            this.mediator = null;
        }
        super.onDisable();
    }

    public onDestroy(): void {
        // TODO ...
    }

    public getLayer(layerIdx: GameLayer): cc.Node {
        return this.layers[layerIdx];
    }
}
