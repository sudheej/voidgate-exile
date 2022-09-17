import Tile from './Tile'
import Weapon from './Weapon';
import { weaponarray } from '../state/WeaponArray';


export default function Map(scene) {

    let MappingData;
    let genesis = true;
    this.scene = scene



    this.createMap = function (mapOriginX, mapOriginY) {
        console.log(MappingData)
        let mapHorizontalLength = MappingData.length;
        let mapVerticalLength = MappingData[0].length;
        let defaultColor = 0x80dfff;
        for (let vi = 0; vi < mapVerticalLength; vi++) {
            for (let hi = 0; hi < mapHorizontalLength; hi++) {
                const TileProperties = {
                    ...MappingData[vi][hi]
                }
                const tile = new Tile(this.scene, TileProperties)
                tile.createTile()
                tile.rectangle.setInteractive()
                tile.rectangle.on('pointerover', () => {

                    if (weaponarray.selectedproperty) {
                        tile.rectangle.fillColor = 0xFF0000
                    }


                })

                tile.rectangle.on('pointerout', () => {

                    if (weaponarray.selectedproperty) {
                        tile.rectangle.fillColor = defaultColor
                    }


                })

                tile.rectangle.on('pointerdown', () => {
                    if (weaponarray.selectedproperty) {
                        let tilePositon = weaponarray.selectedproperty.tileproperties
                        tilePositon.x = tile.rectangle.x
                        tilePositon.y = tile.rectangle.y
                        console.log(tilePositon)
                        tile.rectangle.destroy()
                        const newWeapon = new Weapon(this.scene, tilePositon)
                        newWeapon.createTile()
                    }
                })
            }
        }
    }

    Object.defineProperty(this, 'MappingData', {
        get: function () {
            return MappingData
        },
        set: function (value) {
            MappingData = value;
        }
    })

}