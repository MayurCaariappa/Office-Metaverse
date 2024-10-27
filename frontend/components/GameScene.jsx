import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

const GameScene = ({ username }) => {
  const gameRef = useRef(null); // Reference for the Phaser game

  useEffect(() => {
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

    // Create the Phaser game instance
    gameRef.current = new Phaser.Game(config);

    // Clean up on component unmount
    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null; // Avoid memory leaks
    };
  }, []);

  const preload = function () {
    this.load.image('office', '/assets/office-space.png');
    this.load.image('avatar1', '/assets/avatar-player1.png');
    this.load.image('avatar2', '/assets/avatar-player2.png');
  };

  const create = function () {
    // Adding the office background
    this.officeMap = this.add.image(0, 0, 'office').setOrigin(0, 0);
    this.officeMap.setDisplaySize(535, 365);

    // Set world bounds for the physics
    const { displayWidth: mapWidth, displayHeight: mapHeight } = this.officeMap;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Initialize avatar
    this.avatar = this.physics.add.sprite(80, 38, 'avatar2')
      .setCollideWorldBounds(true)
      .setScale(0.05);

    // Configure camera
    this.cameras.main
      .startFollow(this.avatar)
      .setBounds(0, 0, mapWidth, mapHeight)
      .setZoom(1.5);

    // Create obstacles
    this.obstacles = this.physics.add.staticGroup();

    // Define and add obstacles
    const obstaclesData = [
      { x: 50, y: 33, width: 28, height: 60 }, // lobbyTable1
      { x: 50, y: 118, width: 28, height: 60 }, // lobbyTable2 
      { x: 115, y: 0, width: 12, height: 182 }, // lobbyWall 
      { x: 0, y: 223, width: 127, height: 33 }, // movieWall 
    ];

    obstaclesData.forEach(({ x, y, width, height }) => {
      const obstacle = this.add.rectangle(x, y, width, height).setOrigin(0, 0);
      this.physics.add.existing(obstacle, true); // Static obstacle
      this.obstacles.add(obstacle);
    });

    // Enable collision between avatar and obstacles
    this.physics.add.collider(this.avatar, this.obstacles);

    // Initialize keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add text below the avatar
    this.avatarText = this.add.text(this.avatar.x, this.avatar.y + 5, `${username}`, {
      font: '7px Times New Roman',
      fill: '#ffffff',
      align: 'center',
      
    }).setOrigin(0.5, 0);
  };

  const update = function () {
    const speed = 100;

    // Reset velocity
    this.avatar.setVelocity(0);

    // Handle avatar movement
    if (this.cursors.left.isDown) {
      this.avatar.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.avatar.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.avatar.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.avatar.setVelocityY(speed);
    }
    this.avatarText.setPosition(this.avatar.x, this.avatar.y + 5);
  };

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
