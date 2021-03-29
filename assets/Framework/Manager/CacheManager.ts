export class CacheManager {
    private static caches: { [key: string]: object } = {};

    public static hasCache(url: string): boolean {
        return this.caches[url] != null;
    }

    public static addCache(url: string, obj: any): void {
        this.caches[url] = obj;
    }

    public static getCache(url: string): any {
        return this.caches[url];
    }

    public static removeCache(url: string): void {
        delete this.caches[url];
        cc.loader.release(url);
    }
}
