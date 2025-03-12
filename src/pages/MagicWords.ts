import {SubPageBase} from "../core/SubPageBase";
import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import {Button} from "../uiComponents/Button";

type ConversationDefinition = {
    dialogue: {name: string, text: string}[],
    emojies: {name: string, url: string}[],
    avatars: {name: string, url: string, position: 'left' | 'right'}[]
}

export class MagicWords extends SubPageBase {
    private apiURL: string = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';
    private conversationResult: ConversationDefinition = {dialogue: [], emojies: [], avatars: []};
    private nextButton: Button | null = null;
    private previousButton: Button | null = null;
    private speechBubble: Graphics | null = null;
    private speechText: Text | null = null;
    private avatar: Sprite | null = null;
    private speechAlignLeft: boolean = true;
    private currentConversationIndex: number = 0;

    render(): void {
        this.renderSpeechBubble();
        this.renderTextWithEmoji('Loading ...');

        this.fetchConversation()
            .then(() => this.fetchAssets)
            .then(() => {
                this.startConversation(0)
                this.renderButtons()
                this.resize()
            });
    }

    resize(): void {
        this.nextButton?.position.set(this.app.screen.width - 210, this.app.screen.height / 2 + 160);
        this.previousButton?.position.set(10, this.app.screen.height / 2 + 160);

        const avatarWidth = this.app.screen.width * 0.2;
        this.avatar?.position.set(this.speechAlignLeft ? avatarWidth / 2 : this.app.screen.width - avatarWidth / 2, this.app.screen.height / 2);

        if (this.speechBubble) {
            this.speechBubble.clear();
            this.speechBubble.beginFill('#fff');
            this.speechBubble.lineStyle(2, 0x000000);
            this.speechBubble.position.set(this.speechAlignLeft ? avatarWidth + 20 : 20, this.app.screen.height / 2 - 100);
            this.speechBubble.drawRoundedRect(0, 0, this.app.screen.width - avatarWidth - 40, 200, 10);
        }
    }

    private async fetchConversation(): Promise<void> {
        return fetch(this.apiURL)
            .then(res => res.json())
            .then(data => {
                this.conversationResult = data;
            });
    }

    private async fetchAssets(): Promise<void> {
        const avatars: string[] = this.conversationResult.avatars.map(item => item.url);
        const emojis: string[] = this.conversationResult.emojies.map(item => item.url);
        return Assets.load([...avatars, ...emojis]).then();
    }

    private startConversation(fromIndex: number = 0): void {
        const dialogue = this.conversationResult.dialogue[fromIndex];
        const avatar = this.conversationResult.avatars.find(a => a.name === dialogue.name);
        if (!avatar) {return}

        this.speechAlignLeft = avatar.position === 'left';

        this.renderAvatar(avatar.url);
        this.renderTextWithEmoji(dialogue.text);
        this.resize();
    }

    private renderButtons(): void {
        this.nextButton = new Button("Next");
        this.container.addChild(this.nextButton);
        this.nextButton.onClick(() => this.nextDialog());

        this.previousButton = new Button("Previous");
        this.previousButton.visible = false;
        this.previousButton.onClick(() => this.previousDialog())
        this.container.addChild(this.previousButton);
    }

    private nextDialog(): void {
        if (!this.previousButton || !this.nextButton) {return}
        this.currentConversationIndex += 1;

        this.previousButton.visible = true;
        if (this.currentConversationIndex == this.conversationResult.dialogue.length - 1) {
            this.nextButton.visible = false;
        }
        this.startConversation(this.currentConversationIndex);
    }

    private previousDialog(): void {
        if (!this.previousButton || !this.nextButton) {return}
        this.currentConversationIndex -= 1;

        this.nextButton.visible = true;
        if (this.currentConversationIndex == 0) {
            this.previousButton.visible = false;
        }
        this.startConversation(this.currentConversationIndex);
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

    private renderSpeechBubble(): void {
        const speechBubble = new Graphics();
        this.container.addChild(speechBubble);

        this.speechBubble = speechBubble;
    }

    private renderTextWithEmoji(text: string): void {
        this.speechText?.destroy();
        this.speechBubble?.removeChildren();

        const container = new Container();
        let currentX = 0;
        const emojiSize = 24;

        const parts = text.split(/(\{.*?\})/g);

        for (const part of parts) {
            if (part.startsWith('{') && part.endsWith('}')) {
                const emojiName = part.slice(1, -1);
                const emoji = this.conversationResult.emojies.find(e => e.name === emojiName);

                if (emoji) {
                    const sprite = Sprite.from(emoji.url);
                    sprite.width = emojiSize;
                    sprite.height = emojiSize;
                    sprite.position.set(currentX, 0);

                    container.addChild(sprite);
                    currentX += emojiSize + 4;
                }
            } else {
                const textPart = new Text(part, {
                    fill: '#000',
                    fontSize: 20,
                    wordWrap: true,
                    wordWrapWidth: this.app.screen.width * 0.6,
                });
                textPart.position.set(currentX, 0);

                container.addChild(textPart);
                currentX += textPart.width;
            }
        }

        container.position.set(10, 10);
        this.speechBubble?.addChild(container);
    }
}