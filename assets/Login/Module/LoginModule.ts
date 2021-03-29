import { iModule } from "../../Framework/Core/iModule";
import { Utils } from "../../Framework/Support/Utils/Utils";

export class LoginModule extends iModule {
    public get assets(): any {
        return ['Login/LoginModule/LoginModule'];
    }

    private btnLogin: cc.Button;

    public initPreset(): void {
        this.btnLogin = Utils.GetNodeChildByName(this.node, 'Button', cc.Button);
    }

    public bindEvents(): void {
        this.btnLogin.node.on(cc.Node.EventType.TOUCH_END, this.onLogin, this);
    }

    public unbindEvents(): void {

    }

    private onLogin(): void {
        console.log('点击了登录');
    }
}
