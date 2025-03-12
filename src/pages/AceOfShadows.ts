import {SubPageBase} from "../core/SubPageBase";
import {Container, Sprite, Ticker} from "pixi.js";
import OwnAssets from "../configs/OwnAssets";

export class AceOfShadows extends SubPageBase {
    private leftStack: Container | null = null;
    private rightStack: Container | null = null;
    private ticker: Ticker | null = null;
    private isMoving: boolean = false;
    private fromLeftToRight: boolean = true;
    private animationRunning: boolean = false;

    render(): void {
        this.leftStack = new Container();
        this.container.addChild(this.leftStack);
        this.rightStack = new Container();
        this.container.addChild(this.rightStack);

        for (let i = 0; i < 144; i++) {
            const card = Sprite.from(OwnAssets.card);
            card.anchor.set(0.5);
            card.position.set(0, -i * 2);
            this.leftStack.addChild(card);
        }

        this.animationRunning = true;
        this.resize()
        this.ticker = new Ticker();
        this.ticker.add(() => this.moveTopCard());
        this.ticker.start();
    }

    private moveTopCard(): void {
        if (this.isMoving ||!this.leftStack ||!this.rightStack) return;

        const sourceStack = this.fromLeftToRight ? this.leftStack : this.rightStack;
        const targetStack = this.fromLeftToRight ? this.rightStack : this.leftStack;

        if (sourceStack.children.length === 0) {
            this.fromLeftToRight = !this.fromLeftToRight;
            return;
        }

        this.isMoving = true;
        const topCard = sourceStack.children[sourceStack.children.length - 1] as Sprite;
        this.animateCard(topCard, sourceStack, targetStack);
        setTimeout(() => {
            this.isMoving = false;
        }, 3000)
    }

    private animateCard(card: Sprite, source: Container, target: Container): void {
        const targetYPos = -target.children.length * 2;
        const targetGlobalPos = target.position;
        const sourceGlobalPos = source.position;

        target.addChild(card);

        const startX = card.position.x + (sourceGlobalPos.x - targetGlobalPos.x);
        const startY = card.position.y + (sourceGlobalPos.y - targetGlobalPos.y);

        card.position.set(startX, startY);

        const duration = 2000;
        const startTime = performance.now();

        const animate = () => {
            if (!this.animationRunning) return;

            const now = performance.now();
            const progress = Math.min((now - startTime) / duration, 1);

            card.position.set(
                startX + (0 - startX) * progress,
                startY + (targetYPos - startY) * progress
            );

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                card.position.set(0, targetYPos);
            }
        };

        animate();
    }

    resize(): void {
        if (this.leftStack && this.rightStack) {
            this.leftStack.position.set(this.app.screen.width / 2 - 80, this.app.screen.height / 2);
            this.rightStack.position.set(this.app.screen.width / 2 + 80, this.app.screen.height / 2);
        }
    }

    public destroy(): void {
        this.animationRunning = false;
        this.ticker?.stop();
        super.destroy();
    }
}