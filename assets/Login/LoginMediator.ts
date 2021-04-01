import { ModuleName } from "../Config/Namings/ModuleName";
import { iMediator } from "../Framework/Core/iMediator";
import { EventManager } from "../Framework/Manager/EventManager";
import { GameLayer, GameLayerNames } from "../Framework/Support/Enum/GameLayer";
import { LoginModule } from "./Module/LoginModule";
import { PlayerModule } from "./Module/PlayerModule";
import { ReadyModule } from "./Module/ReadyModule";
import { RegisterModule } from "./Module/RegisterModule";
import { ServerModule } from "./Module/ServerModule";

export default class LoginMediator extends iMediator {
    public initModules(): void {
        this.addModule(ModuleName.LOGIN_MODULE, LoginModule);
        this.addModule(ModuleName.READY_MODULE, ReadyModule);
        this.addModule(ModuleName.PLAYER_MODULE, PlayerModule);
        this.addModule(ModuleName.REGISTER_MODULE, RegisterModule);
        this.addModule(ModuleName.SERVER_MODULE, ServerModule);
    }

    public showModules(): void {
        EventManager.ShowModule(ModuleName.LOGIN_MODULE, GameLayer.UI);
    }
}
