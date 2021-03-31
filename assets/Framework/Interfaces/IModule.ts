import { IDispose } from "./IDispose";

export interface IModule extends IDispose {
    moduleName: string;
    assets: any[];
    inited: boolean;
    valid: boolean;
    enableCache: boolean;
    enablePreload: boolean;
    enableMediatorReleaseAsset: boolean;

    init(): void;
    show(parent: cc.Node, data?: object): void;
    hide(data?: object): void;
    showView(): void;
    hideView(): void;
    initPreset(): void;
    bindEvents(): void;
    unbindEvents(): void;
}
