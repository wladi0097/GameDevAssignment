import {SubPageBase} from "../core/SubPageBase";
import MagicWoredsMock from "../mocks/MagicWordsMock"
import {Assets, Graphics, Sprite, Text} from "pixi.js";
import {Button} from "../uiComponents/Button";

type ConversationDefinition = {
    dialogue: {name: string, text: string}[],
    emojies: {name: string, url: string}[],
    avatars: {name: string, url: string, position: 'left' | 'right'}[]
}


export class MagicWords extends SubPageBase {
    private conversationResult: ConversationDefinition = {dialogue: [], emojies: [], avatars: []}
    private nextButton: Button | null = null;
    private previousButton: Button | null = null;
    private speechBubble: Graphics | null = null;
    private speechText: Text | null = null;
    private avatar: Sprite | null = null;
    private speechAlignLeft: boolean = true;
    private currentConversationIndex: number = 0;

    render(): void {
        this.renderSpeechBubble('Loading...');

        this.fetchConversation()
            .then(() => this.fetchAssets)
            .then(() => this.startConversation(0))
            .then(() => this.renderButtons())
            .then(() => this.resize())
    }

    resize(): void {
        this.nextButton?.position.set(this.app.screen.width - 210, this.app.screen.height / 2 + 160);
        this.previousButton?.position.set(10, this.app.screen.height / 2 + 160);

        const avatarWidth = this.app.screen.width * 0.2;
        this.avatar?.position.set(this.speechAlignLeft ? avatarWidth / 2 : this.app.screen.width - avatarWidth / 2, this.app.screen.height / 2);

        if (this.speechBubble && this.speechText) {
            this.speechBubble.clear()
            this.speechBubble.beginFill('#fff');
            this.speechBubble.lineStyle(2, 0x000000);
            this.speechBubble.position.set(this.speechAlignLeft ? avatarWidth + 20 : 20, this.app.screen.height / 2 - 100);
            this.speechBubble.drawRoundedRect(0, 0, this.app.screen.width - avatarWidth - 40, 200, 10);
            this.speechText.style.wordWrapWidth = this.app.screen.width - avatarWidth - 60;
        }
    }

    private async fetchConversation(): Promise<void> {
        return new Promise(resolve => {
            this.conversationResult = MagicWoredsMock as ConversationDefinition;
            resolve();
        });
    }

    private async fetchAssets(): Promise<void> {
        const avatars: string[] = this.conversationResult.avatars.map(item => item.url);
        const emojis: string[] = this.conversationResult.emojies.map(item => item.url);
        return Assets.load([...avatars, ...emojis]).then()
    }

    private startConversation(fromIndex: number = 0): void {
        const dialogue = this.conversationResult.dialogue[fromIndex]
        const avatar = this.conversationResult.avatars.find(a => a.name === dialogue.name);
        if (!avatar) {return}

        this.speechAlignLeft = avatar.position === 'left';

        if (this.speechText) {
            this.speechText.text = dialogue.text
        }

        this.renderAvatar(avatar.url)
        this.resize()
    }

    private renderButtons(): void {
        this.nextButton = new Button("Next");
        this.container.addChild(this.nextButton);
        this.nextButton.onClick(() => this.nextDialog())

        this.previousButton = new Button("Previous");
        this.previousButton.visible = false;
        this.previousButton.onClick(() => this.previousDialog())
        this.container.addChild(this.previousButton);
    }

    private nextDialog(): void {
        if (!this.previousButton || !this.nextButton) {return}
        this.currentConversationIndex += 1

        this.previousButton.visible = true;
        if (this.currentConversationIndex == this.conversationResult.dialogue.length - 1) {
            this.nextButton.visible = false;
        }
        this.startConversation(this.currentConversationIndex)
    }

    private previousDialog(): void {
        if (!this.previousButton || !this.nextButton) {return}
        this.currentConversationIndex -= 1

        this.nextButton.visible = true;
        if (this.currentConversationIndex == 0) {
            this.previousButton.visible = false;
        }
        this.startConversation(this.currentConversationIndex)
    }

    private renderAvatar(url: string): void {
        if (this.avatar) {
            this.avatar.destroy();
            this.avatar = null;
        }

        const avatar = Sprite.from(url);
        avatar.anchor.set(0.5);

        this.container.addChild(avatar);
        this.avatar = avatar;
    }

    private renderSpeechBubble(text: string): void {
        const speechBubble = new Graphics();
        this.container.addChild(speechBubble);

        const speechText = new Text(text, {
            fill: '#000',
            fontSize: 20,
            wordWrap: true,
        });
        speechText.position.set(10, 10);
        speechBubble.addChild(speechText);

        this.speechBubble = speechBubble;
        this.speechText = speechText;
    }
}