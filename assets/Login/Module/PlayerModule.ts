import { SceneName } from "../../Config/Namings/SceneName";
import { iModule } from "../../Framework/Core/iModule";
import { iMainMediator } from "../../Framework/iMainMediator";
import { EventManager } from "../../Framework/Manager/EventManager";
import { Utils } from "../../Framework/Support/Utils/Utils";

export class PlayerModule extends iModule {
    public get assets(): any {
        return ['Login/PlayerModule/PlayerModule'];
    }

    private sprHeroBody: cc.Sprite;
    private btnSubmit: cc.Button;
    private btnRandom: cc.Button;
    private layHeadWrap: cc.Node;
    private layName: cc.Node;
    private layNameWrap: cc.Node;
    private layNameCancel: cc.Node;
    private txtName: cc.EditBox;
    private animlock: boolean;

    public initPreset(): void {
        this.sprHeroBody = Utils.GetNodeChildByName(this.node, 'HeroBody', cc.Sprite);
        this.layHeadWrap = Utils.GetNodeChildByName(this.node, 'HeadWrap');
        this.layName = Utils.GetNodeChildByName(this.node, 'HeroName');
        this.layNameWrap = Utils.GetNodeChildByName(this.node, 'HeroName/Wrap');
        this.layNameCancel = Utils.GetNodeChildByName(this.node, 'HeroName/Cancel');
        this.btnSubmit = Utils.GetNodeChildByName(this.node, 'HeroName/Wrap/Btn_Submit', cc.Button);
        this.btnRandom = Utils.GetNodeChildByName(this.node, 'HeroName/Wrap/Btn_Random', cc.Button);
        this.txtName = Utils.GetNodeChildByName(this.node, 'HeroName/Wrap/EditBox', cc.EditBox);
    }

    public bindEvents(): void {
        this.btnRandom.node.on(cc.Node.EventType.TOUCH_END, this.onRandom, this);
        this.btnSubmit.node.on(cc.Node.EventType.TOUCH_END, this.onSubmit, this);
        this.layNameCancel.on(cc.Node.EventType.TOUCH_END, this.onCancelName, this);

        this.layHeadWrap.children.forEach((node: cc.Node, idx: number) => {
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this.animlock = true;
                this.layName.active = true;
                cc.tween(this.layNameWrap).set({
                    opacity: 180,
                    x: -cc.winSize.width,
                }).to(0.3, {
                    x: 0,
                    opacity: 255,
                }).call(() => {
                    this.animlock = false;
                }).start();
            }, this);
        });
    }

    protected onReady() {
    }

    private onSubmit(): void {
        console.log(`名字: ${this.txtName.string}`);
        EventManager.ChangeScene(SceneName.SCENE_GAME);
    }

    private onRandom(): void {
        this.txtName.string = '我是传奇';
    }

    private onCancelName(): void {
        if (this.animlock) {
            return;
        }
        this.animlock = true;
        cc.tween(this.layNameWrap).to(0.3, {
            x: -cc.winSize.width,
            opacity: 128,
        }).call(() => {
            this.animlock = false;
            this.layName.active = false;
        }).start();
    }
}
