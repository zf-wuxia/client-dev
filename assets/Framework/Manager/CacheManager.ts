export class CacheManager {
    private static caches: { [key: string]: object } = {};

    public static HasCache(url: string): boolean {
        return this.caches[url] != null;
    }

    public static AddCache(url: string, obj: any): void {
        this.caches[url] = obj;
    }

    public static GetCache(url: string): any {
        return this.caches[url];
    }

    public static RemoveCache(url: string): void {
        delete this.caches[url];
        cc.loader.release(url);
    }
}
