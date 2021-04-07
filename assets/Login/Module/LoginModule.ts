import { ModuleName } from "../../Config/Namings/ModuleName";
import { iModule } from "../../Framework/Core/iModule";
import { EventManager } from "../../Framework/Manager/EventManager";
import { GameLayer } from "../../Framework/Support/Enum/GameLayer";
import { Utils } from "../../Framework/Support/Utils/Utils";

export class LoginModule extends iModule {
    public get assets(): any {
        return ['Login/LoginModule/LoginModule'];
    }

    private btnLogin: cc.Button;
    private btnRegister: cc.Button;
    private btnChangePassword: cc.Button;

    public initPreset(): void {
        this.btnLogin = Utils.GetNodeChildByName(this.node, 'Btn_Login', cc.Button);
        this.btnRegister = Utils.GetNodeChildByName(this.node, 'Btn_Register', cc.Button);
        this.btnChangePassword = Utils.GetNodeChildByName(this.node, 'Btn_ChangePassword', cc.Button);
    }

    public bindEvents(): void {
        this.btnLogin.node.on(cc.Node.EventType.TOUCH_END, this.onLogin, this);
        this.btnRegister.node.on(cc.Node.EventType.TOUCH_END, this.onRegister, this);
        this.btnChangePassword.node.on(cc.Node.EventType.TOUCH_END, this.onChangePassword, this);
    }

    private onLogin(): void {
        console.log('点击了登录');
        EventManager.getInstance().showModule(ModuleName.PLAYER_MODULE, GameLayer.Popup);
        this.hide();
    }

    private onRegister(): void {
        console.log('点击了注册');
        EventManager.getInstance().showModule(ModuleName.REGISTER_MODULE, GameLayer.Popup);
    }

    private onChangePassword(): void {
        console.log('点击了忘记密码');
    }
}
