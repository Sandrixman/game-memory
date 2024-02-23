import './sass/main.scss';
import GameScene from './js/GameScene';
import Phaser from 'phaser';

const config = {
	type: Phaser.AUTO,
	width: 2560,
	height: 1600,
	rows: 2,
	cols: 5,
};

let game = new Phaser.Game({
	...config,
	scene: new GameScene(config),
});
