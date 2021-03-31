import { iEvent } from "../../Core/iEvent";
import { GameLayer } from "../Enum/GameLayer";

export class ModuleEvent extends iEvent {
    public static ClassName: string = 'ModuleEvent';
    public static SHOW_MODULE: string = 'ShowModule';
    public static HIDE_MODULE: string = 'HideModule';
    public static DISPOSE_MODULE: string = 'DisposeModule';
    public static EXCUTE_MODULE_FUNCTION: string = 'ExcuteModuleFunction';
    public static LOAD_MODULE_ASSET_PROGRESS: string = 'LoadModuleAssetProgress';
    public static LOAD_MODULE_ASSET_COMPLETE: string = 'LoadModuleAssetComplete';

    private _moduleName: string;
    public get moduleName(): string {
        return this._moduleName;
    }

    private _gameLayer: GameLayer | cc.Node;
    public get gameLayer(): GameLayer | cc.Node {
        return this._gameLayer;
    }

    constructor(type: string, moduleName: string, gameLayer?: GameLayer | cc.Node, data?: object) {
        super(type, data);
        this._moduleName = moduleName;
        this._gameLayer = gameLayer;
    }
}
