import Weapon from "./Weapon";
import { weaponarray } from "../state/WeaponArray";

export default function Inventory(scene) {
  this.scene = scene;
}

Inventory.prototype.createInvetory = function () {
  let WeaponProperties = {
    _id: "weapontimele",
    x: 875,
    y: 210,
    height: 25,
    width: 25,
    type: "basic_gun",
  };

  const weapon = new Weapon(this.scene, WeaponProperties);

  weapon.createTile();

  weapon.rectangle.setInteractive();
  console.log(weapon);
  weapon.rectangle.on("pointerdown", () => {
    weaponarray.selectedproperty = weapon;
  });
};
