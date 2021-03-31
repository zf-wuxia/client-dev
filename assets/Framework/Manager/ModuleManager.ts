import { iEvent } from "../Core/iEvent";
import { iModule } from "../Core/iModule";
import { IModule } from "../Interfaces/IModule";
import { EventManager } from "./EventManager";

export class ModuleManager {
    private static domains: { [key: string]: typeof iModule } = {};
    private static modules: { [key: string]: IModule } = {};

    public static AddModuleClass(moduleName: string, moduleClass: typeof iModule, force?: boolean): void {
        if (this.domains[moduleName]) {
            if (force) {
                this.domains[moduleName] = moduleClass;
            } else {
                // console.warn(`[ModuleManager]: ${moduleName} 模块类已经存在`);
            }
        } else {
            this.domains[moduleName] = moduleClass;
        }
    }

    public static AddModule(moduleName: string, module: IModule): void {
        if (this.modules[moduleName] == null) {
            this.modules[moduleName] = module;
        } else {
            console.warn(`[ModuleManager]: ${moduleName} 实例已经存在`);
        }
    }

    public static RemoveModule(moduleName: string): void {
        delete this.modules[moduleName];
    }

    public static HasModule(moduleName: string): boolean {
        return this.modules[moduleName] != null;
    }

    public static GetModule(moduleName: string, disposeInvalid?: boolean): IModule {
        if (disposeInvalid) {
            // 销毁无效的Module
            if (this.modules[moduleName] && this.modules[moduleName].inited && !this.modules[moduleName].valid) {
                this.modules[moduleName].dispose();
                delete this.modules[moduleName];
            }
        }
        if (this.modules[moduleName] == null) {
            let moduleClass = this.domains[moduleName];
            if (moduleClass != null) {
                this.modules[moduleName] = new moduleClass();
            }
        }
        return this.modules[moduleName];
    }

    public static DisposeModule(moduleName: string): void {
        console.log(`销毁模块实例 => ${moduleName}`);
        this.modules[moduleName].dispose();
        delete this.modules[moduleName];
    }
}
