export default class Helper {
    calculateRadius(height, width) {
        // Compute the radius as half of the larger dimension
        const largerDimension = Math.max(height, width);
        const radius = largerDimension / 2;
      
        return radius;
      }
}