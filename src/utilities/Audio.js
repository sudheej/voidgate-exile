export default class Audio {
  constructor(scene) {
    this.scene = scene;
    this.soundObjects = {};
  }

  preload(sounds) {
    sounds.forEach((sound) => {
      this.scene.load.audio(sound.name, sound.src);
    });
  }

  create(sounds) {
    sounds.forEach((sound) => {
      this.soundObjects[sound.name] = this.scene.sound.add(sound.name);
    });
  }

  play(soundName, options = {}) {
    const sound = this.soundObjects[soundName];
    if (!sound) {
      console.warn(`Sound '${soundName}' not found`);
      return;
    }
    if (options.loop !== undefined) {
      sound.setLoop(options.loop);
    }
    if (options.volume !== undefined) {
      sound.setVolume(options.volume);
    }
    sound.play();
  }

  stop(soundName) {
    const sound = this.soundObjects[soundName];
    if (!sound) {
      console.warn(`Sound '${soundName}' not found`);
      return;
    }
    sound.stop();
  }
}
