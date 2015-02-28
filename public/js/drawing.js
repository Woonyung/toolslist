/*
/* Javascript for Drawing page
/* Change into paperscript !
/* Feb.28, 2015
/* 
*/

//canvasWH
var width = 800;
var height = 500;

var path;
var frame;

var currentColor = 'black';


// load the blank paper
$(document).ready(function(){
    // draw the blank canvas
    drawCanvas();

    ///////////////////////////////////////////////
    // SAVE FUNCTION
    $('#save').click(function(){
        var imageString = canvas.toDataURL();
        var dataToSave = {
            Date: new Date(),
            imageData: imageString
        }

        $.ajax({
            url:'/submitDrawing',
            contentType: 'application/json',
            type: "POST",
            data: JSON.stringify(dataToSave),
            error: function(data){
                console.log(data.status);
            },
            success: function(data){
                //JSON.parse(data);
                console.log(data);

                // clear the canvas
                // paper.project.activeLayer.removeChildren();

                //Send them to the gallery
                document.location.href = '/gallery';

            }
        });
    });
});


////////////////////////////////////////////////////
// BACKGROUND //
////////////////////////////////////////////////////

// get id from canvas and set up
var canvas = document.getElementById('myCanvas');
function drawCanvas(){
    frame = new Path.Rectangle({
        point: [0,0],
        size: [width, height ],
        fillColor: 'white'
    });
}


////////////////////////////////////////////////////
// TOOLS //
////////////////////////////////////////////////////

var tool1, tool2, tool3, tool4, tool5, tool6, tool7;

// Create drawing tools
// TOOL 1 = brushline thin
tool1 = new Tool();
tool1.onMouseDown = function(event){
    path = new Path();
    path.strokeColor = currentColor;
    path.strokeWidth = 2; // stroke weight
    path.add(event.point);
    console.log("TOOL 1");
}
tool1.onMouseDrag = function(event){
    path.add(event.point);
}


// TOOL 2 = brushline thick
tool2 = new Tool();
tool2.onMouseDown = function(event){
    path = new Path();
    path.strokeColor = currentColor;
    path.strokeWidth = 10; // stroke weight
    path.add(event.point);
}

tool2.onMouseDrag = function(event){
    path.add(event.point);
    console.log("TOOL 2");
}

// TOOL 3 = weird brush with red head
tool3 = new Tool();
tool3.onMouseDown = function(event){
    path = new Path();
    path.strokeColor = currentColor;
    path.strokeWidth = 3;
}
tool3.onMouseDrag = function(event){
    path.add(event.point);
    console.log("TOOL 3");
}
tool3.onMouseUp = function(event){
    var myCircle = new Path.Circle({
        center: event.point,
        strokeWidth: 1.5,
        strokeColor: 'red',
        fillColor: 'red',
        radius: 10
    });
}

// TOOL 4 = dropping
tool4 = new Tool();
tool4.minDistance = 20;
tool4.onMouseDown = function(event){
    currentTool = tool4;
    var circle = new Path.Circle({
        center: event.middlePoint/2,
        radius: Math.random()* 10
    });
    circle.fillColor = currentColor;
        
}

tool4.onMouseDrag = function(event) {
    // Use the arcTo command to draw cloudy lines
    // path.arcTo(event.point);
    circle = new Path.Circle({
        center: event.middlePoint,
        radius: Math.random()* 20
    });
    console.log("TOOL 4");
    circle.fillColor = currentColor;
}


// TOOL 5 = cloud shape brush
tool5 = new Tool();
tool5.minDistance = 20;
tool5.onMouseDown = function(event){
    path = new Path();
    path.strokeColor = currentColor;
    path.strokeWidth = 1;
    path.add(event.point);
}
tool5.onMouseDrag = function(event){
    // use the arcTo command to draw cloudy lines
    path.arcTo(event.point);
    console.log("TOOL 5");
}


// TOOL 6 = brush end test
tool6 = new Tool();
tool6.minDistance = 2;
tool6.maxDistance = 15;
tool6.onMouseDown = function(event){
    path = new Path();
    path.strokeColor = '#00000';
    path.add(event.point);
}

tool6.onMouseDrag = function(event){
    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    // Every drag event, add a segment
    // to the path at the position of the mouse:
    path.add(top);
    path.insert(0, bottom);
    path.smooth();

}

tool6.onMouseUp = function(event){
    path.add(event.point);
    path.closed = true;
    path.smooth();
}  


// TOOL 7 = brush end
var lastPoint;
var strokeEnds = 6;

tool7 = new Tool();
tool7.onMouseDown = function(event){
    // BRUSH 2
    tool.fixedDistance = 50;

    path = new Path();
    path.fillColor = currentColor;

}
tool7.onMouseDrag = function(event){
    // If this is the first drag event,
    // add the strokes at the start:
    if(event.count == 1) {
        addStrokes(event.middlePoint, event.delta * -1);
    } else {
        var step = event.delta / 2;
        step.angle += 90;

        var top = event.middlePoint + step;
        var bottom = event.middlePoint - step;

        path.add(top);
        path.insert(0, bottom);
    }
    path.smooth();            
    lastPoint = event.middlePoint;
}
tool7.onMouseUp = function(event){
    var delta = event.point - lastPoint;
    delta.length = tool.maxDistance;
    addStrokes(event.point, delta);
    path.closed = true;
    path.smooth();
}

function addStrokes(point, delta) {
    var step = delta.rotate(90);
    var strokePoints = strokeEnds * 2 + 1;
    point -= step / 2;
    step /= strokePoints - 1;
    for(var i = 0; i < strokePoints; i++) {
        var strokePoint = point + step * i;
        var offset = delta * (Math.random() * 0.2 + 0.1);
        if(i % 2) {
            offset *= -1;
        }
        strokePoint += offset;
        path.insert(0, strokePoint);
    }
}

//////////////////////////////////
// Whenever buttons are pressed
activateTools("#tool1", tool1);
activateTools("#tool2", tool2);
activateTools("#tool3", tool3);
activateTools("#tool4", tool4);
activateTools("#tool5", tool5);
activateTools("#tool6", tool6);
activateTools("#tool7", tool7);


function activateTools(elements, tool){
    $(elements).click(function(){
        tool.activate();
    });
}

