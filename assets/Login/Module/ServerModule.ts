import { iModule } from "../../Framework/Core/iModule";

export class ServerModule extends iModule {
    public get assets(): any {
        return ['Login/ServerModule/ServerModule'];
    }
}
