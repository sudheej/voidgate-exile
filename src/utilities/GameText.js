export default class GameText {
  writeText(scene, x, y, text, fontSize, color = "#00ff00") {
    const add = scene.add;

    WebFont.load({
      google: {
        families: ["Electrolize"],
      },
      active: function () {
        const weapontInventoryTitle = add.text(x, y, text, {
          fontFamily: "Electrolize",
          fontSize: fontSize,
          color: color,
        });
      },
    });
  }
}
