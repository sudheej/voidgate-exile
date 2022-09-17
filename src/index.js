import Phaser from 'phaser';
import Tile from './components/Tile'
import Map from './components/Map'
import Weapon from './components/Weapon';
import plainmap from './assets/maps/plainfield.json'
import { weaponarray } from './state/WeaponArray';


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

        

        this.input.setDefaultCursor('url(assets/cursors/cur.cur), cursor')
        const map = new Map(this);
        map.MappingData = plainmap;
        map.createMap(100,100);


            let WeaponProperties = {
                _id: "weapontimele",
                x: 875,
                y: 210,
                height: 25,
                width: 25,
                type: "basic_gun"
            };
            
            const weapon = new Weapon(this,WeaponProperties);
                        
            weapon.createTile()

            weapon.rectangle.setInteractive();
            weapon.rectangle.on('pointerdown', () => { console.log('pointerover'); weaponarray.selectedproperty = weapon});
      
           

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
