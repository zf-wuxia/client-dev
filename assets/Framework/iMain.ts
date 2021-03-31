import iScene from "./Core/iScene";
import { iMainMediator } from "./iMainMediator";
import { EventManager } from "./Manager/EventManager";
import { SceneEvent } from "./Support/Events/SceneEvent";

export class iMain {
    public static ClassName: string = 'iMain';
    public static canvasScale: cc.Vec2;
    public static currScene: iScene;
    public static stageWidth: number = 750;
    public static stageHeight: number = 1334;
    
    private static initialize: boolean;
    private static startTime: number;
    private static mediator: iMainMediator;

    public static Init(): void {
        if (this.initialize) return;

        this.initialize = true;
        this.startTime = Date.now();
        this.mediator = new iMainMediator();
        this.mediator.initialize();

        if (cc.sys.DESKTOP_BROWSER || cc.sys.MOBILE_BROWSER) {
            let gameContainer = document.getElementById("Cocos2dGameContainer");
            let ww = gameContainer.style.width;
            let hh = gameContainer.style.height;
            ww = ww.replace("px", "");
            hh = hh.replace("px", "");
            this.canvasScale = cc.v2(
                Number(ww) / this.stageWidth,
                Number(hh) / this.stageHeight,
            )
        }
    }

    public static SetCurrScene(scene: iScene): void {
        this.currScene = scene;
        let canvas = scene.node.getComponent(cc.Canvas);
        if (canvas != null) {
            canvas.fitWidth = true;
            canvas.fitWidth = true;
            if (scene.node.getComponent(cc.Mask) == null) {
                scene.node.addComponent(cc.Mask);
            }
        }
        EventManager.DispatchEvent(new SceneEvent(SceneEvent.SET_CURRENT_SCENE, null));
    }

    public static GetCurrCanvas(): cc.Canvas {
        let canvas = this.currScene.node.getComponent(cc.Canvas);
        return canvas;
    }

    public static onCurrSceneDestroy(): void {
        this.currScene = null;
        EventManager.DispatchEvent(new SceneEvent(SceneEvent.DESTROY_CURRENT_SCENE, null));
    }

    public static ChangeScene(sceneName: string): void {
        EventManager.ChangeScene(sceneName);
    }

    public static GetTimer(): number {
        return Date.now() - this.startTime;
    }
}
