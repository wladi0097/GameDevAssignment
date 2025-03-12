import {Application, Container, Graphics, Ticker} from "pixi.js";

export class AnimatedBackground {
    private readonly shapesAmount: number = 20;
    private readonly shapeSize: number = 10;
    private readonly minSpeed: number = .5;
    private readonly maxSpeed: number = 1.5;

    protected container: Container;

    private shapes: { graphic: Graphics; vx: number; vy: number }[] = [];
    private ticker: Ticker;

    constructor(public app: Application) {
        this.ticker = new Ticker();
        this.container = new Container();
        this.app.stage.addChild(this.container);
        this.createShapes();
        this.animate();
    }

    private createShapes(): void {
        for (let i = 0; i < this.shapesAmount; i++) {
            const shape = this.createRandomShape();
            this.container.addChild(shape.graphic);
            this.shapes.push(shape);
        }
    }

    private createRandomShape(): { graphic: Graphics; vx: number; vy: number } {
        const shape = new Graphics();

        const color = Math.random() * 0xFFFFFF;
        const alpha = Math.random() * 0.5 + 0.2;
        shape.beginFill(color, alpha);

        const type = Math.floor(Math.random() * 3);
        switch (type) {
            case 0: // Circle
                shape.drawCircle(0, 0, this.shapeSize);
                break;
            case 1: // Rectangle
                shape.drawRect(-this.shapeSize / 2, -this.shapeSize / 2, this.shapeSize, this.shapeSize);
                break;
            case 2: // Triangle
                shape.drawPolygon([
                    -this.shapeSize, this.shapeSize,
                    this.shapeSize, this.shapeSize,
                    0, -this.shapeSize
                ]);
                break;
        }
        shape.endFill();

        shape.x = Math.random() * this.app.screen.width;
        shape.y = Math.random() * this.app.screen.height;

        const vx = (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (Math.random() > 0.5 ? 1 : -1);
        const vy = (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (Math.random() > 0.5 ? 1 : -1);

        return { graphic: shape, vx, vy };
    }

    private animate(): void {
        this.ticker.add(() => {
            for (const shape of this.shapes) {
                shape.graphic.x += shape.vx;
                shape.graphic.y += shape.vy;

                if (shape.graphic.x > this.app.screen.width + this.shapeSize) {
                    shape.graphic.x = -this.shapeSize;
                    shape.vx = this.getRandomVelocity();
                    shape.vy = this.getRandomVelocity();
                }
                if (shape.graphic.x < -this.shapeSize) {
                    shape.graphic.x = this.app.screen.width + this.shapeSize;
                    shape.vx = this.getRandomVelocity();
                    shape.vy = this.getRandomVelocity();
                }
                if (shape.graphic.y > this.app.screen.height + this.shapeSize) {
                    shape.graphic.y = -this.shapeSize;
                    shape.vx = this.getRandomVelocity();
                    shape.vy = this.getRandomVelocity();
                }
                if (shape.graphic.y < -this.shapeSize) {
                    shape.graphic.y = this.app.screen.height + this.shapeSize;
                    shape.vx = this.getRandomVelocity();
                    shape.vy = this.getRandomVelocity();
                }
            }
        });
        this.ticker.start();
    }

    private getRandomVelocity(): number {
        return (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (Math.random() > 0.5 ? 1 : -1);
    }
}