import { SceneName } from "../Config/Namings/SceneName";
import iScene from "../Framework/Core/iScene";
import { iMain } from "../Framework/iMain";
import LoginMediator from "../Login/LoginMediator";

const {ccclass, property} = cc._decorator;

const PROGRESS_WIDTH = 504;
const NATIVE_ENTER_MESSAGE = '正在更新资源，请耐心等候。。。';
const BROWSER_ENTER_MESSAGE = '正在加载必要资源，请耐心等待。。。';

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
            this.browserEnterLogic();
        }
    }

    private nativeEnterLogic(): void {
        this.lblMessage.string = NATIVE_ENTER_MESSAGE;
    }

    private browserEnterLogic(): void {
        this.lblMessage.string = BROWSER_ENTER_MESSAGE;

        let loginMediator: LoginMediator = new LoginMediator();
        loginMediator.initModules();
        loginMediator.preloadAssets().addCallback(this, this.onLoadComplete, this.onLoadProgress);
    }

    private onLoadComplete(): void {
        iMain.ChangeScene(SceneName.SCENE_LOGIN);
    }

    private onLoadProgress(progress: number): void {
        this.lblProgress.string = progress + '%';
        this.nodeProgress.width = PROGRESS_WIDTH * progress * 0.01;
    }
}
