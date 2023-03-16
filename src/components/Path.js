export default function Path(scene) {
    let PathData;

    function drawDots(x, y, i) {
        var graphics = scene.add.graphics();

        graphics.fillStyle(0xffffff, 1); // Set fill color to blue
        x = x - 13;
        y = y - 10;
        graphics.fillCircle(x, y, 1); // Draw a circle shape at position (x, y) with a radius of 15 pixels
        scene.add.text(x + 2, y, i, { font: "10px Arial", fill: "#ffffff" });
    }
    function drawLine(points) {

        const graphics = scene.add.graphics();

        // define the line color and width
        graphics.lineStyle(2, 0xffffff);
        console.log(points[0].y)
        // move the graphics object to the starting point of the line
        graphics.moveTo(points[0].x, points[0].y);

        // loop through the remaining points in the array and draw lines between them
        for (let i = 1; i < points.length; i++) {
            console.log(points[i])
            graphics.lineTo(points[i].x, points[i].y);
        }

        // render the graphics object
        graphics.strokePath();
    }

    function getAlternateElements(arr) {
        let result = [];
        for (let i = 0; i < arr.length; i += 2) {
            result.push(arr[i]);
        }
        return result;
    }

    function followPath(path, objectToTween) {
        // Create a new tween object

        path.map(pos => {
            
        scene.tweens.add({

            targets: objectToTween,
            x: pos.x,
            y: pos.y,
            ease: 'easing',
            duration: 1500,
            yoyo:true,
            repeat: 0
      
        })
        })
   // Create a tween object that moves the shape through the path

   // convert each object in the 'path' array to a Phaser.Math.Vector2 object
// var pathPoints = path.map(function(point) {
//     return new Phaser.Math.Vector2(point.x, point.y);
//   });
  
//   // create a path using the converted points
//   var path = new Phaser.Curves.Path();
//   path.splineTo(pathPoints);
  
//   // use the FollowPath plugin to make the circle follow the path
//   scene.tweens.add({
//     targets: objectToTween,
//     t: 1,
//     ease: 'Linear',
//     loop: 0,
//     yoyo: false,
//     duration: 50,
//     onComplete: function() {
//       // do something when the tween completes
//     },
//     onUpdate: function(tween, target) {
//       // update the circle's position along the path
//       if(tween.getValue()) {
//         var position = path.getPoint(tween.getValue());
//         console.log(position)
//         target.setPosition(position.x, position.y);
//       }

      
//     }
//   });

  


    }

    this.createPath = function (MappingData) {
        console.log(PathData[0])
        var graphics = scene.add.circle(PathData[0][0].x,PathData[0][0].y,5)

        // Draw a shape
        graphics.setStrokeStyle(1,0x05F9FB)

    
    


   

        
        
        followPath(PathData[0], graphics)

        drawLine(PathData[0])

    };

    function getRectangleMidpoint(x, y, width, height) {
        let midpointX = x + width / 2;
        let midpointY = y + height / 2;
        return { x: midpointX, y: midpointY };
    }

    Object.defineProperty(this, "PathData", {
        get: function () {
            return PathData;
        },
        set: function (value) {
            PathData = value;
        },
    });
}
