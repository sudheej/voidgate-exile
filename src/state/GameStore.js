import { makeAutoObservable, observable } from "mobx";
import { configure } from "mobx";

configure({
  enforceActions: "never",
});

class GameStore {
  @observable money = 1500;
  @observable enemies = 0;
  lives = 3;
  life_bar = 100;
  gameover = false;
  @observable wave = 1;

  constructor() {
    makeAutoObservable(this);
  }

  // Method to reset all data to original values
  resetData() {
    this.money = 1500;
    this.enemies = 0;
    this.lives = 3;
    this.life_bar = 100;
    this.gameover = false;
    this.wave = 1;
  }
}

export const gameStore = new GameStore();
