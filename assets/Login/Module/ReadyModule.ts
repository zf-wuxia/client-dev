import { iModule } from "../../Framework/Core/iModule";

export class ReadyModule extends iModule {
    public get assets(): any {
        return ['Login/ReadyModule/ReadyModule'];
    }
}
