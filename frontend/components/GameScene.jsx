import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

const GameScene = () => {
  const gameRef = useRef(null); // Reference for the Phaser game

  useEffect(() => {
    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: 'viewport', // Attach Phaser game to the viewport div
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) gameRef.current.destroy(true);
    };
  }, []);

  function preload() {
    this.load.image('office', '/assets/office-space.png');
    this.load.image('avatar', '/assets/avatar-character.jpg');
  }

  function create() {
    // Adding the office background - Create a container for the map and obstacles
    this.officeMap = this.add.container(0, 0); 

    const background = this.add.image(0, 0, 'office').setOrigin(0, 0);
    background.setDisplaySize(2000, 2000); // Set the display size to match actual map size
    this.officeMap.add(background); // Add background to the map container

    // Adding the avatar character at the center of the viewport
    this.avatar = this.physics.add.sprite(400, 300, 'avatar');
    this.avatar.setCollideWorldBounds(true); // Prevent the avatar from moving out of bounds
    this.avatar.setScale(0.2);

    // Static group for obstacles within the map
    this.obstacles = this.physics.add.staticGroup();

    // Define the table block relative to the map's coordinates
    const tableBlock = this.add.rectangle(235, 205, 105, 390).setOrigin(0, 0);
    this.physics.add.existing(tableBlock, true); // Set as static collider
    this.obstacles.add(tableBlock);
    tableBlock.setVisible(false); // Make it invisible

    // Define other obstacles as needed
    const chairBlock = this.add.rectangle(500, 500, 50, 50).setOrigin(0, 0);
    this.physics.add.existing(chairBlock, true); // Set as static collider
    this.obstacles.add(chairBlock);
    chairBlock.setVisible(false);

    // Add obstacles to the office map container
    this.officeMap.add([tableBlock, chairBlock]);

    // Enable collision between avatar and obstacles
    this.physics.add.collider(this.avatar, this.obstacles);

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  function update() {
    let speed = 5;

    // Move the map based on arrow key input, simulating avatar movement
    if (this.cursors.left.isDown) {
      this.officeMap.x += speed;
    }
    if (this.cursors.right.isDown) {
      this.officeMap.x -= speed;
    }
    if (this.cursors.up.isDown) {
      this.officeMap.y += speed;
    }
    if (this.cursors.down.isDown) {
      this.officeMap.y -= speed;
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        id="viewport"
        style={{
          width: '800px',
          height: '550px',
          overflow: 'hidden',
          border: '2px solid black',
        }}
      />
    </div>
  );
};

export default GameScene;