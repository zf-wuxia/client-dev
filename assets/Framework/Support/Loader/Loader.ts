import { ILoader } from "../../Interfaces/ILoader";
import { CacheManager } from "../../Manager/CacheManager";
import { PoolManager } from "../../Manager/PoolManager";
import { LoaderType } from "../Enum/LoaderType";

export class Loader implements ILoader {
    public static ClassName: string = 'Loader';

    protected contents: any[] = [];
    protected callbacks: any[] = [];
    protected index: number = -1;
    protected urls: string[] = [];
    protected progress: number = 0;
    protected assetTypes: any[];
    protected loaderTypes: LoaderType[];

    public cacheAsset: boolean = true;

    public get size(): number {
        return this.urls.length;
    }

    public getURL(idx: number): string {
        return this.urls[idx];
    }

    public getAssetType(idx: number): any {
        return this.assetTypes ? this.assetTypes[idx] : null;
    }

    public getLoaderType(idx: number): LoaderType {
        return this.loaderTypes ? this.loaderTypes[idx] : null;
    }

    public getContent(idx: number) {
        return this.contents[idx];
    }

    public addCallback(target: any, onComplete: Function, onProgress?: Function, onError?: Function): void {
        this.callbacks.push({
            target: target,
            onComplete: onComplete,
            onProgress: onProgress,
            onError: onError,
        });
    }

    public load(url: string, assetType?: any, loaderType?: LoaderType): void {
        if (this.urls.length > 0) {
            this.urls.push(url);
            if (assetType != null) {
                if (this.assetTypes == null) {
                    this.assetTypes = [];
                }
                this.assetTypes[this.assetTypes.length] = assetType;
            }
            if (loaderType != null) {
                if (this.loaderTypes == null) {
                    this.loaderTypes = [];
                }
                this.loaderTypes[this.loaderTypes.length] = loaderType;
            }
        } else {
            this.loads([url], assetType ? [assetType] : null, loaderType ? [loaderType] : null);
        }
    }

    public loads(urls: string[], assetTypes?: any[], loaderTypes?: LoaderType[]): Loader {
        this.urls = urls;
        this.assetTypes = assetTypes;
        this.loaderTypes = loaderTypes;
        this.progress = 100 / urls.length;
        this.loadAsset();
        return this;
    }

    public loadAsset(): void {
        this.index++;

        if (this.index >= this.urls.length) {
            setTimeout(() => this.complete(), 1);
        } else {
            let res = this.getURL(this.index) as any;
            if (CacheManager.getInstance().hasCache(res)) {
                this.onLoadComplete(null, CacheManager.getInstance().getCache(res));
            } else {
                let type = this.getAssetType(this.index);
                if (typeof res == 'object') {
                    type = res.type;
                    res = res.asset;
                }
                if (res == '' || res == null || res.length == 0) {
                    return;
                }
                cc.resources.load(res, type, (a, b, c) => this.onLoadProgress(a, b, c), (a, b) => this.onLoadComplete(a, b));
            }
        }
    }

    protected complete(): void {
        this.executeCallback('onComplete');
        this.dispose();
    }

    protected onLoadProgress(loadCount: number, total: number, item: any): void {
        let p = 100;
        if (total != 0) {
            p = Math.floor(this.progress * this.index + (loadCount / total * this.progress));
        }
        this.executeCallback('onProgress', p);
    }

    protected onLoadComplete(err: Error, resource: any): void {
        this.contents.push(resource);
        if (err != null) {
            this.onLoadError(err);
        }
        else if (this.cacheAsset) {
            let res = this.urls[this.index];
            CacheManager.getInstance().addCache(res, resource);
        }
        this.loadAsset();
    }

    protected onLoadError(err: Error): void {
        console.error('[资源加载出错]', err.message);
        this.executeCallback('onError', err);
    }

    protected executeCallback(funcName: string, arg?: any): number {
        let count = 0;
        for (let i = 0; i < this.callbacks.length; i++) {
            let func: Function = this.callbacks[i][funcName];
            if (func != null) {
                count++;
                switch (func.length) {
                    case 0:
                        func.call(this.callbacks[i]['target']);
                        break
                    case 1:
                        if (arg != null) {
                            func.call(this.callbacks[i]['target'], arg);
                        } else {
                            func.call(this.callbacks[i]['target'], this);
                        }
                        break;
                    case 2:
                        func.call(this.callbacks[i]['target'], arg, this);
                        break;
                }
            }
        }
        return count;
    }

    public dispose(): void {
        this.index = -1;
        this.callbacks.length = 0;
        this.assetTypes && (this.assetTypes.length = 0);
        this.urls.length = 0;
        this.contents.length = 0;
        this.cacheAsset = true;
        PoolManager.getInstance().store(this);
    }

    public static get(): Loader {
        return PoolManager.getInstance().get(Loader);
    }
}
