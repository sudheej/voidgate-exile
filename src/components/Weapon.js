import Tile from './Tile'
import { weaponarray } from '../state/WeaponArray'

export default function Weapon(scene, weaponproperties) {
    Tile.call(this, scene, weaponproperties)
}


Weapon.prototype = Object.create(Tile.prototype)

Weapon.prototype.createTile = function () {
    this.rectangle.setInteractive();
    let weaponHull = this.scene.add.existing(this.rectangle) 
    let weaponPrimary = this.scene.add.line(this.tileproperties.x, this.tileproperties.y, 0, 0, 20, 0, 0xFFFFFF)
    this.scene.tweens.add({

        targets: weaponPrimary,
        angle: 90,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'

    });
    this.layer.add(weaponHull,weaponPrimary)

    this.rectangle.name = this.tileproperties._id
    Tile.prototype.createTile.call(this)


}