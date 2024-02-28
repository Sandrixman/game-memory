import Phaser from 'phaser';

export default class Card extends Phaser.GameObjects.Sprite {
	constructor(scene, value) {
		super(scene, 'card');
		this.scene = scene;
		this.value = value;
		this.setOrigin(0, 0);
		this.scene.add.existing(this);
		this.setInteractive();
		this.opened = false;
	}

	open() {
		this.setTexture('card' + this.value);
		this.opened = true;
	}

	close() {
		this.setTexture('card');
		this.opened = false;
	}
}
