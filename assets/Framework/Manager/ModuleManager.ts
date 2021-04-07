import { iModule } from "../Core/iModule";
import { IModule } from "../Interfaces/IModule";

export class ModuleManager {
    private domains: { [key: string]: typeof iModule } = {};
    private modules: { [key: string]: IModule } = {};

    public addModuleClass(moduleName: string, moduleClass: typeof iModule, force?: boolean): void {
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

    public addModule(moduleName: string, module: IModule): void {
        if (this.modules[moduleName] == null) {
            this.modules[moduleName] = module;
        } else {
            console.warn(`[ModuleManager]: ${moduleName} 实例已经存在`);
        }
    }

    public removeModule(moduleName: string): void {
        delete this.modules[moduleName];
    }

    public hasModule(moduleName: string): boolean {
        return this.modules[moduleName] != null;
    }

    public getModule(moduleName: string, disposeInvalid?: boolean): IModule {
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

    public disposeModule(moduleName: string): void {
        console.log(`销毁模块实例 => ${moduleName}`);
        this.modules[moduleName].dispose();
        delete this.modules[moduleName];
    }

    private static _instance: ModuleManager;
    public static getInstance(): ModuleManager {
        if (this._instance == null) {
            this._instance = new ModuleManager();
        }
        return this._instance;
    }
}
