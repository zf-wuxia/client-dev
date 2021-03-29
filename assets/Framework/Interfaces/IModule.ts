import { IDispose } from "./IDispose";

export interface IModule extends IDispose {
    moduleName: string;
    assets: any[];
    enableCache: boolean;
    enablePreload: boolean;

    startModule(): void;
    show(parent: cc.Node, data?: object): void;
    hide(data?: object): void;
    showView(): void;
    hideView(): void;
    initPreset(): void;
    bindEvents(): void;
    unbindEvents(): void;
}
