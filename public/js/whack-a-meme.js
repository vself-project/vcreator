// Game Resolutions
// For 16:9 on landscape
// 128x72, 256x144, 384x216, 512x288, 640x360, 1280x720, 1920×1080

var gameConfig = {
    width: 360,
    height: 640,
    resolutionPosition: 'portrait', // 'landscape' or 'portrait',
    gameSettings: {
        lang: 'en',
        sound: true,
        music: true,
    },
    mainBackgroundColor: '#ffebcd',
};


// GameBoot
/* global MainGameContainer */
var MainGameContainer = {};

MainGameContainer.GameBoot = function (game) { };

MainGameContainer.GameBoot.prototype = {
    gameAssets: {
        images: [
            { name: 'preloaderBackground', src: './assets/img/preloadbck.png' },
            { name: 'preloaderBar', src: './assets/img/preloadbar.png' },
        ],
        sounds: [],
        music: [],
    },
    preload: function () {
        // load assets

        // load image assets
        var x = 0;
        var imagesn = this.gameAssets.images.length;

        for (x = 0; x < imagesn; x++) {
            this.load.image(
                this.gameAssets.images[x].name,
                this.gameAssets.images[x].src
            );
        }

        // load music assets
        var x = 0;
        var soundsn = this.gameAssets.music.length;
        for (x = 0; x < soundsn; x++) {
            this.load.audio(
                this.gameAssets.music[x].name,
                this.gameAssets.music[x].src
            );
        }

        // load sounds assets
        var x = 0;
        var soundsn = this.gameAssets.sounds.length;
        for (x = 0; x < soundsn; x++) {
            this.load.audio(
                this.gameAssets.sounds[x].name,
                this.gameAssets.sounds[x].src
            );
        }
    },
    create: function () {
        this.game.stage.backgroundColor = gameConfig.mainBackgroundColor;

        // start game and configure extra things

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;
        // this.scale.setShowAll();
        this.scale.refresh();

        this.state.start('GameLoadingScreen');
        // window.addEventListener('resize', this.resize(this.game));
        // this.resize(this.game);
    },
    resize: function (game) {
        var canvas = game.canvas;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var wratio = width / height;
        var ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
}

// GameLoadingScreen
/* global MainGameContainer */
MainGameContainer.GameLoadingScreen = function (game) { };

MainGameContainer.GameLoadingScreen.prototype = {
    // Game Objects or Groups
    preloadBar: undefined,
    bck: undefined,
    ready: false,
    // Game Assets
    gameAssets: {
        images: [
            { name: 'game_bg', src: './assets/img/camping.png' },
            { name: 'meme', src: './assets/img/itch.png' },
            { name: 'bomb', src: './assets/img/bee_s.png' },
            { name: 'cursor', src: './assets/img/hand.png' },
            { name: 'on', src: './assets/img/sound.png' },
            { name: 'off', src: './assets/img/soundoff.png' },
            { name: 'restartButton', src: './assets/img/restartButton.png' },
            { name: 'startButton', src: './assets/img/startButton.png' },
            { name: 'claimButton', src: './assets/img/claimButton.png' },
        ],
        sounds: [
            { name: 'confirm', src: './assets/sound/smack.mp3' },
            { name: 'error', src: './assets/sound/ouch.wav' },
            { name: 'loadsave', src: './assets/sound/loadsave.wav' },
        ],
        music: [
            { name: 'bgMusic', src: './assets/music/bgMusic.mp3' },
        ],
        spritesheets: [],
    },
    preload: function () {

        //Show the load bar
        this.bck = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBackground');
        this.bck.anchor.setTo(0.5, 0.5);
        this.bck.scale.setTo(1, 1);
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
        this.preloadBar.anchor.setTo(0, 0.5);
        this.preloadBar.scale.setTo(1, 1);
        this.preloadBar.x = this.world.centerX - this.preloadBar.width / 2;
        this.load.setPreloadSprite(this.preloadBar);


        //Start loading assets

        // load image assets
        var x = 0;
        var imagesn = this.gameAssets.images.length;
        for (x = 0; x < imagesn; x++) {
            this.game.load.image(
                this.gameAssets.images[x].name,
                this.gameAssets.images[x].src
            );
        }

        // load music assets
        var x = 0;
        var soundsn = this.gameAssets.music.length;
        for (x = 0; x < soundsn; x++) {
            this.game.load.audio(
                this.gameAssets.music[x].name,
                this.gameAssets.music[x].src
            );
        }

        // load sounds assets
        var x = 0;
        var soundsn = this.gameAssets.sounds.length;
        for (x = 0; x < soundsn; x++) {
            this.game.load.audio(
                this.gameAssets.sounds[x].name,
                this.gameAssets.sounds[x].src
            );
        }

        // load sprite sheets
        var x = 0;
        var spritesheetsn = this.gameAssets.spritesheets.length;
        for (x = 0; x < spritesheetsn; x++) {
            this.load.spritesheet(
                this.gameAssets.spritesheets[x].name,
                this.gameAssets.spritesheets[x].src,
                this.gameAssets.spritesheets[x].w,
                this.gameAssets.spritesheets[x].h,
                this.gameAssets.spritesheets[x].frameMax,
                this.gameAssets.spritesheets[x].m,
                this.gameAssets.spritesheets[x].s,
            );
        }
    },


    create: function () {
        this.preloadBar.cropEnabled = false;
    },

    update: function () {
        if (this.ready == false) {
            this.ready = true;
            this.state.start('GamePlay');
        }
    }

};

// GamePlay
/* global MainGameContainer */
MainGameContainer.GamePlay = function (game) { };

MainGameContainer.GamePlay.prototype = {
    // Game Objects or Groups
    bgMusic: undefined,
    buttons: {
        cursors: undefined,
        startButton: undefined,
        restartButton: undefined,
        claimButton: undefined,
        onOff: undefined
    },
    ui: {
        timeLabel: undefined,
        scoreLabel: undefined,
        livesLabel: undefined,
        finalScore: undefined,
    },
    sounds: {
        coin: undefined,
    },
    events: {
        // throwItems: undefined,
    },
    gameState: 'preparing',
    soundOn: Boolean,
    mainMenuBackground: undefined,
    timer: undefined,
    timeCount: 30,
    livesCount: 3,
    scoreCount: 0,
    gameLevel: 0,
    enemies: undefined,
    holes: [
        { x: 80, y: 96 },
        { x: 144, y: 192 },
        { x: 240, y: 96 },
        { x: 80, y: 288 },
        { x: 172, y: 384 },
        { x: 240, y: 288 },
        { x: 80, y: 480 },
        { x: 144, y: 576 },
        { x: 240, y: 480 },
    ],
    holes2: [
        { x: 64, y: 96 },
        { x: 128, y: 192 },
        { x: 224, y: 96 },
        { x: 64, y: 288 },
        { x: 160, y: 384 },
        { x: 224, y: 288 },
        { x: 64, y: 480 },
        { x: 128, y: 576 },
        { x: 224, y: 480 },
    ],
    xMargin: 20,
    yMargin: -16,
    preload: function () { },
    shutdown: function () {
        this.game.world.removeAll();
        // reset everything
        // this.resetAll();
    },
    create: function () {
        this.game.time.advancedTiming = true;

        // set game world size
        this.game.world.setBounds(0, 0, 360, 640);

        // BG image
        this.mainMenuBackground = this.add.sprite(this.xMargin, 0, 'game_bg');

        // init sounds
        this.initSounds();

        // init ui
        this.addUIElements();

        // set lives
        this.livesCount = 3;

        // start body Groups
        this.enemies = this.game.add.group();

        // start button
        var style = {
            font: '22px Arial',
            fill: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
        };
        this.buttons.startButton = this.game.add.button(this.game.world.centerX - 85, this.game.world.centerY, 'startButton', this.startGame, this, 2, 1, 0);
    },
    update: function () {
        this.updateUI();
        var self = this;

        if (self.gameState === 'playing') {
            this.enemies.forEach(function (enemy) {
                if (enemy.input.pointerOver()
                    && (self.game.input.activePointer.leftButton.isDown || self.game.input.pointer1.isDown)
                    && self.gameState === 'playing') {
                    if (enemy.type === 'bomb') {
                        if (self.soundOn) {
                            self.sounds.hit.play();
                        }
                        self.scoreCount -= 200;
                        // self.livesCount = 0;
                        enemy.destroy();
                        // self.gameState = 'gameOver';
                        // self.gameOverState();
                    } else {
                        self.enemyDestroy(enemy);
                    }
                }
            });
        }
    },
    initSounds() {
        this.sounds.coin = this.game.add.audio('coin');
        this.sounds.smash = this.game.add.audio('confirm');
        this.sounds.hit = this.game.add.audio('error');
        this.sounds.mushrom = this.game.add.audio('loadsave');
    },
    startGame() {
        this.buttons.startButton.destroy();
        this.gameState = 'playing';

        // game music
        this.bgMusic = this.game.add.audio('bgMusic');
        this.bgMusic.volume = 0.2;
        this.bgMusic.loop = true;
        this.bgMusic.play();
        this.soundOn = true;
        this.buttons.onOff = this.game.add.button(300, 5, 'on', this.onOff, this, 2, 1, 0);
        this.buttons.onOff.width = 20;
        this.buttons.onOff.height = 20;



        var self = this;


        this.timer = self.game.time.events.loop(Phaser.Timer.SECOND, function () {
            if ((self.timeCount == 0) && (self.gameState === 'playing')) {
                self.gameState = 'gameOver';
                self.gameOverState();
            } else {
                self.timeCount -= 1;
            }
        }, self);

        this.events.throwItems = self.game.time.events.loop(Phaser.Timer.SECOND * 2.5, function () {
            if (self.gameState === 'playing') {
                self.showEnemies();
            }
        }, self);

        self.showEnemies();
    },
    onOff() {
        if (this.soundOn) {
            this.bgMusic.stop();
            // this.buttons.onOff.destroy()
            this.buttons.onOff.loadTexture('off');
            this.soundOn = false;
            // this.buttons.onOff = this.game.add.button(200, 5, 'off', this.onOff, this, 2, 1, 0);
        } else {
            this.bgMusic.play();
            this.soundOn = true;
            this.buttons.onOff.loadTexture('on');

        }
    },
    showEnemies() {
        this.gameLevel += 1;
        var totalEnemies = 0;

        if (this.gameLevel >= 1 && this.gameLevel <= 3) {
            totalEnemies = 1;
        } else if (this.gameLevel >= 4 && this.gameLevel <= 6) {
            totalEnemies = 2;
        } else if (this.gameLevel >= 7 && this.gameLevel <= 9) {
            totalEnemies = 3;
        } else if (this.gameLevel >= 10 && this.gameLevel <= 13) {
            totalEnemies = 4;
        } else {
            totalEnemies = 5;
        }

        var self = this;
        var openSpaces = JSON.parse(JSON.stringify(this.holes));

        for (var x = 0; x < totalEnemies; x++) {
            var position = Math.floor((Math.random() * openSpaces.length));
            var openSpace = openSpaces[position];
            openSpaces.splice(position, 1);
            self.createEnemy(openSpace.x, openSpace.y);
        }
    },
    createEnemy(xPos, yPos) {
        var randomNumber = Math.floor((Math.random() * 100));
        var spriteType = '';
        if (randomNumber >= '80') {
            spriteType = 'bomb';
        } else {
            spriteType = 'meme';
        }

        var sprite = this.enemies.create(xPos + this.xMargin, yPos + this.yMargin, spriteType);
        sprite.type = spriteType;
        sprite.state = 'spawing';
        sprite.inputEnabled = true;
        sprite.anchor.setTo(0.5, 0.5);
        sprite.alpha = 0;

        var tweenA = this.game.add.tween(sprite).to({ alpha: 1 }, 1000, 'Linear');
        var tweenB = this.game.add.tween(sprite).to({ alpha: 0.10 }, 1000, 'Linear');
        setTimeout(function () {
            sprite.destroy();
        }, 2500);
        tweenA.chain(tweenB);
        tweenA.start();

        return sprite;
    },
    enemyDestroy(enemy) {
        if (this.soundOn) {
            this.sounds.smash.play();
        }
        this.scoreCount += 100;
        enemy.destroy();
    },
    addUIElements() {
        // set text label style
        var style = {
            font: '16px Arial',
            fill: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
        };

        // add labels/texts
        this.ui.scoreLabel = this.game.add.text(50, 5, 'Score: ' + this.scoreCount, style);
        this.ui.scoreLabel.fixedToCamera = true;
        this.ui.timeLabel = this.game.add.text(50, 21, 'Time left: ' + this.timeCount, style);
        this.ui.timeLabel.fixedToCamera = true;
    },
    updateUI() {
        this.ui.scoreLabel.setText('Score: ' + this.scoreCount);
        this.ui.timeLabel.setText('Time Left: ' + this.timeCount);
    },
    gameOverState() {
        window.console.log('gameOverState');
        // console.log(this.buttons.restartButton);
        var style = {
            font: '22px Arial',
            fill: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2,
        };
        this.ui.finalScore = this.game.add.text(this.game.world.centerX - 70 - (this.scoreCount.toString().length), this.game.world.centerY - 64, 'Game Over\nFinal Score:' + this.scoreCount, style);
        this.buttons.restartButton = this.game.add.button(this.game.world.centerX - 90, this.game.world.centerY, 'restartButton', this.restartGame, this, 2, 1, 0);
        this.buttons.claimButton = this.game.add.button(this.game.world.centerX - 90, this.game.world.centerY + 60, 'claimButton', this.claimReward, this, 2, 1, 0);

        this.bgMusic.stop();
        this.game.time.events.remove(this.events.drawSlash);
        this.game.time.events.remove(this.events.throwItems);
        this.game.time.events.remove(this.timer);

        this.enemies.removeAll();
    },
    claimReward() {
        console.log('claimReward');
        // this.buttons.restartButton.destroy();
        // this.buttons.claimButton.destroy();
        // this.ui.finalScore.visible = false;
        // // console.log(this.buttons.restartButton);

        const score = this.scoreCount;
        // // this.game.physics.arcade.isPaused = false;
        // // this.bgMusic.play();
        this.livesCount = 3;
        this.timeCount = 30;
        this.scoreCount = 0;
        this.gameLevel = 0;
        // this.gameState = 'playing';  

        window.endgame(score);
    },
    restartGame() {
        this.buttons.restartButton.destroy();
        this.buttons.claimButton.destroy();
        this.ui.finalScore.visible = false;
        // console.log(this.buttons.restartButton);

        this.game.physics.arcade.isPaused = false;
        this.bgMusic.play();
        this.livesCount = 3;
        this.timeCount = 30;
        this.scoreCount = 0;
        this.gameLevel = 0;
        this.gameState = 'playing';

        const self = this;

        this.timer = self.game.time.events.loop(Phaser.Timer.SECOND, function () {
            if ((self.timeCount == 0) && (self.gameState === 'playing')) {
                self.gameState = 'gameOver';
                self.gameOverState();
            } else {
                self.timeCount -= 1;
            }
        }, self);
        this.events.throwItems = self.game.time.events.loop(Phaser.Timer.SECOND * 2, function () {
            if (self.gameState === 'playing') {
                self.showEnemies();
            }
        }, self);

        self.showEnemies();
    },
    // render() {
    //   this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
    //   var self = this;
    //   // this.enemies.forEach(function (item) {
    //     // self.game.debug.body(item);
    //   // });

    // },
};

