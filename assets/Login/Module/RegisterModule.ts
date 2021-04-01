import { ModuleName } from "../../Config/Namings/ModuleName";
import { iModule } from "../../Framework/Core/iModule";
import { EventManager } from "../../Framework/Manager/EventManager";
import { Utils } from "../../Framework/Support/Utils/Utils";

export class RegisterModule extends iModule {
    public get assets(): any {
        return ['Login/RegisterModule/RegisterModule'];
    }

    private btnClose: cc.Button;
    private btnRegister: cc.Button;
    private txtAccount: cc.EditBox;
    private txtPassword: cc.EditBox;
    private txtPassword2: cc.EditBox;

    public initPreset(): void {
        this.btnRegister = Utils.GetNodeChildByName(this.node, 'Wrap/Btn_Register', cc.Button);
        this.btnClose = Utils.GetNodeChildByName(this.node, 'Wrap/Btn_Close', cc.Button);
        this.txtAccount = Utils.GetNodeChildByName(this.node, 'Wrap/Account/EditBox', cc.EditBox);
        this.txtPassword = Utils.GetNodeChildByName(this.node, 'Wrap/Password/EditBox', cc.EditBox);
        this.txtPassword2 = Utils.GetNodeChildByName(this.node, 'Wrap/Password2/EditBox', cc.EditBox);
    }

    public bindEvents(): void {
        this.btnClose.node.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
        this.btnRegister.node.on(cc.Node.EventType.TOUCH_END, this.onRegister, this);
    }

    protected onReady() {
        this.txtAccount.string = '';
        this.txtPassword.string = '';
        this.txtPassword2.string = '';
    }

    private onRegister(): void {
        console.log('点击了注册');

        console.log(`账号: ${this.txtAccount.string}`);
        console.log(`密码: ${this.txtPassword.string}`);

        this.hide();
    }

    private onClose(): void {
        this.hide();
    }
}
