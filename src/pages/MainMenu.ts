import {PageBase} from "../core/PageBase";
import {Sprite, Text} from "pixi.js";
import {Button} from "../uiComponents/Button";
import subPages from "../configs/SubPages";
import OwnAssets from "../configs/OwnAssets";

export class MainMenu extends PageBase {
    private logo: Text | null = null;
    private buttons: Button[] = [];
    private wladiImage: Sprite | null = null;

    render(): void {
        this.logo = new Text('Game Developer\nAssignment', { fill: '#fff', fontSize: 36, align: 'center' });
        this.logo.anchor.set(0.5);
        this.container.addChild(this.logo);

        subPages.forEach(subPage => {
            const button: Button = new Button(subPage.title)
            button.onClick(() => this.appManager.changePage(subPage.component))
            this.buttons.push(button)
            this.container.addChild(button);
        })

        this.wladiImage = Sprite.from(OwnAssets.wladi)
        this.wladiImage.anchor.set(0.5);
        this.wladiImage.scale.set(0.7);
        this.container.addChild(this.wladiImage);

        this.resize()
    }

    resize(): void {
        let heightOffset: number = 200;
        this.buttons.forEach(button => {
            button.position.set(this.app.screen.width / 2 - 100, heightOffset);
            heightOffset += 75;
        })

        if (this.logo) this.logo.position.set(this.app.screen.width / 2, 100);
        if (this.wladiImage) this.wladiImage.position.set(this.app.screen.width / 2, heightOffset + 150);
    }
}