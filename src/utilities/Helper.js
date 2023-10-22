export default class Helper {
  calculateRadius(height, width) {
    // Compute the radius as half of the larger dimension
    const largerDimension = Math.max(height, width);
    const radius = largerDimension / 2;

    return radius;
  }
  adjustShade(hexColor, incrementAmount) {
    incrementAmount = Math.min(255, Math.max(-255, incrementAmount));

    const red = (hexColor >> 16) & 0xff;
    const green = (hexColor >> 8) & 0xff;
    const blue = hexColor & 0xff;

    const newRed = Math.max(0, Math.min(255, red + incrementAmount));
    const newGreen = Math.max(0, Math.min(255, green + incrementAmount));
    const newBlue = Math.max(0, Math.min(255, blue + incrementAmount));

    const adjustedColor = (newRed << 16) | (newGreen << 8) | newBlue;

    return adjustedColor;
  }
}
