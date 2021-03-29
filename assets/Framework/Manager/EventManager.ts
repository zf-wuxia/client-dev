import { iEvent } from "../Core/iEvent";
import { Event } from "../Support/Event";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { SceneEvent } from "../Support/Events/SceneEvent";

export class EventManager {
    private static event: Event = new Event();

    public static addEvent(target: any, evtName: string, func: Function): void {
        this.event.addEventListener(target, evtName, func);
    }

    public static removeEvent(target: any, evtName?: string, func?: Function): void {
        this.event.removeEventListener(target, evtName, func);
    }

    public static dispatchEvent(evtName: string | iEvent, data?: any): void {
        let evt: iEvent;
        if (typeof evtName == 'string') {
            evt = new iEvent(evtName, data);
        } else {
            evt = evtName;
        }
        this.event.dispatchEventListener(evt);
    }

    public static dispatchModuleEvent(type: string, moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(type, moduleName, null, gameLayer, data));
    }

    public static showModuleEvent(moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.SHOW_MODULE, moduleName, null, gameLayer, data));
    }

    public static hideModuleEvent(moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.HIDE_MODULE, moduleName, null, gameLayer, data));
    }

    public static disposeModuleEvent(moduleName: string, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.DISPOSE_MODULE, moduleName, null, null, data));
    }

    public static disposeChangeScene(sceneName: string): void {
        this.dispatchEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, sceneName));
    }
}
