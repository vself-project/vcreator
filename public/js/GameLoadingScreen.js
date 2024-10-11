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
