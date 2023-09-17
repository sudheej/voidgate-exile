import Tile from "./Tile";
import Weapon from "./Weapon";
import { weaponarray } from "../state/WeaponArray";

export default class Map {
  MappingData = [];
  scene;

  constructor(scene) {
    this.scene = scene;
  }

  isEligible = (tile) => {
    if (tile.tileproperties.type.includes("path")) {
      return false;
    }
    return true;
  };

  createMap = (mapOriginX, mapOriginY) => {
    this.scene.input.setDefaultCursor("grab");
    let mapHorizontalLength = this.MappingData.length;
    let mapVerticalLength = this.MappingData[0].length;
    let defaultColor = 0x80dfff;

    for (let vi = 0; vi < mapVerticalLength; vi++) {
      for (let hi = 0; hi < mapHorizontalLength; hi++) {
        const TileProperties = { ...this.MappingData[vi][hi] };
        const tile = new Tile(this.scene, TileProperties);
        tile.createTile();
        tile.rectangle.setInteractive();

        tile.rectangle.on("pointerover", () => {
          if (weaponarray.selectedproperty) {
            tile.rectangle.fillColor = 0xff0000;
          }
        });

        tile.rectangle.on("pointerout", () => {
          this.scene.input.setDefaultCursor("grab");

          if (weaponarray.selectedproperty) {
            tile.rectangle.fillColor = defaultColor;
          }
        });

        tile.rectangle.on("pointerdown", () => {
          if (weaponarray.selectedproperty) {
            let tilePositon = weaponarray.selectedproperty.tileproperties;
            tilePositon._id = "actualweapon";
            tilePositon.x = tile.rectangle.x;
            tilePositon.y = tile.rectangle.y;

            if (this.isEligible(tile)) {
              tile.rectangle.destroy();
              const newWeapon = new Weapon(this.scene, tilePositon);
              newWeapon.createTile();
              this.scene.audio.play("_aud_weapon_place");
            } else {
              this.scene.input.setDefaultCursor("not-allowed");
            }
          }
        });
      }
    }
  };

  setMappingData = (value) => {
    this.MappingData = value;
  };

  get MappingData() {
    return this.MappingData;
  }
}
