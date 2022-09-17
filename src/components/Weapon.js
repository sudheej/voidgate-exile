import Tile from './Tile'
import { weaponarray } from '../state/WeaponArray'

export default function Weapon(scene, weaponproperties) {
    Tile.call(this, scene, weaponproperties)
}


Weapon.prototype = Object.create(Tile.prototype)

Weapon.prototype.createTile = function () {
    this.rectangle.setInteractive();
    this.rectangle.name = this.tileproperties._id
    Tile.prototype.createTile.call(this)


}