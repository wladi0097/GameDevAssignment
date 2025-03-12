import {Application, Assets} from 'pixi.js';
import {FPSDisplay} from "../uiComponents/FPSDisplay";
import OwnAssets from "../configs/OwnAssets";
import {AnimatedBackground} from "../uiComponents/AnimatedBackground";

export class PixiManager {
    private readonly backgroundColor: string =  '#090c67';
    private readonly app: Application;

    constructor() {
        this.app = new Application({
            background: this.backgroundColor,
            resizeTo: window,
            autoDensity: true,
        });

        this.loadRequiredAssets().then(() => {
            this.injectStyle()
            this.injectApp()
            this.injectFPSCounter()
            this.injectAnimatedBackground()
            this.subscribeToWindowEvents()
        });
    }

    private async loadRequiredAssets(): Promise<void> {
        return Assets.load(Object.values(OwnAssets)).then()
    }

    private injectStyle(): void {
        const cssText = `
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        `

        const style: HTMLStyleElement = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
    }

    private injectApp(): void {
        document.body.appendChild(this.app.view as unknown as HTMLElement);
    }

    private subscribeToWindowEvents(): void {
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    private injectFPSCounter(): void {
        void new FPSDisplay(this.app);
    }

    private injectAnimatedBackground(): void {
        void new AnimatedBackground(this.app);
    }

    public getApp(): Application { return this.app; }
}