import './sass/main.scss';
import Phaser from 'phaser';

const scene = new Phaser.Scene('Game');

scene.preload = function () {
	this.load.image('bg', 'src/assets/image/bg-stars.jpg');
};

scene.create = function () {
	this.add.sprite(0, 0, 'bg');
};

const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	scene,
};

const game = new Phaser.Game(config);
