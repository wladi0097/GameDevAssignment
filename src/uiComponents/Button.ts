import {Graphics, Text, Container, TextStyleFill} from 'pixi.js';
import type {ColorSource} from "@pixi/core";

export class Button extends Container {
    private readonly background: Graphics;
    private readonly label: Text;

    constructor(label: string, width: number = 200, height: number = 50, buttonColor: ColorSource = "#fff", labelColor: TextStyleFill = "#000", fontSize: number = 20) {
        super();

        this.background = new Graphics()
            .beginFill(buttonColor)
            .drawRoundedRect(0, 0, width, height, 10)
            .endFill();
        this.addChild(this.background);

        this.label = new Text(label, {
            fill: labelColor,
            fontSize: fontSize,
        });
        this.label.anchor.set(0.5);
        this.label.position.set(width / 2, height / 2);
        this.addChild(this.label);

        this.eventMode = "dynamic";
        this.cursor = 'pointer';
    }

    public onClick(handler: () => void): void {
        this.on('pointerdown', handler);
    }
}