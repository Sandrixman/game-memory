import Phaser from 'phaser';

export default class Card extends Phaser.GameObjects.Sprite {
	constructor(scene, value) {
		super(scene, 'card');
		this.scene = scene;
		this.value = value;
		this.scene.add.existing(this);
		this.setInteractive();
		this.setTexture('card');
		this.opened = false;
		this.scaleX;
	}

	init(position) {
		this.position = position;
		this.setPosition(-this.width, -this.height);
		this.close();
	}

	move(params) {
		this.scene.tweens.add({
			targets: this,
			x: params.x,
			y: params.y,
			delay: params.delay,
			ease: 'Linear',
			duration: 200,
			onComplete: params.callback,
		});
	}

	flip() {
		this.scene.tweens.add({
			targets: this,
			scaleX: 0,
			ease: 'Linear',
			duration: 200,
			onComplete: () => this.show(),
		});
	}

	show() {
		const texture = this.opened ? 'card' + this.value : 'card';
		this.setTexture(texture);
		this.scene.tweens.add({
			targets: this,
			scaleX: 1,
			ease: 'Linear',
			duration: 200,
		});
	}

	open() {
		this.opened = true;
		this.flip();
	}

	close() {
		if (this.opened) {
			this.flip();
			this.opened = false;
		}
	}
}
