import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Manager/EventManager";

export class Dispose implements IDispose {
    public static ClassName: string = 'Dispose';

    constructor() {
        this.init();
    }

    public init(): void {

    }

    public dispose(): void {
        EventManager.getInstance().removeEvent(null, null, this);
    }
}
