import { makeAutoObservable, observable } from "mobx";

class GameStore {
  @observable money = 1200;
  lives = 3;
  gameover = false;
  @observable wave = 1;
  constructor() {
    makeAutoObservable(this);
  }
}

export const gameStore = new GameStore();
