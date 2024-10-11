import './style.css';
import Phaser from 'phaser';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { address } from 'ton-core';
import WebApp from "@twa-dev/sdk";

//Defining scene size
const sizes = {
    width: 1080 / 2,
    height: 1920 / 2,
};
const percent_target = 0.15;
const totalTime = 30000;

// Initial speed of the falling items
const speedDown = 200;
const speedIncrease = 20;
const speedMiss = 15;
const speedHit = 5;

const gameStartDiv = document.querySelector('#gameStartDiv');
const gameStartBtn = document.querySelector('#gameStartBtn');
const gameEndDiv = document.querySelector('#gameEndDiv');
const gameWinLoseSpan = document.querySelector('#gameWinLoseSpan');
const gameEndScoreSpan = document.querySelector('#gameEndScoreSpan');
const mintButton = document.querySelector('#gameClaim');
const scoreMessageHeader = document.querySelector('#scoreMessage');
const successMessageHeader = document.querySelector('#successMessage');

window.getConfiguration = function () {
    console.log('Hello 1');
    const params = window.location.search;
    //console.log(params);

    const encodedPayload = params.substring('?tgWebAppStartParam='.length);
    // console.log( encodedPayload );
    const decodedPayload = decodeURIComponent(encodedPayload);
    // console.log( decodedPayload );
    const payload = atob(decodedPayload);
    console.log(payload);
    //const config = JSON.parse(payload); // TODO uncomment

    //return config; // TODO uncomment
    return {
        logo_url: '/assets/1.png',
        prize_meta: 'https://vself-bot-642c4.firebaseapp.com/assets/1.png',
    };
}

//Preload Scene
class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Obtain game configuration
        const config = window.getConfiguration();
        console.log('config', config);

        //Load all assets here
        this.load.image('bg', '/assets/back.png');
        this.load.image('bs', '/assets/backet.png');
        this.load.image('fal1', config.logo_url || '/assets/1.png'); //
        this.load.image('fal2', '/assets/2.png');
        this.load.image('fal3', '/assets/3.png');
        this.load.image('fal4', '/assets/4.png');
        this.load.image('n1', '/assets/n1.png');
        this.load.image('n2', '/assets/n2.png');
        this.load.image('n3', '/assets/n3.png');
        this.load.image('n4', '/assets/n4.png');
        this.load.image('n5', '/assets/n5.png');
        this.load.image('n6', '/assets/n6.png');
        this.load.image('n7', '/assets/n7.png');

        this.load.audio('coin', '/assets/coin.mp3');
        this.load.audio('bgM', '/assets/red.mp3');
        this.load.image('star', '/assets/star.png');
        this.load.image('on', '/assets/sound.png');
        this.load.image('off', '/assets/soundoff.png');


        // Example of adding a loader image or text
        this.load.on('progress', (value) => {
            //console.log(value); // Log loading progress
            this.loadingText.setText(`Loading: ${Math.round(value * 100)}%`);
            const gBtn = window.document.getElementById('gameStartBtn');
            if (value < 1.0) {
                gBtn.textContent = `Loading: ${Math.round(value * 100)}%`;
            } else {
                gBtn.textContent = 'Start';
            }
        });

        // Make sure you've defined this.loadingText in this scene
        this.loadingText = this.add
            .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', { fontSize: '20px', fill: '#FFFFFF' })
            .setOrigin(0.5);
    }

    create() {
        // Transition to the main game scene once assets are loaded
        gameStartBtn.addEventListener('click', startGame);
        // gameStartBtn.addEventListener('click', gameOver);
        gameStartBtn.addEventListener('touchstart', startGame);
        // gameStartBtn.addEventListener('touchstart', gameOver);
        mintButton.addEventListener('click', mintNFT);

        this.scene.start('scene-game');
    }
}

//Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super('scene-game'); // scene id
        this.player;
        this.cursor; // controller input
        this.targets = [];
        this.maxTargets = 30; // Maximum number of targets on screen at once
        this.targetSpawnTime = 2000; // Time between target spawns in milliseconds
        this.points = 0; //score
        this.playerSpeed = speedDown + 50;
        this.fallSpeed = speedDown;
        this.textScore;
        this.textTime;
        this.timedEvent;
        this.remainingTime;
        this.coinMusic;
        this.bgMusic;
        this.emitter;
        this.prizetype;
        this.pointer;
        this.backgroundWidth;
        this.soundOn = true;
        this.soundButton;
        this.correctTagret = true;  // TODO remove
        this.correctTagrets = [];
        this.rightImages = ['fal1', 'fal2', 'fal3', 'fal4'];
        this.wrongImages = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];
        this.allImages = ['fal1', 'fal2', 'fal3', 'fal4', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'];
    }

    playBackgroundMusic() {
        if (this.soundOn) {
            this.bgMusic.play();
        }
    }

    //set up of the game objects once the game starts
    create() {
        gameStartBtn.addEventListener('click', startGame);
        gameStartBtn.addEventListener('touchstart', startGame);

        this.scene.pause('scene-game');

        //Device detection
        const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || !this.sys.game.device.os.desktop;
        const isDesk = this.sys.game.device.os.desktop;
        console.log('Mobile/Desk:', isMobile, isDesk);

        // Set background width based on device type
        this.backgroundWidth = isMobile ? this.sys.game.config.width : sizes.width;
        console.log('Background Width:', this.backgroundWidth);

        //background image and position
        let bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);

        // Scale the background image to fit the width of the game scene
        const bgScaleX = this.backgroundWidth / bg.width;
        const bgScaleY = this.cameras.main.height / bg.height;
        const bgScale = Math.min(bgScaleX, bgScaleY); // Use Math.min to fit the image entirely without cropping
        bg.setScale(bgScale).setScrollFactor(0);

        // Add the sound toggle button
        const initialImageKey = this.soundOn ? 'on' : 'off';
        this.soundToggleButton = this.add.image(40, 50, initialImageKey).setScale(0.03).setInteractive();
        this.soundToggleButton.setScrollFactor(0); // Make sure it stays in place when camera moves

        // Handle click/touch events on the sound toggle button
        this.soundToggleButton.on('pointerdown', this.toggleSound, this);


        //Music setup
        this.coinMusic = this.sound.add('coin');
        this.bgMusic = this.sound.add('bgM', { loop: true });


        // Desired width for the targets and basket
        const desiredTargetWidth = this.backgroundWidth * percent_target;
        const desiredBasketWidth = desiredTargetWidth * 1.1;


        // Player (basket) setup
        const basketFrame = this.textures.getFrame('bs');
        const basketScale = desiredBasketWidth / basketFrame.width;

        this.player = this.physics.add
            .image(0, sizes.height - 120, 'bs')
            .setOrigin(0, 0)
            .setScale(basketScale);
        console.log('Player width after scaling:', this.player.displayWidth);
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);


        //adjust player collision body for more precise collisions
        this.player
            .setSize(this.player.width - this.player.width / 4, this.player.height - this.player.height / 2)
            .setOffset(this.player.width / 10, this.player.height - this.player.height / 2);

        // Set up timer for spawning targets
        // TODO start first falling without delay
        this.time.addEvent({
            delay: this.targetSpawnTime,
            callback: this.spawnTarget,
            callbackScope: this,
            loop: true
        });

        //Detecting collision
        // TODO check this part
        //this.physics.add.overlap(this.targets, this.player, this.targetHit, null, this);

        //Setting up device type and controller
        if (isMobile) {
            console.log('Mobile device initialized');
            this.player.setInteractive({ draggable: true });
        } else if (isDesk) {
            console.log('Desk initialized');
            this.cursor = this.input.keyboard.createCursorKeys();
            console.log(this.cursor);
        }

        //score and timer
        this.textScore = this.add.text(sizes.width - 120, 10, 'Points:0', {
            font: '20px Arial',
            fill: '#B5FFEB',
        });
        this.textTime = this.add.text(10, 10, 'Time left: 00 sec', {
            font: '20px Arial',
            fill: '#B5FFEB',
        });

        //set up max time
        this.timedEvent = this.time.delayedCall(totalTime, this.gameOver, [], this);

        this.emitter = this.add.particles(0, 0, 'star', {
            speed: { min: -100, max: 100 },
            gravityY: speedDown - 200,
            scale: 0.04,
            duration: 80,
            emitting: false,
        });
        this.emitter.startFollow(this.player, 1, 1, true);

        // Ensure the music stops when the scene is shutdown or switched
        this.events.on('shutdown', () => {
            if (this.bgMusic && this.bgMusic.isPlaying) {
                this.bgMusic.stop();
            }
        });
    }

    toggleSound() {
        if (this.soundOn) {
            // Turn off the background music
            this.bgMusic.stop();
            this.soundOn = false;
            this.soundToggleButton.setTexture('off'); // Change button to 'off' image
            //console.log('Sound off');
        } else {
            // Turn on the background music
            this.bgMusic.play();
            this.soundOn = true;
            this.soundToggleButton.setTexture('on'); // Change button to 'on' image
            //console.log('Sound on');
        }
    }

    update() {
        // if (!this.player || !this.player.body || !this.player.active) {
        //   this.recreatePlayer();
        //   console.log('Player is not available in update');
        //   return; // Exit early if player is destroyed, doesn't have a body, or is inactive
        // }

        //update timers
        this.remainingTime = this.timedEvent.getRemainingSeconds();
        this.textTime.setText(`Time left: ${Math.round(this.remainingTime).toString()}`);

        const desiredTargetWidth = this.backgroundWidth * percent_target; // Desired size for the target

        // Update and remove targets
        // this.targets = this.targets.filter(target => {
        //   if (target.y >= sizes.height) {
        //     //target.destroy();
        //     return false;
        //   }
        //   return true;
        // });

        const isDesk = this.sys.game.device.os.desktop;

        //player movement input
        if (isDesk) {
            if (this.cursor.left && (this.cursor.left.isDown || this.cursor.left === true)) {
                this.player.setVelocityX(-this.playerSpeed);
            } else if (this.cursor.right && (this.cursor.right.isDown || this.cursor.right === true)) {
                this.player.setVelocityX(this.playerSpeed);
            } else {
                this.player.setVelocityX(0);
            }
        } else {
            this.input.on('drag', (pointer, gameObject, dragX) => {
                //  By clamping dragX we can keep it within
                //  whatever bounds we need
                dragX = Phaser.Math.Clamp(dragX, 0, 500);

                //  By only applying the dragX we can limit the drag
                //  to be horizontal only
                gameObject.x = dragX;

                // AI solution
                // if (gameObject === this.player) {
                //   dragX = Phaser.Math.Clamp(dragX, 0, this.sys.game.config.width - this.player.displayWidth);
                //   gameObject.x = dragX;
                // }
            });
        }

        // Add this at the end of the update method
        //console.log('Player position:', this.player.x, this.player.y);
    }

    spawnTarget() {
        const targetID = this.targets.length;
        if (targetID < this.maxTargets) {
            const desiredTargetWidth = this.backgroundWidth * percent_target;
            const selectedImage = Phaser.Math.RND.pick(this.allImages);
            const selectedImageWidth = this.textures.getFrame(selectedImage).width;
            const targetScale = desiredTargetWidth / selectedImageWidth;

            const target = this.physics.add.image(this.getRandomX(), 0, selectedImage)
                .setOrigin(0, 0)
                .setScale(targetScale);

            target.body.setGravityY(this.fallSpeed);
            target.setMaxVelocity(0, this.fallSpeed);
            target.setX(this.getRandomX()); // Randomize initial position
            //this.physics.add.overlap(target, this.player, this.targetHit, null, this);

            this.targets.push(target);
            this.correctTagrets.push(this.rightImages.includes(selectedImage));
            this.physics.add.overlap(target, this.player, () => {
                if (this.correctTagrets[targetID]) {
                    this.points += 7;
                    console.log('Right target');
                } else {
                    this.points -= 3;
                }

                //const selectedImage = Phaser.Math.RND.pick(this.allImages);

                // Update target (falling object) size
                //const desiredTargetWidth = this.backgroundWidth * percent_target; // Desired size for the target
                //const selectedImageWidth = this.textures.getFrame(selectedImage).width;
                //const targetScale = desiredTargetWidth / selectedImageWidth;

                if (this.soundOn) {
                    this.coinMusic.play(); //music dzzin
                }
                this.correctTagret = this.rightImages.includes(selectedImage);

                this.emitter.start(); //emits poins
                this.targets[targetID].setY(-200);
                this.targets[targetID].setX(this.getRandomX());
                //this.targets[targetID].setTexture(selectedImage).setScale(targetScale);

                this.textScore.setText(`Score: ${this.points}`);
            }, null, this);
        }
    }

    // randomizer
    getRandomX() {
        const desiredTargetWidth = this.backgroundWidth * percent_target;
        return Phaser.Math.Between(0, sizes.width - desiredTargetWidth);
    }

    // // //Collision with target
    // targetHit(target, player) {
    //   console.log('target:', target);

    //   if (target.correctTarget) {
    //     this.points += 7;
    //   } else {
    //     this.points -= 3;
    //   }

    //   if (this.soundOn) {
    //     this.coinMusic.play();
    //   }

    //   this.emitter.start();
    //   this.textScore.setText(`Score: ${this.points}`);

    //   // Remove the hit target
    //   const index = this.targets.indexOf(target);
    //   console.log('index of target:', index);
    //   //if (index > -1) {
    //   //  this.targets.splice(index, 1);
    //   //}
    //   //target.destroy(); // This ensures the target disappears

    //   // Increase fall speed for remaining targets
    //   this.increaseFallSpeed();

    //   // Log player status for debugging
    //   console.log('Player status:', {
    //     active: player.active,
    //     visible: player.visible,
    //     x: player.x,
    //     y: player.y
    //   });

    //   // Ensure the player is still active and visible
    //   if (!player.active || !player.visible) {
    //     console.error('Player was deactivated or hidden unexpectedly');
    //     //this.recreatePlayer();
    //   }
    // }

    // // Collision with target
    // targetHit(player, target) {
    //   if (!target.active) return; // Skip if the target is inactive

    //   if (target.correctTarget) {
    //     this.points += 7;
    //   } else {
    //     this.points -= 3;
    //   }

    //   if (this.soundOn) {
    //     this.coinMusic.play();
    //   }

    //   this.emitter.start();
    //   this.textScore.setText(`Score: ${this.points}`);

    //   // Remove the hit target
    //   const index = this.targets.indexOf(target);
    //   if (index > -1) {
    //     this.targets.splice(index, 1);
    //   }
    //   target.destroy(); // This ensures the target disappears

    //   // Increase fall speed for remaining targets
    //   this.increaseFallSpeed();

    //   // Log player status for debugging
    //   console.log('Player status:', {
    //     active: player.active,
    //     visible: player.visible,
    //     x: player.x,
    //     y: player.y
    //   });

    //   // Ensure the player is still active and visible
    //   if (!player.active || !player.visible) {
    //     console.error('Player was deactivated or hidden unexpectedly');
    //     //this.recreatePlayer();
    //   }
    // }

    // Collision with target (old)
    targetHit() {
        if (this.correctTagret) {
            this.points += 7;
            console.log('Right target');
        } else {
            this.points -= 3;
        }

        const selectedImage = Phaser.Math.RND.pick(this.allImages);

        // Update target (falling object) size
        const desiredTargetWidth = this.backgroundWidth * percent_target; // Desired size for the target
        const selectedImageWidth = this.textures.getFrame(selectedImage).width;
        const targetScale = desiredTargetWidth / selectedImageWidth;

        if (this.soundOn) {
            this.coinMusic.play(); //music dzzin
        }
        this.correctTagret = this.rightImages.includes(selectedImage);

        this.emitter.start(); //emits poins
        this.targets[0].setY(-200);
        this.targets[0].setX(this.getRandomX());
        this.targets[0].setTexture(selectedImage).setScale(targetScale);

        this.textScore.setText(`Score: ${this.points}`);
        //this.increaseFallSpeed();
    }


    recreatePlayer() {
        console.log('Recreating player');
        // Recreate the player with the same properties as in the create method
        const desiredBasketWidth = this.backgroundWidth * percent_target * 1.1;
        const basketFrame = this.textures.getFrame('bs');
        const basketScale = desiredBasketWidth / basketFrame.width;

        // Store the current position if the player exists
        const currentX = this.player ? this.player.x : this.cameras.main.width / 2;
        const currentY = this.player ? this.player.y : sizes.height - 120;

        if (this.player) {
            this.player.destroy();
        }

        this.player = this.physics.add
            .image(currentX, currentY, 'bs')
            .setOrigin(0.5, 0)
            .setScale(basketScale);

        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);

        this.player
            .setSize(this.player.width - this.player.width / 4, this.player.height - this.player.height / 2)
            .setOffset(this.player.width / 8, this.player.height / 2);

        // Reattach the overlap check
        this.physics.add.overlap(this.targets, this.player, this.targetHit, null, this);

        // If using mobile controls, reattach the drag functionality
        if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
            this.player.setInteractive({ draggable: true });
        }

        console.log('Player recreated:', this.player);
    }

    gameOver() {
        // Stop the scene instead of destroying the game
        this.scene.stop();

        // Stops the background music
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.stop();
        }

        if (this.points >= 25) {
            gameEndScoreSpan.textContent = this.points;
            gameWinLoseSpan.textContent = 'You won a prize!';
            console.log(gameWinLoseSpan.textContent);
            this.prizetype = 1;
        } else if (this.points >= 10 && this.points < 25) {
            gameEndScoreSpan.textContent = this.points;
            gameWinLoseSpan.textContent = 'You won a prize!';
            console.log(gameWinLoseSpan.textContent);
            this.prizetype = 2;
        } else {
            gameEndScoreSpan.textContent = this.points;
            gameWinLoseSpan.textContent = 'Sorry, you lost( Try again!';
            mintButton.hidden = true;
            this.prizetype = 0;
        }
        gameEndDiv.style.display = 'flex';
        const claimButton = document.getElementById('gameClaim');
        const input = document.getElementById('addressInput');
        if (this.prizetype > 0) {
            claimButton.disabled = false;
            input.hidden = false;
        } else {
            claimButton.disabled = true;
            input.hidden = true;
            alert(`You can't claim prize if you lose :(`)
        }
        console.log(this.prizetype);

        // Schedule the game destruction for the next frame
        this.time.delayedCall(0, () => {
            this.sys.game.destroy(true);
        });
    }

    increaseFallSpeed() {
        this.fallSpeed += speedIncrease;

        // Update fall speed for all remaining targets
        // this.targets = this.targets.filter(target => {
        //   if (target && target.active && target.body) {
        //     target.body.setGravityY(this.fallSpeed);
        //     target.setMaxVelocity(0, this.fallSpeed + 100);
        //     return true;
        //   }
        //   return false;
        // });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: speedDown },
            debug: false, // true if need to see movement patterns highlighted
        },
    },
    // Include PreloadScene in the scene array before GameScene
    scene: [PreloadScene, GameScene],
};

const game = new Phaser.Game(config);
window.game = game; // to make game accessible globally

window.startGame = function () {
    console.log('startGame');
    //preventDefault(); // Prevents the default action of the touch event
    gameStartDiv.style.display = 'none';
    let scene = window.game.scene.getScene('scene-game');
    //scene.playBackgroundMusic();
    game.scene.resume('scene-game');
};

window.mintNFT = async function () {
    try {
        document.getElementById('tonconnect-buttons').hidden = true;

        // Obtain game configuration
        const gameConfig = window.getConfiguration();
        const firebaseConfig = {
            apiKey: "AIzaSyCH2g-sUQyP1gpK0WG5anBYe0cxX-qajSY",
            authDomain: "vself-bot-642c4.firebaseapp.com",
            projectId: "vself-bot-642c4",
            storageBucket: "vself-bot-642c4.appspot.com",
            messagingSenderId: "805299663907",
            appId: "1:805299663907:web:0e1b91899d933c39702d96",
            measurementId: "G-RFTFBLXEP9",
        };


        document.getElementById('gameClaim').disabled = true;
        const input = document.getElementById('addressInput');
        const addressInput = input.value;
        if (addressInput == '') {
            alert('Please enter valid TON address or connect your wallet.');
            return;
        }

        console.log('Mint to ', addressInput);
        input.value = '';

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const addr = address(addressInput);
        const rewardMeta = gameConfig.prize_meta;
        const rewardDoc = doc(db, "game_rewards", rewardMeta.substring(7) || 'default');
        const rewardCollection = await getDoc(rewardDoc);
        if (rewardCollection.exists()) {
            if (rewardCollection.data()[addr]) {
                alert("Reward already issued!");
                return;
            }
        }

        console.log(rewardMeta);
        // if (!rewardMeta) {
        //   await mintTo(address(addressInput), gameConfig.prize_meta); // address example EQDfLtjmTkfJmVfcR58F4QTHmAqi_kUsJwZw2x-jQep8MHNW
        //   alert("Mint was successful!");
        //   return;
        // }
        if (!rewardMeta) return;

        const userId = WebApp.initDataUnsafe.user?.id;
        const userData = WebApp.initDataUnsafe.user;

        await fetch(
            // `https://vself-ton-api.vercel.app/api/mint_sbt_mainnet?recipient=${addr}&meta=${rewardMeta}`
            `https://mintsbt-4nhej4xsxq-ew.a.run.app?recipient=${addr}&metadata=${rewardMeta}`
        )
            .then(async (resp) => {
                const r = await resp.json();
                console.log("r:", r);
                await setDoc(
                    rewardDoc,
                    {
                        [addr]: {
                            address: addr.toString(),
                            tg: userId || 0,
                            minted: true,
                            time: Date.now(),
                            user: userData,
                        },
                    },
                    { merge: true }
                );
                // setNFTAddress(r.item_address);
                alert('Mint was successfull!');
                const successMessage = `<p>You&apos;ll see your reward in your TON wallet or using{" "}
        <a
          target='_blank'
          href={"https://explorer.tonnft.tools/nft/${nft_address}"}
        >
          this link
        </a>
        when it&apos;s processed</p>`;
                successMessageHeader.innerHTML = successMessage;
                // alert(`https://explorer.tonnft.tools/nft/${r.item_address}`);
            })
            .catch(async (err) => {
                await setDoc(
                    rewardDoc,
                    {
                        [addr]: {
                            address: addr.toString(),
                            tg: userId || 0,
                            minted: false,
                            lastError: err,
                            time: Date.now(),
                            user: userData,
                        },
                    },
                    { merge: true }
                );
                console.log("err: ", err);
                alert("Something went wrong. We're on it, don`t panic.");
            })

        scoreMessageHeader.style.display = 'none';
        successMessageHeader.style.display = 'flex';

        // console.log('Success, collection address is EQA1jmC4MqMGoDfa0OoCwiO3Ut_OicarkdxmfZOXF-BImGzU');
    } catch (err) {
        console.log(err);
    } finally {
        document.getElementById('gameClaim').disabled = false;
        document.getElementById('tonconnect-buttons').hidden = false;
    }
};
