const config = {
	type: Phaser.AUTO,
	width: 2560,
	height: 1600,
	cards: [1, 2, 3, 4, 5],
	rows: 2,
	cols: 5,
	timeout: 60,
};

let game = new Phaser.Game({
	...config,
	scene: new GameScene(config),
});
