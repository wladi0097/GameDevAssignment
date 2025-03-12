import { PixiManager } from './PixiManager';
import {PageBase} from "./PageBase";
import {Application} from "pixi.js";
import {MainMenu} from "../pages/MainMenu";

export class AppManager {
    private pixiManager: PixiManager;
    private currentPage: PageBase | null = null;

    constructor(pixiManager: PixiManager) {
        this.pixiManager = pixiManager;
    }

    public getPixiApp(): Application {
        return this.pixiManager.getApp();
    }

    public changePage(page: new (app: AppManager) => PageBase): void {
        if (this.currentPage) {
            this.currentPage.destroy();
        }

        this.currentPage = new page(this);
        this.currentPage.render();
    }

    public changeToMainMenu(): void {
        this.changePage(MainMenu);
    }
}