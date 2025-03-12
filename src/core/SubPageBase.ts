import {PageBase} from "./PageBase";
import {Button} from "../uiComponents/Button";
import {AppManager} from "./AppManager";

export abstract class SubPageBase extends PageBase {
    constructor(appManager: AppManager) {
        super(appManager);
        this.renderBackButton();
    }

    private renderBackButton(): void {
        const button: Button = new Button("Back to Menu")
        button.position.set(10, 10);
        button.onClick(() => this.appManager.changeToMainMenu())
        this.container.addChild(button);
    }
}