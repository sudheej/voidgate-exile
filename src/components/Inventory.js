import Weapon from "./Weapon";
import { weaponarray } from "../state/WeaponArray";

export default class Inventory {
  constructor(scene) {
    this.scene = scene;
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
      cost: "50"
    },
    {
      _id: "weapontimele",
      x: 825,
      y: 210,
      height: 25,
      width: 25,
      type: "homing_missile",
      cost: "250"
    }
  ];

  weaponProperties.map( x => {

    const weapon = new Weapon(this.scene, x);

    weapon.rectangle.name = "actualname";
    weapon.createTile();

    weapon.rectangle.setInteractive();
    weapon.rectangle.on("pointerdown", () => {
      weaponarray.selectedproperty = weapon;
      this.scene.audio.play("_aud_weapon_pickup");
    });

  })
  
  }
}
