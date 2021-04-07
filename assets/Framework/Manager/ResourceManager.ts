import { iFunction } from "../Core/iFunction";
import { ILoader } from "../Interfaces/ILoader";
import { LoaderType } from "../Support/Enum/LoaderType";
import { Assets } from "../Support/Loader/Assets";
import { Loader } from "../Support/Loader/Loader";
import { SceneLoader } from "../Support/Loader/SceneLoader";
import { CacheManager } from "./CacheManager";

export class ResourceManager {
    private static loadCallbacks: { [key: string]: any[] } = {};

    public static LoadText(path: string, onComplete?: iFunction): void {
        this.addLoader(path, LoaderType.TEXT, {
            onComplete: onComplete,
        });
    }

    public static LoadAudio(path: string, onComplete?: iFunction): void {
        let asset = Assets.getAudio(path);
        this.addLoader(asset, LoaderType.AUDIO, {
            onComplete: onComplete,
        });
    }

    public static LoadPrefab(prefabName: string, onComplete?: iFunction): void {
        if (prefabName == null) {
            return;
        }
        let asset = Assets.getPrefab(prefabName);
        this.addLoader(asset, LoaderType.PREFAB, {
            onComplete: onComplete,
        });
    }

    public static LoadAnimation(animationName: string, animation: cc.Animation, autoPlay?: string, playComplete?: Function, onComplete?: iFunction): void {
        let path = Assets.getAnimationPath(animationName)
        this.addLoader(path, LoaderType.ANIMATION, {
            animAtion: animation,
            playName: autoPlay,
            playComplete: playComplete,
            onComplete: onComplete,
        }, cc.AnimationClip);
    }

    public static LoadDragonBone(path: string, armature?: dragonBones.ArmatureDisplay, armatureName?: string, animationName?: string, playTimes?: number, onComplete?: iFunction, onError?: iFunction): void {
        let dragonBoneData = Assets.getDragonBone(path);
        this.addLoader(dragonBoneData, LoaderType.DRAGON_BONE, {
            armatureDisplay: armature,
            armatureName: armatureName,
            animationName: animationName,
            onComplete: onComplete,
            onError: onError,
            playTimes: playTimes,
        });
    }

    public static LoadSpriteFrame(assetName: string, sprite: cc.Sprite, onComplete?: iFunction): void {
        let plistIndex = assetName.indexOf(':');
        let spriteAsset = Assets.getTexture(assetName);
        if (plistIndex != -1) {
            let assets = spriteAsset.split(':');
            if (CC_EDITOR) {
                assets[0] = assets[0] + '.plist';
            }
            this.addLoader(assets[0], LoaderType.SPRITE_ATLAS, {
                sprite: sprite,
                assetName: assets[1],
                onComplete: onComplete,
            }, cc.SpriteAtlas);
        } else {
            this.addLoader(spriteAsset, LoaderType.SPRITE, {
                sprite: sprite,
                onComplete: onComplete,
            }, cc.SpriteFrame);
        }
    }

    public static LoadButtonSpriteFrame(assetName: string, button: cc.Button, frameName: string, onComplete?: iFunction): void {
        let plistIndex = assetName.indexOf(':');
        let spriteAsset = Assets.getTexture(assetName);
        if (plistIndex != -1) {
            let assets = spriteAsset.split(':')
            if (CC_EDITOR) {
                assets[0] = assets[0] + '.plist';
            }
            this.addLoader(assets[0], LoaderType.SPRITE_ATLAS, {
                button: button,
                frameName: frameName,
                assetName: assets[1],
                onComplete: onComplete,
            }, cc.SpriteAtlas);
        } else {
            this.addLoader(spriteAsset, LoaderType.SPRITE, {
                button: button,
                frameName: frameName,
                onComplete: onComplete,
            }, cc.SpriteFrame);
        }
    }

    public static LoadScene(sceneName: string, onComplete?: iFunction, onProgress?: iFunction): void {
        this.addLoader(sceneName, LoaderType.SCENE, {
            onComplete: onComplete,
            onProgress: onProgress,
        });
    }

    public static LoadImage(assetName: string, sprite: cc.Sprite, onComplete?: iFunction): void {
        this.addLoader(assetName, LoaderType.IMAGE, {
            sprite: sprite,
            onComplete: onComplete,
        }, cc.SpriteFrame);
    }

    public static LoadFont(assetName: string, label: cc.Label, onComplete?: iFunction): void {
        let asset = Assets.getFonts(assetName);
        this.addLoader(asset, LoaderType.FONT, {
            label: label,
            onComplete: onComplete,
        }, cc.Font);
    }

    private static addLoader(asset: any, loaderType: LoaderType, data: any, assetType?: any): void {
        let assetName = asset;

        if (loaderType == LoaderType.DRAGON_BONE) {
            assetName = asset.name;
        }

        if (CacheManager.getInstance().hasCache(assetName)) {
            this.excuteAssetCallback(assetName, loaderType, data);
        }
        else if (this.loadCallbacks[assetName] == null) {
            let loader: ILoader;
            switch (loaderType) {
                case LoaderType.SCENE:
                    loader = SceneLoader.Get();
                    break;
                case LoaderType.DRAGON_BONE:
                    break;
                default:
                    loader = Loader.get();
                    break;
            }

            this.loadCallbacks[assetName] = [data];
            loader.addCallback(this, this.onLoadComplete, this.onLoadProgress, this.onLoadError);
            loader.load(asset, assetType, loaderType);
        }
        else {
            this.loadCallbacks[assetName].push(data);
        }
    }

    private static onLoadComplete(loader: any): void {
        if (loader instanceof Loader) {
            for (let i = 0; i < loader.size; i++) {
                let assetPath = loader.getURL(i);
                let loaderType = loader.getLoaderType(i);
                let callbacks = this.loadCallbacks[assetPath];
                if (callbacks == null) {
                    continue;
                }
                for (let j = 0; j < callbacks.length; j++) {
                    this.excuteAssetCallback(assetPath, loaderType, callbacks[j]);
                }
                delete this.loadCallbacks[assetPath];
            }
        }
        else if (loader instanceof SceneLoader) {
            let assetPath = loader.getSceneName(0);
            let callbacks = this.loadCallbacks[assetPath];
            if (callbacks == null) {
                return;
            }
            for (let j = 0; j < callbacks.length; j++) {
                this.excuteAssetCallback(assetPath, LoaderType.SCENE, callbacks[j]);
            }
            delete this.loadCallbacks[assetPath];
        }
    }

    private static onLoadProgress(p: number, loader: any): void {
        if (loader instanceof SceneLoader) {
            let assetPath = loader.getSceneName(0);
            let callbacks = this.loadCallbacks[assetPath];
            if (callbacks == null) {
                return;
            }
            for (let i = 0; i < callbacks.length; i++) {
                if (callbacks[i] == null) {
                    continue;
                }
                let func: iFunction = callbacks[i]['onProgress'];
                if (func != null) {
                    func.execute();
                }
            }
        }
    }

    private static onLoadError(err: any): void {
        let callbacks = this.loadCallbacks[err.resName];
        console.error('[资源加载出错]', err.message, 'resName =>', err.resName, '等待毁掉函数 =>', callbacks ? callbacks.length : 0);
        delete this.loadCallbacks[err.resName];

        if (callbacks == null) {
            return
        }

        for (let i = 0; i < callbacks.length; i++) {
            if (callbacks[i] == null) {
                continue;
            }
            let func: iFunction = callbacks[i]['onError'];
            if (func != null) {
                func.execute();
            }
        }
        callbacks.length = 0;
    }

    private static excuteAssetCallback(assetPath: string, loaderType: LoaderType, data: any): void {
        switch (loaderType) {
            case LoaderType.SPRITE_ATLAS:
                let spf = CacheManager.getInstance().getCache(assetPath).getSpriteFrame(data['assetName']);
                if (data['sprite'] != null) {
                    (data["sprite"] as cc.Sprite).spriteFrame = spf;
                }
                if (data['button'] != null) {
                    data['button'][data["frameName"]] = spf;
                }
                break;
            case LoaderType.SPRITE, LoaderType.IMAGE:
                let asset = CacheManager.getInstance().getCache(assetPath);
                // 将Texture2D 转换成SpriteFrame
                if (asset instanceof cc.Texture2D) {
                    asset = new cc.SpriteFrame(asset);
                    CacheManager.getInstance().addCache(assetPath, asset);
                }
                if (data['sprite'] != null) {
                    (data['sprite'] as cc.Sprite).spriteFrame = asset;
                }
                if (data['button'] != null) {
                    data['button'][data['frameName']] = asset;
                }
                break;
            case LoaderType.FONT:
                if (data['label'] != null) {
                    data['label'].font = CacheManager.getInstance().getCache(assetPath);
                }
                break;
            case LoaderType.ANIMATION:
                if (data['animAtion'] != null) {
                    let anim: cc.Animation = data['animAtion'];
                    let clip = CacheManager.getInstance().getCache(assetPath);
                    anim.addClip(clip);
                    if (data['playName']) {
                        anim.play(data['playName'], 0);
                        if (data['playComplete']) {
                            anim.on('stop', data['playComplete']);
                        }
                    }
                }
                break;
            case LoaderType.DRAGON_BONE:
                let dragonBoneData = CacheManager.getInstance().getCache(assetPath);
                if (data["armatureDisplay"] != null) {
                    data["armatureDisplay"].dragonAsset = dragonBoneData.dragonAsset
                    data["armatureDisplay"].dragonAtlasAsset = dragonBoneData.dragonAtlasAsset
                    if (data["armatureName"] == null) {
                        let armatures: any[] = data["armatureDisplay"].getArmatureNames()
                        data["armatureName"] = armatures[0]
                        if (data["animationName"] == null) {
                            for (let k = 0; k < armatures.length; k++) {
                                let animations: any[] = data["armatureDisplay"].getAnimationNames(armatures[k])
                                if (animations.length == 0) { continue }
                                data["armatureName"] = armatures[k]
                                data["animationName"] = animations[0]
                                break
                            }
                        }
                    } else {
                        if (data["animationName"] == null) {
                            let animations: any[] = data["armatureDisplay"].getAnimationNames(data["armatureName"])
                            if (animations.length != 0) { data["animationName"] = animations[0] }
                        }
                    }
                    if (data["armatureName"] != null) { data["armatureDisplay"].armatureName = data["armatureName"] }
                    if (data["animationName"] != null) { data["armatureDisplay"].playAnimation(data["animationName"], data["playTimes"] ? data["playTimes"] : -1) }

                }
                break;
        }

        let func: iFunction = data['onComplete'];
        if (func != null) {
            if (data['args'] == null) {
                data['args'] = [];
            }
            data['args'].unshift(assetPath);
            if (func.size == 0) {
                func.execute();
            } else {
                func.execute(data['args']);
            }
        }
    }

    public static InstantiatePrefab(prefabName: string): any {
        let prefabAsset = Assets.getPrefab(prefabName);
        let clz = CacheManager.getInstance().getCache(prefabAsset);
        if (clz != null) {
            return cc.instantiate(clz);
        }
        return null;
    }

    public static ReleaseAsset(asset: any | string): void {
        let path: string;
        if (typeof asset == 'string') {
            path = Assets.getPrefab(asset);
        } else {
            switch (asset.type) {
                case LoaderType.PREFAB:
                    path = Assets.getPrefab(asset.asset);
                    break;
                case LoaderType.IMAGE:
                    path = Assets.getTexture(asset.asset);
                    break;
                case LoaderType.AUDIO:
                    path = Assets.getAudioURL(asset.asset, asset.audioType);
                    break;
                case LoaderType.DRAGON_BONE:
                    let dragonBoneData = Assets.getDragonBone(asset.asset);
                    path = dragonBoneData.tex;
                    let texture = CacheManager.getInstance().getCache(path);
                    if (texture != null) {
                        cc.loader.releaseAsset(texture);
                    }
                    path = dragonBoneData.ske;
                    break;
            }
        }

        if (path != null) {
            let a = CacheManager.getInstance().getCache(path);
            if (a != null) {
                cc.loader.releaseAsset(a);
            }
            CacheManager.getInstance().removeCache(path);
            console.log('释放资源 =>', path);
        } else {
            if (asset.type == LoaderType.IMAGE) {
                path = Assets.getTexture(asset.asset);
            }
            cc.loader.releaseRes(path);
            CacheManager.getInstance().removeCache(path);
        }
    }
}
