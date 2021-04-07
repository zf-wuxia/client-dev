const { ccclass, menu } = cc._decorator;

@ccclass
export class iView extends cc.Component {
    public onEnable(): void {
        this.addEvents();
    }

    public onDisable(): void {
        this.removeEvents();
    }

    public show(parent: cc.Node, data?: object): void {
        if (parent != null && this.node != null) {
            this.node.removeFromParent();
            parent.addChild(this.node);
        }
    }

    public hide(data?: object): void {
        if (this.node != null) {
            this.node.removeFromParent();
        }
    }

    protected render(): void {

    }

    protected addEvents(): void {

    }

    protected removeEvents(): void {

    }
}
