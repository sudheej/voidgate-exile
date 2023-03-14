export default function Path() {
    let PathData;

    this.createPath = function(MappingData) {
        PathData = MappingData
        for (let i = 0; i < MappingData.length; i++) {

        let midpoints = MappingData[i].map(rectangle => {
            if (rectangle.type === "plain") {
                return;
            }
            else {
            return getRectangleMidpoint(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            }
        
          });
          
          // Output the midpoints to the console
          midpoints.forEach((midpoint, i) => {
            if (midpoint) {
                console.log("Midpoint of rectangle " + i + ": (" + midpoint.x + ", " + midpoint.y + ")");
            }
         
          });

        }
    
    }

    function getRectangleMidpoint(x, y, width, height) {
        let midpointX = x + width / 2;
        let midpointY = y + height / 2;
        return { x: midpointX, y: midpointY };
      }


    Object.defineProperty(this, "PathData", {
        get: function () {
          return PathData;
        },
      });
    
}