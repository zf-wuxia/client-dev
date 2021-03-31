import { SceneName } from "../Config/Namings/SceneName";
import iScene from "../Framework/Core/iScene";
import { iMain } from "../Framework/iMain";
import LoginMediator from "../Login/LoginMediator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LauncherScene extends iScene {
    @property(cc.Node)
    nodeProgress: cc.Node = null;

    @property(cc.Label)
    lblProgress: cc.Label = null;

    @property(cc.Label)
    lblMessage: cc.Label = null;

    public onLoad(): void {
        super.onLoad();

        if (cc.sys.isNative) {
            this.nativeEnterLogic();
        } else {
            this.defaultEnterLogic();
        }
    }

    private nativeEnterLogic(): void {
        this.lblMessage.string = '正在更新资源，请耐心等候。。。';
    }

    private defaultEnterLogic(): void {
        this.lblMessage.string = '正在加载必要资源，请耐心等待。。。';

        let loginMediator: LoginMediator = new LoginMediator();
        loginMediator.initModules();
        loginMediator.preloadAssets().addCallback(this, this.onLoadComplete, this.onLoadProgress);
    }

    private onLoadComplete(): void {
        iMain.ChangeScene(SceneName.SCENE_LOGIN);
    }

    private onLoadProgress(progress: number): void {
        let widthLimit = 504;
        this.lblProgress.string = progress + '%';
        this.nodeProgress.width = widthLimit * progress * 0.01;
    }
}
