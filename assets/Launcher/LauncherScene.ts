import { SceneName } from "../Config/Namings/SceneName";
import iScene from "../Framework/Core/iScene";
import { iMain } from "../Framework/iMain";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LauncherScene extends iScene {
    public onLoad(): void {
        super.onLoad();

        if (cc.sys.isNative) {
            this.nativeEnterLogic();
        } else {
            this.defaultEnterLogic();
        }
    }

    private nativeEnterLogic(): void {

    }

    private defaultEnterLogic(): void {
        setTimeout(() => {
            this.loadComplete();
        }, 1000);
    }

    private loadComplete(): void {
        iMain.changeScene(SceneName.SCENE_LOGIN);
    }

    private loadProgress(progress: number): void {

    }
}
