import Card from './Card';

export default class GameScene extends Phaser.Scene {
	constructor(config) {
		super('Game');
		this.gameConfig = config;
		this.timeout = this.gameConfig.timeout;
	}

	preload() {
		this.load.image('bg', 'assets/image/bg-galaxy.jpg');
		this.load.image('card', 'assets/image/card.png');
		for (let i = 1; i <= this.gameConfig.cards.length; i++) {
			this.load.image('card' + i, 'assets/image/card' + i + '.jpg');
		}

		this.load.audio('card', 'assets/sounds/card.mp3');
		this.load.audio('complete', 'assets/sounds/complete.mp3');
		this.load.audio('success', 'assets/sounds/success.mp3');
		this.load.audio('theme', 'assets/sounds/theme.mp3');
		this.load.audio('timeout', 'assets/sounds/timeout.mp3');
	}

	createBackground() {
		this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
	}

	createSounds() {
		this.sounds = {
			card: this.sound.add('card'),
			complete: this.sound.add('complete'),
			success: this.sound.add('success'),
			theme: this.sound.add('theme', { volume: 0.1 }),
			timeout: this.sound.add('timeout'),
		};
	}

	createGreetingText() {
		this.greetingText = this.add.text(this.gameConfig.width / 2, 150, 'Play', {
			font: '72px KodeMomo',
			fill: 'white',
		});
	}

	createTimerText() {
		this.timerText = this.add.text(this.gameConfig.width / 2, 150, '', {
			font: '72px KodeMomo',
			fill: 'white',
		});
	}

	initCardPosition() {
		const positions = [];
		const cardTexture = this.textures.get('card').getSourceImage();
		const cardWidth = cardTexture.width + 20;
		const cardHeight = cardTexture.height + 20;
		const offsetX =
			(this.sys.game.config.width - cardWidth * this.gameConfig.cols) / 2 + cardWidth / 2;
		const offsetY =
			(this.sys.game.config.height - cardHeight * this.gameConfig.rows) / 2 + cardHeight / 2;

		let cardDelay = 0;
		for (let row = 0; row < this.gameConfig.rows; row++) {
			for (let col = 0; col < this.gameConfig.cols; col++) {
				positions.push({
					x: offsetX + col * cardWidth,
					y: offsetY + row * cardHeight,
					delay: ++cardDelay * 100,
				});
			}
		}

		this.positions = positions;
	}

	initCards() {
		const positions = Phaser.Utils.Array.Shuffle(this.positions);

		this.cards.forEach(card => {
			card.init(positions.pop());
		});
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

	showCards() {
		this.cards.forEach(card => {
			card.depth = card.position.delay;
			card.move({
				x: card.position.x,
				y: card.position.y,
				delay: card.position.delay,
			});
		});
	}

	createTimer() {
		this.timer = this.time.addEvent({
			delay: 1000,
			loop: true,
			callbackScope: this,
			callback: this.onTimer,
		});
	}

	onTimer() {
		this.timerText.setText('Timer: ' + this.timeout);
		if (this.timeout <= 0) {
			this.timer.paused = true;
			this.sounds.timeout.play();
			this.restart();
		}
		--this.timeout;
	}

	start() {
		this.openedCard = null;
		this.openedCardCount = 0;
		this.initCardPosition();
		this.timeout = this.gameConfig.timeout;
		this.timer.paused = false;
		this.initCards();
		this.showCards();
		this.sounds.theme.play();
	}

	restart() {
		let count = 0;
		let onCardMoveComplete = () => {
			++count;
			if (count >= this.cards.length) {
				this.start();
			}
		};

		this.cards.forEach(card => {
			card.move({
				x: this.sys.game.config.width + card.width,
				y: this.sys.game.config.height + card.height,
				delay: card.position.delay,
				callback: onCardMoveComplete,
			});
		});
	}

	create() {
		this.createBackground();
		this.createSounds();
		// this.createGreetingText();
		this.createTimerText();
		this.createCard();
		this.createTimer();
		this.start();
	}

	onCardClicked(pointer, card) {
		this.sounds.card.play();
		if (card.opened) {
			return;
		}

		card.open();

		if (this.openedCard) {
			if (this.openedCard.value === card.value) {
				this.sounds.success.play();
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
			this.timer.paused = true;
			this.restart();
			this.sounds.complete.play();
		}
	}
}
