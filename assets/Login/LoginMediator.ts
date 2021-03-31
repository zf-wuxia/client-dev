import { ModuleName } from "../Config/Namings/ModuleName";
import { iMediator } from "../Framework/Core/iMediator";
import { EventManager } from "../Framework/Manager/EventManager";
import { GameLayer, GameLayerNames } from "../Framework/Support/Enum/GameLayer";
import { LoginModule } from "./Module/LoginModule";

export default class LoginMediator extends iMediator {
    public initModules(): void {
        this.addModule(ModuleName.LOGIN_MODULE, LoginModule);
    }

    public showModules(): void {
        EventManager.ShowModule(ModuleName.LOGIN_MODULE, GameLayer.UI);
    }
}
