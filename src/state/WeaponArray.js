import { makeAutoObservable } from "mobx";


class WeaponArray {
    basicgunammo = 5
    selectedproperty = null
    constructor() {
        makeAutoObservable(this)
    }
}

export const weaponarray = new WeaponArray()