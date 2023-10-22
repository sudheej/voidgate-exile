import Tile from "./Tile";
import Weapon from "./Weapon";
import { weaponarray } from "../state/WeaponArray";
import { gameStore } from "../state/GameStore";
import Pretty from "./Pretty"

export default class Map {
  MappingData = [];
  scene;

  constructor(scene) {
    this.scene = scene;
    this.pretty = new Pretty(this.scene);
  }

  createMap = (mapOriginX, mapOriginY) => {
    this.scene.input.setDefaultCursor("grab");
    let mapHorizontalLength = this.MappingData.length;
    let mapVerticalLength = this.MappingData[0].length;
    let defaultColor = 0x4dd4ca;

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
          handleWeaponPlacement(this.scene);
        });

        function handleWeaponPlacement(scene) {
          if (weaponarray.selectedproperty) {
            const tilePosition = weaponarray.selectedproperty.tileproperties;
            tilePosition._id = "actualweapon";
            tilePosition.x = tile.rectangle.x;
            tilePosition.y = tile.rectangle.y;

            const weaponCost = tilePosition.cost;
            if (isEligible(tile) && gameStore.money >= weaponCost) {
              placeNewWeapon(scene, weaponCost);
            } else {
              handleInvalidPlacement(scene, weaponCost);
            }
          }
        }

        function placeNewWeapon(scene, weaponCost) {
          weaponarray.selectedproperty.rectangle.alpha = 1;
          tile.rectangle.destroy();

          const newWeapon = new Weapon(
            scene,
            weaponarray.selectedproperty.tileproperties
          );
          newWeapon.createTile();

          scene.audio.play("_aud_weapon_place");
          gameStore.money -= weaponCost;
        }

        function handleInvalidPlacement(scene, weaponCost) {
          scene.input.setDefaultCursor("not-allowed");
          if (gameStore.money <= weaponCost) {
            weaponarray.selectedproperty.rectangle.alpha = 0.5;
          }
        }

        function isEligible(tile) {
          if (tile.tileproperties.type.includes("path")) {
            return false;
          }
          return true;
        }
      }
    }

    // Pretty the map
    this.pretty.makeTilesPretty();

  };

  setMappingData = (value) => {
    this.MappingData = value;
  };

  get MappingData() {
    return this.MappingData;
  }
}
