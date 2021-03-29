import { SceneName } from "../Config/Namings/SceneName";
import { iEvent } from "./Core/iEvent";
import { iFunction } from "./Core/iFunction";
import { iMain } from "./iMain";
import { EventManager } from "./Manager/EventManager";
import { ResourceManager } from "./Manager/ResourceManager";
import { ModuleEvent } from "./Support/Events/ModuleEvent";
import { SceneEvent } from "./Support/Events/SceneEvent";

export class iMainMediator {
    public static ClassName: string = 'iMainMediator';

    public initialize(): void {
        this.addEvents();
        this.initModules();
    }

    protected initModules(): void {

    }

    protected addEvents(): void {
        EventManager.addEvent(this, ModuleEvent.SHOW_MODULE, this.onShowModule);
        EventManager.addEvent(this, ModuleEvent.HIDE_MODULE, this.onHideModule);
        EventManager.addEvent(this, ModuleEvent.DISPOSE_MODULE, this.onDisposeModule);
        EventManager.addEvent(this, SceneEvent.CHANGE_SCENE, this.onChangeScene);
    }

    private onShowModule(evt: ModuleEvent): void {

    }

    private onHideModule(evt: ModuleEvent): void {

    }

    private onDisposeModule(evt: ModuleEvent): void {

    }

    private onLoadSceneProgress(sceneName: string, progress: iEvent): void {
        EventManager.dispatchEvent(SceneEvent.CHANGE_SCENE + sceneName, progress);
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
