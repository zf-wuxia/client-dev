import { SceneName } from "../../../Config/Namings/SceneName";
import { ILoader } from "../../Interfaces/ILoader";
import { CacheManager } from "../../Manager/CacheManager";
import { PoolManager } from "../../Manager/PoolManager";
import { LoaderType } from "../Enum/LoaderType";

export class SceneLoader implements ILoader {
    public static ClassName: string = 'SceneLoader';

    private sceneName: string[] = [];
    private callbacks: { target: any, onComplete: Function, onProgress: Function, onError: Function }[] = [];
    private countRatio: number = 0;
    private index: number = -1;
    private contents: any[] = [];

    public cacheAsset: boolean = true;

    public get size(): number {
        return 1;
    }

    public getSceneName(idx: number): string {
        return this.sceneName[idx];
    }

    public getAssetType(idx: number): any {
        return null;
    }

    public getLoaderType(idx: number): LoaderType {
        return LoaderType.SCENE;
    }

    public getContent(idx: number): any {
        return this.getSceneName(idx);
    }

    public addCallback(target: any, onComplete: Function, onProgress?: Function, onError?: Function): void {
        this.callbacks.push({
            target: target,
            onComplete: onComplete,
            onProgress: onProgress,
            onError: onError,
        });
    }

    public load(sceneName: string, assetType?: any, loaderType?: LoaderType): void {
        this.sceneName.push(sceneName);
        this.countRatio = 100 / this.sceneName.length;
        this.loadAsset();
    }

    private loadAsset(): void {
        this.index++;

        if (this.index >= this.sceneName.length) {
            setTimeout(() => this.complete(), 1);
        } else {
            let res = this.getSceneName(this.index);
            if (CacheManager.hasCache(res)) {
                this.onLoadComplete(null, CacheManager.getCache(res));
            } else {
                let info = cc.assetManager.main.getSceneInfo(res);
                if (info) {
                    cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, res);
                    console.log('LoadSceneer', JSON.stringify({ uuid: info.uuid, type: 'uuid' }));
                    cc.loader.load({ uuid: info.uuid, type: 'uuid' }, (a, b, c) => this.onLoadProgress(a, b, c), (a, b) => this.onLoadComplete(a, b));
                } else {
                    this.onLoadError({ message: res + ' is undefined!!!', resName: res });
                    this.loadAsset();
                }
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
            p = Math.floor(this.countRatio * this.index + (loadCount / total * this.countRatio));
        }
        this.executeCallback('onProgress', p);
    }

    protected onLoadComplete(err: Error, resource: any): void {
        this.contents.push(resource);
        if (err != null) {
            this.onLoadError(err);
        }
        else if (this.cacheAsset) {
            let res = this.sceneName[this.index];
            CacheManager.addCache(res, resource);
        }
        this.loadAsset();
    }

    protected onLoadError(err: any): void {
        // console.error('[资源加载出错]', err.message);
        err.LoaderType = this.getLoaderType(0);
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
        this.sceneName.length = 0;
        this.contents.length = 0;
        this.cacheAsset = true;
        PoolManager.store(this);
    }

    public static get(): SceneLoader {
        return PoolManager.Get(SceneLoader);
    }
}
