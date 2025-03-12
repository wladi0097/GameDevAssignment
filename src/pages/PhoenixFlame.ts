import {SubPageBase} from "../core/SubPageBase";
import {Container, ParticleContainer, Sprite} from "pixi.js";
import OwnAssets from "../configs/OwnAssets";

export class PhoenixFlame extends SubPageBase {
    private flameSprites: Sprite[] = [];
    private fireContainer: Container | null = null;
    private animationRunning: boolean = false;

    render(): void {
        this.createContainer();
        for (let i = 0; i < 10; i++) {
            this.addFlame();
        }


        this.app.ticker.add(() => {
            this.animate();
        });
        this.animationRunning = true;
    }

    private createContainer(): void {
        this.fireContainer = new ParticleContainer(10, {
            scale: true,
            position: true,
            rotation: true,
            uvs: true,
            alpha: true,
        });
        this.app.stage.addChild(this.fireContainer);
    }

    private addFlame(): void {
        const flame = Sprite.from(OwnAssets.flame);
        flame.anchor.set(0.5);
        flame.scale.set(0.5 + Math.random() * 0.5);
        flame.x = this.app.screen.width / 2;
        flame.y = this.app.screen.height;
        flame.alpha = 0.5 + Math.random() * 0.5;

        this.flameSprites.push(flame);
        this.fireContainer?.addChild(flame);
    }

    private animate(): void {
        if (!this.animationRunning) {return}
        this.flameSprites.forEach((flame: Sprite, index: number) => {
            flame.y -= 2 + Math.random() * 10;
            flame.x += (Math.random() - 0.5) * 8;
            flame.alpha -= 0.01;

            const tintPhase = Math.sin(Date.now() * 0.001 + index * 0.1) * 0.5 + 0.5;
            flame.tint = `#ff${Math.floor(0x66 * tintPhase).toString(16).padStart(2, '0')}00`; // orange tints

            flame.scale.x = flame.scale.y = 0.5 + Math.sin(Date.now() * 0.002 + index * 0.1) * 0.4;

            if (flame.alpha <= 0) {
                this.fireContainer?.removeChild(flame);
                this.flameSprites.splice(index, 1);
                this.addFlame();
            }
        });
    }

    destroy() {
        this.animationRunning = false;
        super.destroy();
        this.fireContainer?.destroy();
    }

    resize(): void {} // flames respawn all the time so no need
}