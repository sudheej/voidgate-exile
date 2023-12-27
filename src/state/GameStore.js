import { makeAutoObservable, observable } from "mobx";
import {configure } from "mobx"

configure({
  enforceActions: "never"
})

class GameStore {
  @observable money = 5200;
  @observable enemies = 0;
  lives = 3;
  life_bar = 100;
  gameover = false;
  @observable wave = 1;
  constructor() {
    makeAutoObservable(this);
  }
}

export const gameStore = new GameStore();
