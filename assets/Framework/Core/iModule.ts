import { IModule } from "../Interfaces/IModule";
import { EventManager } from "../Manager/EventManager";
import { ResourceManager } from "../Manager/ResourceManager";
import { ModuleEvent } from "../Support/Events/ModuleEvent";
import { Assets } from "../Support/Loader/Assets";
import { Loader } from "../Support/Loader/Loader";
import { Utils } from "../Support/Utils/Utils";

export class iModule implements IModule {
    public moduleName: string;
    public enableCache: boolean;
    public enablePreload: boolean;
    public enableMediatorReleaseAsset: boolean;

    private _inited: boolean;
    private _initedAsset: boolean;
    private _showed: boolean;

    protected node: cc.Node;
    protected parent: cc.Node;
    protected moduleData: any;

    public get assets(): any[] {
        return [];
    }

    public get inited(): boolean {
        return this._inited;
    }

    public get valid(): boolean {
        return !this._initedAsset || (this.node && this.node.isValid);
    }

    constructor() {
        this.moduleName = Utils.getQualifiedClassName(this);
    }

    public init(): void {
        if (this._inited) {
            return;
        }
        this._inited = true;
        this.loadAssets();
    }

    private initNode() {
        if (this.node == null) {
            if (this.assets.length > 0) {
                this.node = ResourceManager.InstantiatePrefab(this.assets[0]);
            } else {
                this.node = new cc.Node(this.moduleName);
            }
        }
    }

    private loadAssets(): void {
        if (this.assets.length == 0) {
            this.onLoadAssetComplete();
        } else {
            let loader: Loader = Loader.Get();
            loader.cacheAsset = this.enableCache;
            loader.addCallback(null, this.onLoadAssetComplete.bind(this), this.onLoadAssetProgress.bind(this));
            loader.loads(Assets.getAssets(this.assets));
        }
    }

    private onLoadAssetComplete(): void {
        EventManager.DispatchModuleEvent(ModuleEvent.LOAD_MODULE_ASSET_COMPLETE + this.moduleName, this.moduleName);
        this.initView();
    }

    private onLoadAssetProgress(progress: number): void {
        EventManager.DispatchModuleEvent(ModuleEvent.LOAD_MODULE_ASSET_PROGRESS + this.moduleName, this.moduleName, null, { progress: progress });
    }

    private initView(): void {
        if (this._initedAsset) {
            return;
        }
        this._initedAsset = true;

        this.initNode();
        this.showView();
        this.initPreset();
        this.bindEvents();
    }

    public showView(): void {
        if (this.node != null && this._showed) {
            this.node.name = this.moduleName;
            if (this.node.parent == null && this.parent) {
                this.parent.addChild(this.node);
            }
        }
    }

    public hideView(): void {
        this._showed = false;
        if (this.node != null) {
            this.node.removeFromParent(false);
        }
    }

    public initPreset(): void {
        // TODO ...
    }

    public bindEvents(): void {
        // TODO ...
    }

    public unbindEvents(): void {
        // TODO ...
    }

    public show(parent: cc.Node, data?: object): void {
        if (this.parent != parent && this.node != null) {
            this.node.removeFromParent(false);
        }

        this._showed = true;
        this.parent = parent;
        this.moduleData = data;

        if (this._initedAsset) {
            this.showView();
        }
    }

    public hide(data?: object): void {
        this.hideView();
    }

    public dispose(): void {
        this.unbindEvents();
        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
        this._showed = false;
        this._inited = false;
        this._initedAsset = false;
        this.node = null;
        this.parent = null;
        this.moduleName = null;
        this.moduleData = null;
    }
}
