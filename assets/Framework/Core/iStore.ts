import { IDispose } from "../Interfaces/IDispose";
import { EventManager } from "../Manager/EventManager";
import { Dispose } from "../Support/Dispose";

export class iStore extends Dispose implements IDispose {
    public reset(): void {

    }

    public dispose(): void {
        super.dispose();
        EventManager.removeEvent(this);
    }
}
