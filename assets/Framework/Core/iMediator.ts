import { IModule } from "../Interfaces/IModule";
import { EventManager } from "../Manager/EventManager";
import { ModuleManager } from "../Manager/ModuleManager";
import { ResourceManager } from "../Manager/ResourceManager";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { Assets } from "../Support/Loader/Assets";
import { Loader } from "../Support/Loader/Loader";
import { iModule } from "./iModule";

export class iMediator {
    protected modules: { [key: string]: IModule } = {};

    public preloadAssets(): Loader {
        let assets = [];
        for (let key in this.modules) {
            assets = assets.concat(this.modules[key].assets);
        }
        let loader: Loader = Loader.Get();
        loader.loads(Assets.getAssets(assets));
        return loader;
    }

    public initModules(): void {
        // TODO ...
    }

    public showModules(): void {
        // TODO ...
    }

    public dispose(): void {
        for (let key in this.modules) {
            EventManager.DisposeModule(ModuleEvent.DISPOSE_MODULE, key);

            if (this.modules[key].enableMediatorReleaseAsset) {
                let assets = this.modules[key].assets;
                for (let i = 0; i < assets.length; i++) {
                    ResourceManager.ReleaseAsset(assets[i]);
                }
            }

            delete this.modules[key];
        }
    }

    protected addModule(moduleName: string, moduleClass: typeof iModule|IModule): IModule {
        switch (typeof moduleClass) {
            case 'function':
                ModuleManager.AddModuleClass(moduleName, moduleClass);
                break;
            case 'object':
                ModuleManager.AddModule(moduleName, moduleClass);
                break;
        }
        return this.modules[moduleName] = ModuleManager.GetModule(moduleName, true);
    }
}
