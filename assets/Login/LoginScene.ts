import iScene from "../Framework/Core/iScene";
import LoginMediator from "./LoginMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends iScene {
    public onReady(): void {
        this.mediator = new LoginMediator();
    }
}
