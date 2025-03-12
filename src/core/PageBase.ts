import {Application, Container} from "pixi.js";
import {AppManager} from "./AppManager";

export abstract class PageBase {
    protected appManager: AppManager;
    protected app: Application;
    protected container: Container;
    private boundEventResize: () => void;

    constructor(appManager: AppManager) {
        this.appManager = appManager;
        this.app = this.appManager.getPixiApp();
        this.container = new Container();
        this.app.stage.addChild(this.container);

        this.boundEventResize = this.eventResize.bind(this);
        window.addEventListener('resize', this.boundEventResize);
    }

    public destroy(): void {
        this.app.stage.removeChild(this.container);
        this.container.destroy({ children: true });
        window.removeEventListener('resize', this.boundEventResize);
    }

    private eventResize(): void {
        this.resize();
    }

    public abstract render(): void
    public abstract resize(): void
}