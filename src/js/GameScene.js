import Card from './Card';

export default class GameScene extends Phaser.Scene {
	constructor(config) {
		super('Game');
		this.gameConfig = config;
	}
	preload() {
		this.load.image('bg', 'assets/image/bg-galaxy.jpg');
		this.load.image('card', 'assets/image/card.png');
		this.load.image('card1', 'assets/image/card1.png');
		this.load.image('card2', 'assets/image/card2.jpg');
		this.load.image('card3', 'assets/image/card3.jpg');
		this.load.image('card4', 'assets/image/card4.jpg');
		this.load.image('card5', 'assets/image/card5.jpg');
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

		return Phaser.Utils.Array.Shuffle(positions);
	}

	createCard() {
		this.cards = [];

		for (let value of this.gameConfig.cards) {
			for (let i = 0; i < 2; i++) {
				this.cards.push(new Card(this, value));
			}
		}

		this.input.on('gameobjectdown', this.onCardClicked, this);
	}

	create() {
		this.createBackground();
		this.createCard();
		this.start();
	}

	start() {
		this.openedCard = null;
		this.openedCardCount = 0;
		this.initCards();
	}

	initCards() {
		const positions = this.getCardPosition();

		this.cards.forEach(card => {
			const position = positions.pop();
			card.close();
			card.setPosition(position.x, position.y);
		});
	}

	onCardClicked(pointer, card) {
		if (card.opened) {
			return;
		}

		card.open();

		if (this.openedCard) {
			if (this.openedCard.value === card.value) {
				this.openedCard = null;
				++this.openedCardCount;
			} else {
				this.openedCard.close();
				this.openedCard = card;
			}
		} else {
			this.openedCard = card;
		}

		if (this.openedCardCount === this.cards.length / 2) {
			this.start();
		}
	}
}
