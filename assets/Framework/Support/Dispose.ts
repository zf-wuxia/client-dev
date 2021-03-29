import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Manager/EventManager";

export class Dispose implements IDispose {
    public static ClassName: string = 'Dispose';

    constructor() {
        this.initialize();
    }

    public initialize(): void {

    }

    public dispose(): void {
        EventManager.removeEvent(this);
    }
}
