export default class ModalDialog {
  scene;

  constructor(scene) {
    this.scene = scene;
  }

  createDialog = (message) => {
    const textSource = message;
    const letterCount = textSource.length;
    const text = this.scene.add.text(85, 590, '', {
      fontSize: "55px",
      fill: "#FF0000",
      fontFamily: "Electrolize",
    });

    //this.scene.audio.play("_aud_text_appear")

    this.scene.tweens.addCounter({
      from: 0,
      to: letterCount,
      ease: "Linear",
      onUpdate: function (_, { value }) {
        text.setText(textSource.substr(0, Math.floor(value)));
      },
      duration: letterCount * 150, // Adjust the duration for the desired speed
    });
  };
}
