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
        const tile = new Tile(this);
        tile.createTile('start_path');
        console.log(tile.TileProperties);
        const map = new Map(this);
        map.MappingData = plainmap;
        map.createMap(100,100);

    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Main
};

const game = new Phaser.Game(config);
