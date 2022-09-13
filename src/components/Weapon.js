import Tile from './Tile'

export default function Weapon(scene) {
Tile.call(this,scene)
}

Weapon.prototype = Object.create(Tile.prototype)

Weapon.prototype.createTile = function() {

    console.log(rectangle)
}