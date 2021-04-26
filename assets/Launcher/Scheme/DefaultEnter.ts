import { SceneName } from "../../Config/Namings/SceneName";
import { SceneManager } from "../../Framework/Manager/SceneManager";
import LoginScene from "../../Login/LoginScene";
import LauncherScene, { PROGRESS_WIDTH } from "../LauncherScene";

export class DefaultEnter extends cc.Component {
    private _launchScene: LauncherScene;

    public onLoad(): void {
        this._launchScene = this.node.getComponent(LauncherScene);

        this.onReady();

        Utils.name("Utils.name");
        Utils.showModule("Utils.showModule");
    }

    private onReady(): void {
        this.showProgress();
        this.setMessage('正在加载必要资源，请耐心等待。。。');

        let loginScene: LoginScene = new LoginScene();
        loginScene.initModules();
        loginScene.preloadAssets().addCallback(this, this.onLoadComplete, this.onLoadProgress);
    }

    private onLoadComplete(): void {
        SceneManager.getInstance().changeScene(SceneName.SCENE_LOGIN);
    }

    private onLoadProgress(progress: number): void {
        this.setProgress(parseFloat((progress / 100).toFixed(2)));
    }

    private setMessage(message: string): void {
        if (this._launchScene != null) {
            this._launchScene.lblMessage.string = message;
            cc.log(`Message: ${message} `);
        }
    }

    private setProgress(progress: number): void {
        if (this._launchScene != null) {
            this._launchScene.lblProgress.string = parseFloat((progress * 100).toFixed(2)) + '%';
            this._launchScene.barProgress.width = PROGRESS_WIDTH * progress;
        }
    }

    private showProgress(): void {
        if (this._launchScene != null) {
            this._launchScene.layProgress.active = true;
        }
    }

    private hideProgress(): void {
        if (this._launchScene != null) {
            this._launchScene.layProgress.active = false;
        }
    }
}
