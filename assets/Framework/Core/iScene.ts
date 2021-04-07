import { iMain } from "../iMain";
import { IModule } from "../Interfaces/IModule";
import { EventManager } from "../Manager/EventManager";
import { ModuleManager } from "../Manager/ModuleManager";
import { ResourceManager } from "../Manager/ResourceManager";
import { GameLayer, GameLayerNames } from "../Support/Enum/GameLayer";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { Assets } from "../Support/Loader/Assets";
import { Loader } from "../Support/Loader/Loader";
import { iModule } from "./iModule";
import { iView } from "./iView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
export class iScene extends iView {
    protected modules: { [key: string]: IModule } = {};

    private _layers: cc.Node[] = [];

    public onLoad(): void {
        iMain.getInstance().init();
        iMain.getInstance().currScene = this;
        this.initLayers();
    }

    private initLayers(): void {
        for (let i = 0; i < GameLayerNames.length; i++) {
            let layer = this.node.getChildByName(GameLayerNames[i]);
            if (layer == null) {
                layer = new cc.Node(GameLayerNames[i]);
                this.node.addChild(layer);
                layer.setContentSize(iMain.STAGE_WIDTH, iMain.STAGE_HEIGHT);
            }
            this._layers.push(layer);
        }

        this.onReady();

        this.initModules();
        this.showModules();
    }

    public onGetSceneData(data: any): void {

    }

    public onReady(): void {
        // TODO ...
    }

    public onDisable(): void {
        for (let key in this.modules) {
            EventManager.getInstance().disposeModule(ModuleEvent.DISPOSE_MODULE, key);

            if (this.modules[key].enableMediatorReleaseAsset) {
                let assets = this.modules[key].assets;
                for (let i = 0; i < assets.length; i++) {
                    ResourceManager.ReleaseAsset(assets[i]);
                }
            }

            delete this.modules[key];
        }
        super.onDisable();
    }

    public onDestroy(): void {
        // TODO ...
    }

    public initModules(): void {
        // TODO ...
    }

    public showModules(): void {
        // TODO ...
    }

    public getLayer(layerIdx: GameLayer): cc.Node {
        return this._layers[layerIdx];
    }

    public addModule(moduleName: string, moduleClass: typeof iModule|IModule): IModule {
        let mm: ModuleManager = ModuleManager.getInstance();
        switch (typeof moduleClass) {
            case 'function':
                mm.addModuleClass(moduleName, moduleClass);
                break;
            case 'object':
                mm.addModule(moduleName, moduleClass);
                break;
        }
        return this.modules[moduleName] = mm.getModule(moduleName, true);
    }

    public preloadAssets(): Loader {
        let assets = [];
        for (let key in this.modules) {
            assets = assets.concat(this.modules[key].assets);
        }
        return Loader.get().loads(Assets.getAssets(assets));
    }
}
