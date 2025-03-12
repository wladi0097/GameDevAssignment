import { Text, Application } from 'pixi.js';

export class FPSDisplay {
    private readonly fpsText: Text;

    constructor(app: Application) {
        this.fpsText = new Text('FPS: 0', {
            fill: '#00ff2c',
            fontSize: 16,
        });
        this.fpsText.position.set(10, app.screen.height - 30);
        app.stage.addChild(this.fpsText);

        app.ticker.add(() => this.update(app.ticker.FPS));
        window.addEventListener('resize', () => this.resize(app));
    }

    private update(fps: number): void {
        this.fpsText.text = `FPS: ${Math.round(fps)}`;
    }

    private resize(app: Application): void {
        this.fpsText.position.set(10, app.screen.height - 30);
    }
}