import { iEvent } from "../../Core/iEvent";

export class SceneEvent extends iEvent {
    public static ClassName: string = 'SceneEvent';
    public static CHANGE_SCENE: string = 'onChangeScene';
    public static SET_CURRENT_SCENE: string = 'onSetCurrentScene';
    public static DESTROY_CURRENT_SCENE: string = 'onDestroyCurrentScene';

    private _sceneName: string;
    public get sceneName(): string {
        return this._sceneName;
    }

    public constructor(type: string, sceneName: string, data?: object) {
        super(type, data);
        this._sceneName = sceneName;
    }
}
