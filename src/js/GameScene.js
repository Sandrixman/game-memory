import { Scene } from 'phaser';
import Card from './Card';

export default class GameScene extends Scene {
	constructor(config) {
		super('Game');
		this.gameConfig = config;
	}
	preload() {
		this.load.image('bg', 'assets/image/bg-galaxy.jpg');
		this.load.image('card', 'assets/image/card.png');
	}

	create() {
		this.createBackground();
		this.createCard();
	}

	createCard() {
		this.card = [];
		const positions = this.getCardPosition();

		for (let position of positions) {
			this.card.push(new Card(this, position));
		}
	}

	createBackground() {
		this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
	}

	getCardPosition() {
		const positions = [];
		const cardTexture = this.textures.get('card').getSourceImage();
		const cardWidth = cardTexture.width + 20;
		const cardHeight = cardTexture.height + 20;
		const offsetX = (this.sys.game.config.width - cardWidth * this.gameConfig.cols) / 2;
		const offsetY = (this.sys.game.config.height - cardHeight * this.gameConfig.rows) / 2;
		for (let row = 0; row < this.gameConfig.rows; row++) {
			for (let col = 0; col < this.gameConfig.cols; col++) {
				positions.push({
					x: offsetX + col * cardWidth,
					y: offsetY + row * cardHeight,
				});
			}
		}

		return positions;
	}
}
