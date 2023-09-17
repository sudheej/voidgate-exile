import { makeAutoObservable, observable } from 'mobx';

class GameStore {
    @observable money = 0;
    lives = 3;
    gameover = false;

    constructor() {
        makeAutoObservable(this);
    }
}

export const gameStore = new GameStore();