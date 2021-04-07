import { SceneEvent } from "../Support/Events/SceneEvent";
import { EventManager } from "./EventManager";

export class SceneManager {
    public static ClassName: string = 'SceneManager';

    public changeScene(sceneName: string): void {
        EventManager.getInstance().dispatchEvent(new SceneEvent(
            SceneEvent.CHANGE_SCENE, sceneName
        ));
    }

    private static _instance: SceneManager;
    public static getInstance(): SceneManager {
        if (this._instance == null) {
            this._instance = new SceneManager();
        }
        return this._instance;
    }
}
