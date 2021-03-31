import { iEvent } from "../Core/iEvent";
import { Event } from "../Support/Event";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { SceneEvent } from "../Support/Events/SceneEvent";

export class EventManager {
    private static event: Event = new Event();

    public static AddEvent(target: any, evtName: string, func: Function): void {
        this.event.addEventListener(target, evtName, func);
    }

    public static RemoveEvent(target: any, evtName?: string, func?: Function): void {
        this.event.removeEventListener(target, evtName, func);
    }

    public static DispatchEvent(evtName: string | iEvent, data?: any): void {
        let evt: iEvent;
        if (typeof evtName == 'string') {
            evt = new iEvent(evtName, data);
        } else {
            evt = evtName;
        }
        this.event.dispatchEventListener(evt);
    }

    public static DispatchModuleEvent(type: string, moduleName: string, gameLayer?: any, data?: any): void {
        this.DispatchEvent(new ModuleEvent(type, moduleName, gameLayer, data));
    }

    public static ShowModule(moduleName: string, gameLayer?: any, data?: any): void {
        this.DispatchEvent(new ModuleEvent(ModuleEvent.SHOW_MODULE, moduleName, gameLayer, data));
    }

    public static HideModule(moduleName: string, gameLayer?: any, data?: any): void {
        this.DispatchEvent(new ModuleEvent(ModuleEvent.HIDE_MODULE, moduleName, gameLayer, data));
    }

    public static DisposeModule(moduleName: string, data?: any): void {
        this.DispatchEvent(new ModuleEvent(ModuleEvent.DISPOSE_MODULE, moduleName, null, data));
    }

    public static ChangeScene(sceneName: string): void {
        this.DispatchEvent(new SceneEvent(SceneEvent.CHANGE_SCENE, sceneName));
    }
}
