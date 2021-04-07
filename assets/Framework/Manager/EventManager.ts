import { iEvent } from "../Core/iEvent";
import { IEvent } from "../Interfaces/IEvent";
import { Dictionary } from "../Support/Dictionary";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { SceneEvent } from "../Support/Events/SceneEvent";

export class EventManager {
    public static ClassName: string = 'EventManager';

    private events: Dictionary<any, IEvent>;

    constructor() {
        this.events = new Dictionary();
    }

    public addEvent(evName: string, func: Function, target: any): void {
        this.addEventListener(evName, func, target);
    }

    public removeEvent(evName: string, func: Function, target: any): void {
        this.removeEventListener(evName, func, target);
    }

    public dispatchEvent(evName: string | iEvent, data?: any): void {
        let ev: iEvent;
        if (typeof evName == 'string') {
            ev = new iEvent(evName, data);
        } else {
            ev = evName;
        }
        this.dispatchEventListener(ev);
    }

    public dispatchModuleEvent(type: string, moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(type, moduleName, gameLayer, data));
    }

    public showModule(moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.SHOW_MODULE, moduleName, gameLayer, data));
    }

    public hideModule(moduleName: string, gameLayer?: any, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.HIDE_MODULE, moduleName, gameLayer, data));
    }

    public disposeModule(moduleName: string, data?: any): void {
        this.dispatchEvent(new ModuleEvent(ModuleEvent.DISPOSE_MODULE, moduleName, null, data));
    }

    private addEventListener(evName: string, func: Function, target: any): void {
        if (!this.events.hasKey(target)) {
            this.events.setVal(target, {
                func: {},
                size: 0,
            });
        }

        let event = this.events.getVal(target);
        if (event.func[evName] == null) {
            event.func[evName] = new Array();
            event.size++;
        }

        let funcs: Function[] = event.func[evName];
        if (funcs.indexOf(func) == -1) {
            funcs.push(func);
        }
    }

    private removeEventListener(evName: string, func: Function, target: any): void {
        if (!this.events.hasKey(target)) {
            return;
        }

        let event = this.events.getVal(target);
        let funcs: any[];

        if (evName != null) {
            if (!event.func[evName]) {
                return;
            }

            funcs = event.func[evName];
            if (funcs != null) {
                let idx: number = funcs.indexOf(func);
                if (idx > -1) {
                    funcs.splice(idx, 1);
                }
            } else {
                funcs = event.func[evName];
                while(funcs.length > 0) {
                    funcs.shift();
                }
            }

            if (funcs.length == 0 ) {
                event.size--;
                delete event.func[evName];
            }
        } else {
            for (let key in event.func) {
                funcs = event.func[key];
                event.size--;
                while (funcs.length > 0) {
                    funcs.shift();
                }
            }
        }

        if (event.size <= 0) {
            this.events.remove(target);
        }
    }

    private dispatchEventListener(ev: iEvent): void {
        let type = ev.type;
        let keys = this.events.keys();
        let event: IEvent, target: any, funcs: Function[];

        for (let i = 0; i < keys.length; i++) {
            target = keys[i];
            event = this.events.getVal(target);

            if (!event.func[type]) {
                continue;
            }

            funcs = event.func[type];
            for (let j = 0; j < funcs.length; j++) {
                if (funcs[j].length == 0) {
                    funcs[j].call(target);
                } else {
                    funcs[j].call(target, ev);
                }
            }
        }
    }

    private static _instance: EventManager;
    public static getInstance(): EventManager {
        if (this._instance == null) {
            this._instance = new EventManager();
        }
        return this._instance;
    }
}
