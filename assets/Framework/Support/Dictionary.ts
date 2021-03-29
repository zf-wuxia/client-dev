export class Dictionary<K, V> {
    public static ClassName: string = 'Dicitonary';

    private _keys: K[] = [];
    private _vals: V[] = [];

    public setVal(key: K, val: V): void {
        let idx = this._keys.indexOf(key)
        if (idx == -1) {
            this._keys.push(key);
            this._vals.push(val);
        } else { this._vals[idx] = val; }
    }

    public getVal(key: K): V | null {
        let idx = this._keys.indexOf(key)
        return idx == -1 ? null : this._vals[idx]
    }

    public remove(key: K): boolean {
        let idx = this._keys.indexOf(key, 0)
        if (idx > -1) {
            this._keys.splice(idx, 1);
            this._vals.splice(idx, 1);
            return true
        }
        return false
    }

    public hasKey(key: K): boolean {
        return this._keys.indexOf(key) != -1;
    }

    public get size(): number {
        return this._keys.length;
    }

    public keys(): K[] {
        return this._keys;
    }

    public vals(): V[] {
        return this._vals;
    }
}
