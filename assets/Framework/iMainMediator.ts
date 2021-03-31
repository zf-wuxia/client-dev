import { ModuleName } from "../Config/Namings/ModuleName";
import { iEvent } from "./Core/iEvent";
import { iFunction } from "./Core/iFunction";
import { iMain } from "./iMain";
import { IModule } from "./Interfaces/IModule";
import { EventManager } from "./Manager/EventManager";
import { ModuleManager } from "./Manager/ModuleManager";
import { ResourceManager } from "./Manager/ResourceManager";
import { GameLayer } from "./Support/Enum/GameLayer";
import { ModuleEvent } from "./Support/Events/ModuleEvent";
import { SceneEvent } from "./Support/Events/SceneEvent";

export class iMainMediator {
    public static ClassName: string = 'iMainMediator';

    public initialize(): void {
        this.bindEvents();
        this.initModules();
    }

    protected initModules(): void {

    }

    protected bindEvents(): void {
        EventManager.AddEvent(this, ModuleEvent.SHOW_MODULE, this.onShowModule);
        EventManager.AddEvent(this, ModuleEvent.HIDE_MODULE, this.onHideModule);
        EventManager.AddEvent(this, ModuleEvent.DISPOSE_MODULE, this.onDisposeModule);
        EventManager.AddEvent(this, SceneEvent.CHANGE_SCENE, this.onChangeScene);
    }

    private onShowModule(evt: ModuleEvent): void {
        let module: IModule = ModuleManager.GetModule(evt.moduleName, true);
        if (module == null) {
            return;
        }
        module.moduleName = evt.moduleName;
        let parent: cc.Node;
        if (evt.gameLayer != null) {
            if (evt.gameLayer instanceof cc.Node) {
                parent = evt.gameLayer;
            } else {
                parent = iMain.currScene.getLayer(evt.gameLayer as GameLayer);
            }
        }
        module.init();
        module.show(parent, evt.data);
    }

    private onHideModule(evt: ModuleEvent): void {
        if (ModuleManager.HasModule(evt.moduleName)) {
            let module: IModule = ModuleManager.GetModule(evt.moduleName);
            module.hide(evt.data);
        }
    }

    private onDisposeModule(evt: ModuleEvent): void {
        if (ModuleManager.HasModule(evt.moduleName)) {
            ModuleManager.DisposeModule(evt.moduleName);
        }
    }

    private onLoadSceneProgress(sceneName: string, progress: iEvent): void {
        EventManager.DispatchEvent(SceneEvent.CHANGE_SCENE + sceneName, progress);
    }

    private onLoadSceneComplete(data: any, sceneName: string): void {
        cc.director.loadScene(sceneName, () => {
            iMain.currScene.onGetSceneData(data);
        });
    }

    private onChangeScene(evt: SceneEvent): void {
        let onComplete: iFunction = iFunction.Get(this.onLoadSceneComplete, this, [evt.data], true);
        let onProgress: iFunction = iFunction.Get(this.onLoadSceneProgress, this, [evt.sceneName], true);
        ResourceManager.LoadScene(evt.sceneName, onComplete, onProgress);
    }
}
