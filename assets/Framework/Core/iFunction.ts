import { PoolManager } from "../Manager/PoolManager";
import { iStore } from "./iStore";

export class iFunction extends iStore {
    public once: boolean = true;
    public target: any;
    public func: Function;
    public params: any[];

    public get size(): number {
        return this.func ? this.func.length : 0;
    }

    public execute(args?: any[]): any {
        if (this.func != null) {
            let pp = [];
            if (this.params != null && this.params.length > 0) {
                pp = pp.concat(this.params);
            }
            if (args != null && args.length > 0) {
                pp = pp.concat(args);
            }
            return this.func.apply(this.target, pp);
        }
        
        if (this.once) {
            this.dispose();
        }
    }

    public dispose(): void {
        this.once = true;
        this.func = null;
        this.target = null;
        this.params = null;
        super.dispose();
    }

    public static Compare(a: iFunction, b: iFunction): boolean {
        return a.target == b.target && a.func == b.func;
    }

    public static FindIndexOf(func: iFunction, funcs: iFunction[]): number {
        for (let i = 0; i < funcs.length; i++) {
            if (this.Compare(func, funcs[i])) {
                return i;
            }
        }
        return -1;
    }

    public static Get(func: Function, target?: any, args?: any[], once: boolean = true): iFunction {
        let result: iFunction = PoolManager.getInstance().get(iFunction);
        result.func = func;
        result.once = once;
        result.target = target;
        result.params = args;
        return result;
    }
}
