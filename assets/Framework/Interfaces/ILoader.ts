import { LoaderType } from "../Support/Enum/LoaderType";
import { IDispose } from "./IDispose";

export interface ILoader extends IDispose {
    size: number;
    load(url: any, assetType?: any, loaderType?: LoaderType): void;
    getAssetType(idx: number): any;
    getContent(idx: number): any;
    addCallback(target: any, onComplete: Function, onProgress?: Function, onError?:Function): void;
}
