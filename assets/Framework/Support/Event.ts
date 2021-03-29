import { iEvent } from "../Core/iEvent";
import { IEvent } from "../Interfaces/IEvent";
import { Dictionary } from "./Dictionary";

export class Event {
    public static ClassName: string = 'Event';

    private events: Dictionary<any, IEvent>;
    private size: number;

    constructor() {
        this.events = new Dictionary();
    }

    public addEventListener(target: any, evtName: string, func: Function): void {
        if (!this.events.hasKey(target)) {
            this.events.setVal(target, {
                func: {},
                size: 0
            });
        }

        let obj = this.events.getVal(target);
        if (obj.func[evtName] == null) {
            obj.func[evtName] = new Array;
            obj.size++;
        }

        let funcs: Function[] = obj.func[evtName];
        if (funcs.indexOf(func) == -1){
            funcs.push(func);
        }
    }

    public dispatchEventListener(evt: iEvent): void {
        let type = evt.type;
        let keys = this.events.keys();
        let funcs: IEvent, obj: any, funs: Function[];

        for (let i = 0; i < keys.length; i++) {
            obj = keys[i];
            funcs = this.events.getVal(obj);

            if (!funcs.func[type]) {
                continue;
            }

            funs = funcs.func[type];
            for (let j = 0; j < funs.length; j++) {
                if (funs[j].length == 0) {
                    funs[j].call(obj);
                } else {
                    funs[j].call(obj, evt);
                }
            }
        }
    }

    public removeEventListener(target: any, evtName?: string, func?: Function): void {
        if (!this.events.hasKey(target)) {
            return;
        }

        let vals = this.events.getVal(target);
        let funs: any[];

        if (evtName != null) {
            if (!vals.func[evtName]) {
                return;
            }

            funs = vals.func[evtName];
            if (funs != null) {
                let idx: number = funs.indexOf(func);
                if (idx > -1) {
                    funs.splice(idx, 1);
                }
            } else {
                funs = vals.func[evtName];
                while (funs.length > 0) {
                    funs.shift();
                }
            }

            if (funs.length == 0) {
                vals.size--;
                delete vals.func[evtName];
            }
        } else {
            for (let s in vals.func) {
                funs = vals.func[s];
                vals.size--;
                while (funs.length > 0) {
                    funs.shift();
                }
            }
        }

        if (vals.size <= 0) {
            this.events.remove(target);
        }
    }
}
