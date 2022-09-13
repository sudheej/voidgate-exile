import Tile from './Tile'

export default function Weapon(scene, weaponproperties) {
    Tile.call(this, scene, weaponproperties)
}


Weapon.prototype = Object.create(Tile.prototype)

Weapon.prototype.createTile = function () {
    this.rectangle.setInteractive();
    this.scene.input.setDraggable(this.rectangle);
    this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
    Tile.prototype.createTile.call(this)


}