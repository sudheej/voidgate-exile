import Phaser from 'phaser';
import Tile from './components/Tile'
import Map from './components/Map'
import plainmap from './assets/maps/plainfield.json'
class Main extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
       
    }
      
    create ()
    {
        const map = new Map(this);
        map.MappingData = plainmap;
        map.createMap(100,100);

    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    parent: 'game',
    width: 1000,
    height: 800,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: Main
};

const game = new Phaser.Game(config);
