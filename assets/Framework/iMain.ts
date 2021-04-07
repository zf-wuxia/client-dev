import { iEvent } from "./Core/iEvent";
import { iFunction } from "./Core/iFunction";
import { iScene } from "./Core/iScene";
import { IModule } from "./Interfaces/IModule";
import { EventManager } from "./Manager/EventManager";
import { ModuleManager } from "./Manager/ModuleManager";
import { ResourceManager } from "./Manager/ResourceManager";
import { SceneManager } from "./Manager/SceneManager";
import { GameLayer } from "./Support/Enum/GameLayer";
import { ModuleEvent } from "./Support/Events/ModuleEvent";
import { SceneEvent } from "./Support/Events/SceneEvent";

const STAGE_WIDTH = 750;
const STAGE_HEIGHT = 1334;

export class iMain {
    public static ClassName: string = 'iMain';
    public static STAGE_WIDTH: number = STAGE_WIDTH;
    public static STAGE_HEIGHT: number = STAGE_HEIGHT;

    private _canvasScale: cc.Vec2;
    private _isInit: boolean;
    private _startTime: number;
    private _currScene: iScene;

    public get currScene(): iScene {
        return this._currScene;
    }
    public set currScene(scene: iScene) {
        this._currScene = scene;
        let canvas = scene.node.getComponent(cc.Canvas);
        if (canvas != null) {
            canvas.fitWidth = true;
            canvas.fitWidth = true;
            if (scene.node.getComponent(cc.Mask) == null) {
                scene.node.addComponent(cc.Mask);
            }
        }
        EventManager.getInstance().dispatchEvent(new SceneEvent(SceneEvent.SET_CURRENT_SCENE, null));
    }

    public get currCanvas(): cc.Canvas {
        if (this._currScene == null) {
            return null;
        }
        return this._currScene.node.getComponent(cc.Canvas);
    }

    public init(): void {
        if (this._isInit) return;

        this._isInit = true;
        this._startTime = Date.now();
        this.bindEvents();
        this.initModules();

        if (cc.sys.DESKTOP_BROWSER || cc.sys.MOBILE_BROWSER) {
            let gameContainer = document.getElementById("Cocos2dGameContainer");
            let ww = gameContainer.style.width;
            let hh = gameContainer.style.height;
            ww = ww.replace("px", "");
            hh = hh.replace("px", "");
            this._canvasScale = cc.v2(Number(ww) / STAGE_WIDTH, Number(hh) / STAGE_HEIGHT);
        }
    }

    private initModules(): void {

    }

    private bindEvents(): void {
        let em: EventManager = EventManager.getInstance();
        em.addEvent(ModuleEvent.SHOW_MODULE, this.onShowModule, this);
        em.addEvent(ModuleEvent.HIDE_MODULE, this.onHideModule, this);
        em.addEvent(ModuleEvent.DISPOSE_MODULE, this.onDisposeModule, this);
        em.addEvent(SceneEvent.CHANGE_SCENE, this.onChangeScene, this);
    }

    private onShowModule(evt: ModuleEvent): void {
        let mm: ModuleManager = ModuleManager.getInstance();
        let module: IModule = mm.getModule(evt.moduleName, true);
        if (module == null) {
            return;
        }
        module.moduleName = evt.moduleName;
        let parent: cc.Node;
        if (evt.gameLayer != null) {
            if (evt.gameLayer instanceof cc.Node) {
                parent = evt.gameLayer;
            } else {
                parent = this.currScene.getLayer(evt.gameLayer as GameLayer);
            }
        }
        module.init();
        module.show(parent, evt.data);
    }

    private onHideModule(evt: ModuleEvent): void {
        let mm: ModuleManager = ModuleManager.getInstance();
        if (mm.hasModule(evt.moduleName)) {
            let module: IModule = mm.getModule(evt.moduleName);
            module.hide(evt.data);
        }
    }

    private onDisposeModule(evt: ModuleEvent): void {
        let mm: ModuleManager = ModuleManager.getInstance();
        if (mm.hasModule(evt.moduleName)) {
            mm.disposeModule(evt.moduleName);
        }
    }

    private onLoadSceneProgress(sceneName: string, progress: iEvent): void {
        EventManager.getInstance().dispatchEvent(SceneEvent.CHANGE_SCENE + sceneName, progress);
    }

    private onLoadSceneComplete(data: any, sceneName: string): void {
        cc.director.loadScene(sceneName, () => {
            this.currScene.onGetSceneData(data);
        });
    }

    private onChangeScene(evt: SceneEvent): void {
        let onComplete: iFunction = iFunction.Get(this.onLoadSceneComplete, this, [evt.data], true);
        let onProgress: iFunction = iFunction.Get(this.onLoadSceneProgress, this, [evt.sceneName], true);
        ResourceManager.LoadScene(evt.sceneName, onComplete, onProgress);
    }

    public onCurrSceneDestroy(): void {
        this.currScene = null;
        EventManager.getInstance().dispatchEvent(new SceneEvent(SceneEvent.DESTROY_CURRENT_SCENE, null));
    }

    public getTimer(): number {
        return Date.now() - this._startTime;
    }

    private static _instance: iMain;
    public static getInstance(): iMain {
        if (this._instance == null) {
            this._instance = new iMain();
        }
        return this._instance;
    }
}
