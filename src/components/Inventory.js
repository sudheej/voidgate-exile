import Weapon from "./Weapon";
import { weaponarray } from "../state/WeaponArray";
import GameText from "../utilities/GameText";
import Helper from "../utilities/Helper";
import { gameStore } from "../state/GameStore";
export default class Inventory {
  constructor(scene) {
    this.scene = scene;
    this.helper = new Helper();
    this.gameText = new GameText();
  }

  update = () => {
    let weaponArrayItems = [];
    if (this.scene.sys.displayList instanceof Phaser.GameObjects.DisplayList) {
      weaponArrayItems = this.scene.sys.displayList.list.filter(
        (child) => child instanceof Phaser.GameObjects.Rectangle
      );
    }

    weaponArrayItems.forEach((weponArrayItem) => {
      if (weponArrayItem.name === "weapontimele") {
        if (gameStore.money <= parseInt(weponArrayItem.getData("cost"))) {
          weponArrayItem.alpha = 0.5
        }
        else {
          weponArrayItem.alpha = 1
        }


      }
    });

  }

  createInventory() {
    const weaponProperties = [
      {
        _id: "weapontimele",
        x: 875,
        y: 210,
        height: 25,
        width: 25,
        type: "basic_gun",
        cost: "50",
        damage: "1",
      },
      {
        _id: "weapontimele",
        x: 825,
        y: 210,
        height: 25,
        width: 25,
        type: "homing_missile",
        cost: "250",
        damage: "30",
      },
      {
        _id: "weapontimele",
        x: 825,
        y: 260,
        height: 25,
        width: 25,
        type: "stun_gun",
        cost: "100",
        damage: "1",
      },
    ];

    //const weaponInventoryOuterBoundary = this.scene.add.rectangle(870,280,150,200,0xFF0000)
    const weaponInventoryOuterBoundary = this.scene.add.graphics();
    weaponInventoryOuterBoundary.fillStyle(
      this.helper.adjustShade(0x4dd4ca, -10),
      0.2
    );
    weaponInventoryOuterBoundary.fillRect(776, 180, 150, 200);
    this.gameText.writeText(this.scene, 810, 150, "Tower", 20, "#4DD4CA");
    weaponProperties.map((x) => {
      const weapon = new Weapon(this.scene, x);

      weapon.rectangle.name = "actualname";
      weapon.createTile();

      weapon.rectangle.setInteractive();
      weapon.rectangle.setData("cost",x.cost)
      weapon.rectangle.on("pointerdown", () => {
        weaponarray.selectedproperty = weapon;
        this.scene.audio.play("_aud_weapon_pickup");
      });
    });
  }
}
