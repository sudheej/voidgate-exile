import Phaser from 'phaser'


export default function Tile(scene) {

    this.scene = scene



}

Tile.prototype.createTile = function (TileProperties) {
    let rectangle = new Phaser.GameObjects.Rectangle(this.scene, TileProperties.x, TileProperties.y, TileProperties.width, TileProperties.height, 0x80dfff);
    rectangle.setStrokeStyle(1);
    let entryGradient = new Phaser.GameObjects.Graphics(this.scene);
    if (TileProperties.type === "path") {
        rectangle.setFillStyle(0x000000)
    }
    else if (TileProperties.type === "start_path") {
        rectangle.fillColor = 0x000000
        entryGradient.fillGradientStyle(0x7CFC00, 0xADFF2F, 0x000000, 0x000000, 1);
        entryGradient.fillRect(TileProperties.x - 12, TileProperties.y - 10, TileProperties.width, TileProperties.height)
        this.scene.add.existing(entryGradient)
    }
    else {
        this.scene.add.existing(rectangle)
    }
}