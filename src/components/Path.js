export default function Path(scene) {
    let PathData;

    function drawDots(x, y, i) {
        var graphics = scene.add.graphics();



        graphics.fillStyle(0xffffff, 1); // Set fill color to blue
        x = x - 13
        y = y - 10
        graphics.fillCircle(x, y, 1); // Draw a circle shape at position (x, y) with a radius of 15 pixels
        scene.add.text(x + 2, y, i, { font: '10px Arial', fill: '#ffffff' });

    }
    function drawLine(points) {
        const graphics = scene.add.graphics();
    
        // define the line color and width
        graphics.lineStyle(2, 0xFFFFFF);
    
        // move the graphics object to the starting point of the line
        graphics.moveTo(points[0].x, points[0].y);
    
        // loop through the remaining points in the array and draw lines between them
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
    
        // render the graphics object
        graphics.strokePath();
    }

    function getPath(start, end, coordinates) {
        // Initialize an empty array to store the path coordinates
        let path = [];

        // Add the start coordinate to the path array
        path.push(start);

        // Find the vertical and horizontal coordinates of the start and end points
        let startX = start.x;
        let startY = start.y;
        let endX = end.x;
        let endY = end.y;

        // Find the direction of the path (horizontal or vertical)
        let direction = startX === endX ? 'vertical' : 'horizontal';

        // Sort the coordinates based on the direction of the path
        let sortedCoordinates = coordinates.sort((a, b) => {
            if (direction === 'horizontal') {
                return a.x - b.x;
            } else {
                return a.y - b.y;
            }
        });

        // Find the start and end indices of the path in the sorted coordinates
        let startIndex = sortedCoordinates.findIndex(coord => {
            return direction === 'horizontal' ? coord.x === startX && coord.y === startY : coord.x === startX && coord.y === startY;
        });

        let endIndex = sortedCoordinates.findIndex(coord => {
            return direction === 'horizontal' ? coord.x === endX && coord.y === endY : coord.x === endX && coord.y === endY;
        });

        // Add the coordinates between the start and end indices to the path array
        if (startIndex < endIndex) {
            path.push(...sortedCoordinates.slice(startIndex + 1, endIndex + 1));
        } else {
            path.push(...sortedCoordinates.slice(endIndex, startIndex).reverse());
        }

        // Add the end coordinate to the path array
        path.push(end);

        return path;
    }


    this.createPath = function (MappingData) {
        PathData = MappingData;
        let coordinates = []
        for (let i = 0; i < MappingData.length; i++) {
            let midpoints = MappingData[i].map((rectangle) => {
                if (rectangle.type === "plain") {
                    return;
                } else {
                    return getRectangleMidpoint(
                        rectangle.x,
                        rectangle.y,
                        rectangle.width,
                        rectangle.height
                    );
                }
            });

            // Output the midpoints to the console

            midpoints.forEach((midpoint, i) => {
                if (midpoint) {
                    console.log(
                        "Midpoint of rectangle " +
                        i +
                        ": (" +
                        midpoint.x +
                        ", " +
                        midpoint.y +
                        ")"
                    );
                    coordinates.push({ x: midpoint.x, y: midpoint.y })
                    drawDots(midpoint.x, midpoint.y, i)
                }
            });
        }

        const startCoord = { x: 187.5, y: 112.5 };
        const endCoord = { x: 587.5, y: 487.5 };

        console.log(getPath(startCoord, endCoord, coordinates));
        drawLine(getPath(startCoord, endCoord, coordinates))

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
    });
}
