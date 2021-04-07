export class CacheManager {
    private caches: { [key: string]: object };

    constructor() {
        this.caches = {};
    }

    public hasCache(url: string): boolean {
        return this.caches[url] != null;
    }

    public addCache(url: string, obj: any): void {
        this.caches[url] = obj;
    }

    public getCache(url: string): any {
        return this.caches[url];
    }

    public removeCache(url: string): void {
        delete this.caches[url];
        cc.loader.release(url);
    }

    private static _instance: CacheManager;
    public static getInstance(): CacheManager {
        if (this._instance == null) {
            this._instance = new CacheManager();
        }
        return this._instance;
    }
}
