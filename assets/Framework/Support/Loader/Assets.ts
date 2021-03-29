import { AudioType, LoaderType } from "../Enum/LoaderType";
import { Loader } from "./Loader";

export class Assets {
    public static Prefabs: string = 'Prefabs/';
    public static Scenes: string = '';
    public static Textures: string = 'Textures/';
    public static Languages: string = 'Languages/';
    public static Fonts: string = 'Fonts/';
    public static Audios: string = 'Audios/';
    public static DragonBones: string = 'DragonBones/';
    public static Animations: string = 'Animations/';
    public static EffectDir: string = 'Effects/';
    public static MusicDir: string = 'Musice/';

    public static getAudio(name: string): string {
        return this.Audios + name;
    }

    public static getPrefab(name: string): string {
        return this.Prefabs + name;
    }

    public static getTexture(name: string, extension: string = 'png'): string {
        if (CC_EDITOR) {
            if (name.indexOf(':') != -1) {
                return 'resources/' + this.Textures + name;
            } else {
                return 'resources/' + this.Textures + '.' + extension;
            }
        }
        return this.Textures + name;
    }

    public static getFonts(name: string): string {
        return this.Fonts + name;
    }

    public static getAudioURL(audioName: string, audioType: AudioType): string {
        var dir: string = this.MusicDir;
        if (audioType == AudioType.EFFECT) {
            dir = this.EffectDir;
        }
        return dir + audioName;
    }

    public static getAnimationPath(name: string): string {
        if (CC_EDITOR) {
            return 'resources/' + this.Animations + name + '.anim';
        }
        return this.Animations + name;
    }

    public static getLanguage(languageName: string): string {
        if (CC_EDITOR) {
            return 'resources/' + this.Languages + languageName + '.json';
        }
        return this.Languages + languageName;
    }

    public static getDragonBone(dragonBoneName: string): { name: string, ske: string, tex: string, img: string } {
        if (CC_EDITOR) {
            return {
                name: this.DragonBones + dragonBoneName,
                ske: 'resources/' + this.DragonBones + dragonBoneName + '_ske.json',
                tex: 'resources/' + this.DragonBones + dragonBoneName + '_tex.json',
                img: 'resources/' + this.DragonBones + dragonBoneName + '_tex.png',
            };
        }
        return {
            name: this.DragonBones + dragonBoneName,
            ske: this.DragonBones + dragonBoneName + '_ske',
            tex: this.DragonBones + dragonBoneName + '_tex',
            img: this.DragonBones + dragonBoneName + '_tex',
        };
    }

    public static getAssets(assets: any[]): string[] {
        for (let i = 0; i < assets.length; i++) {
            if (assets[i] == null) {
                assets.splice(i, 1);
                i--;
            }
            if (typeof assets[i] == 'string') {
                assets[i] = this.getPrefab(assets[i]);
            } else {
                switch (assets[i].type) {
                    case LoaderType.PREFAB:
                        assets[i] = this.getPrefab(assets[i].asset);
                        break;
                    case LoaderType.IMAGE, LoaderType.SPRITE:
                        assets[i] = this.getTexture(assets[i].asset);
                        break;
                    case LoaderType.AUDIO:
                        assets[i] = this.getAudioURL(assets[i].asset, assets[i].audioType);
                        break;
                    case LoaderType.DRAGON_BONE:
                        let dragonBoneData = Assets.getDragonBone(assets[i].asset);
                        assets[i] = {
                            type: dragonBones.DragonBonesAsset,
                            asset: dragonBoneData.ske,
                        };
                        assets.splice(i, 0, {
                            type: dragonBones.DragonBonesAtlasAsset,
                            asset: dragonBoneData.tex,
                        });
                        i++;
                        break;
                    case LoaderType.SPRITE_ATLAS:
                        assets[i] = this.getTexture(assets[i].asset + '.plist');
                        break;
                }
            }
        }
        return assets;
    }
}
