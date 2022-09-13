import Phaser from 'phaser';
import Tile from './components/Tile'
import Map from './components/Map'
import Weapon from './components/Weapon';
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

        
    let WeaponProperties = {
        _id: "weapontimele",
        x: 875,
        y: 210,
        height: 25,
        width: 25,
        type: "plainTile"
    };
    

        const map = new Map(this);
        map.MappingData = plainmap;
        map.createMap(100,100);
        const weapon = new Weapon(this,WeaponProperties);
        console.log(weapon)
        weapon.createTile()


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
