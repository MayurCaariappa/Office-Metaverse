import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

const GameScene = () => {
  const gameRef = useRef(null); // Reference to hold the Phaser game instance

  useEffect(() => {
    // Basic Phaser config
    const config = {
      type: Phaser.AUTO,  // Choose WebGL or Canvas automatically
      width: 800,         // Width of the game area
      height: 600,        // Height of the game area
      physics: {
        default: 'arcade',  // Use the arcade physics system
        arcade: {
          gravity: { y: 0 }, // No gravity in this 2D environment
        },
      },
      scene: {
        preload: preload,   // Function to preload assets
        create: create,     // Function to set up the game scene
        update: update,     // Function to update game objects each frame
      },
    };

    // Initialize the Phaser Game instance
    gameRef.current = new Phaser.Game(config);

    return () => {
      // Cleanup the game instance on unmount
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  // Preload function to load assets
  function preload() {
    // Example asset: Load an avatar sprite (replace with your image path)
    this.load.spritesheet('avatar', '/assets/avatar-character.jpg', {
      frameWidth: 32,  // Width of each frame in the sprite sheet
      frameHeight: 48, // Height of each frame in the sprite sheet
    });
    // Example: Load a background image
    this.load.image('office', '/assets/office-space.png');
  }

  // Create function to set up the scene
  function create() {
    // Add background image
    this.add.image(400, 300, 'office');

    // Add the player character (avatar) in the middle of the screen
    this.player = this.physics.add.sprite(400, 300, 'avatar');
    this.player.setCollideWorldBounds(true);  // Prevent the player from leaving the game area

    // Create walking animation from avatar spritesheet
    this.anims.create({
      key: 'walk',  // Animation key
      frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }),  // Frame range for walking
      frameRate: 10,  // Animation speed
      repeat: -1,  // Repeat forever
    });

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // Update function to handle movement
  function update() {
    // Reset the player's velocity (no movement)
    this.player.setVelocity(0);

    // Move left
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('walk', true);  // Play walking animation
    }
    // Move right
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('walk', true);
    }
    // Move up
    else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play('walk', true);
    }
    // Move down
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play('walk', true);
    } else {
      // Stop animation when no key is pressed
      this.player.anims.stop();
    }
  }

  return (
    <div>
      <div id="game-container" /> {/* Container for Phaser game */}
    </div>
  );
};

export default GameScene;
