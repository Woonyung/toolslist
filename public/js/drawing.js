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

var currentColor = 'black'; // default is black
var currentWidth = 4; // default is 4


// load the blank paper
$(document).ready(function(){
    // draw the blank canvas
    drawCanvas();

    $("#undo").click(function(){ 
        // delete children one by one
        var pathCount = project.activeLayer.children.length;
        // console.log(project.activeLayer);
        project.activeLayer.removeChildren(pathCount-1,pathCount);
    });   

    $("#clear").click(function(){
        project.activeLayer.removeChildren();
    });


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
        }); // end of ajax
    }); // end of save function
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

var tool0, tool1, tool2, tool3, tool4, 
    tool5, tool6, tool7, tool8,
    tool9, tool10, tool11, tool12;

// Create drawing tools

// ERASER
tool0 = new Tool();
tool0.minDistance = 3;
tool0.onMouseDown = function(event){
    path = new Path({
        strokeColor: 'white',
        strokeJoin : 'round',
        strokeCap :'round',
        strokeWidth: 40 // stroke weight  
    });
}

tool0.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


//////
// TOOL 1 = brushline thin
tool1 = new Tool();

// The minimum distance the mouse has to drag
// before firing the onMouseDrag event,
// since the last onMouseDrag event.
tool1.minDistance = 10;
tool1.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    path.add(event.point);
}
tool1.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// TOOL 2 = brushline thick
tool2 = new Tool();
tool2.minDistance = 3;
tool2.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: 15 // stroke weight  
    });
}

tool2.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// TOOL 3 = dashed line
tool3 = new Tool();
tool3.minDistance = 7;
tool3.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    // make it as dashed line
    path.dashArray = [10, 12]; // 10pt dash and 12pt gap

}

tool3.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}



// TOOL 4 = weird brush with red head
tool4 = new Tool();
tool4.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: 3      
    });
}

tool4.onMouseDrag = function(event){
    path.add(event.point);
}

tool4.onMouseUp = function(event){
    var myCircle = new Path.Circle({
        center: event.point,
        strokeWidth: 1.5,
        strokeColor: 'red',
        fillColor: 'red',
        radius: 10
    });
}

// TOOL 5 = dropping
tool5 = new Tool();
tool5.minDistance = 20;
tool5.onMouseDown = function(event){
    var circle = new Path.Circle({
        center: event.middlePoint/2,
        radius: Math.random()* 10
    });
    circle.fillColor = currentColor;
        
}

tool5.onMouseDrag = function(event) {
    // Use the arcTo command to draw cloudy lines
    // path.arcTo(event.point);
    circle = new Path.Circle({
        center: event.middlePoint,
        radius: Math.random()* 20
    });
    circle.fillColor = currentColor;
}


// TOOL 6 = cloud shape brush
tool6 = new Tool();
tool6.minDistance = 20;
tool6.onMouseDown = function(event){
    path = new Path({
        strokeColor : currentColor,
        strokeWidth : currentWidth,
        strokeJoin : 'round',
        strokeCap :'round'
    });

    path.add(event.point);
}
tool6.onMouseDrag = function(event){
    // use the arcTo command to draw cloudy lines
    path.arcTo(event.point);
}


// TOOL 7 = organic brush
tool7 = new Tool();
tool7.minDistance = 2;
tool7.maxDistance = 15;
tool7.onMouseDown = function(event){
    path = new Path();
    path.fillColor = currentColor;

    path.add(event.point);
}

tool7.onMouseDrag = function(event){
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

tool7.onMouseUp = function(event){
    path.add(event.point);
    path.closed = true;
    path.smooth();
}  


// TOOL 8 = Thick dry brush
var lastPoint;
var strokeEnds = 6;

tool8 = new Tool();
tool8.onMouseDown = function(event){
    tool8.fixedDistance = 30; // stroke

    path = new Path();
    path.fillColor = currentColor;

}
tool8.onMouseDrag = function(event){
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
tool8.onMouseUp = function(event){
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

// TOOL 9 = circles
tool9 = new Tool();
tool9.onMouseDrag = function(event){
    // The radius is the distance between the position
    // where the user clicked and the current position
    // of the mouse.
    var path = new Path.Circle({
        center: event.downPoint,
        radius: (event.downPoint - event.point).length,
        fillColor: 'white',
        strokeColor: 'black',
        strokeWidth: currentWidth
    });

    // Remove this path on the next drag event:
    path.removeOnDrag();
}

// TOOL 10 = vertical shapes
tool10 = new Tool();
tool10.minDistance = 10;

tool10.onMouseDrag = function(event){ 
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    var vector = event.delta;
    vector.angle += 90;

    // length of line
    vector.length = 5;
    
    path.add(event.middlePoint + vector);
    path.add(event.middlePoint - vector);
}

// TOOL 11 = Wave
tool11 = new Tool();
tool11.minDistance = 10;
var values11 = {
    curviness: 0.5,
    distance: tool11.minDistance,
    offset: 10,
    mouseOffset: true
};

tool11.onMouseDown = function(event){
    path = new Path({
        strokeColor: '#000000',
        strokeWidth: currentWidth
    });    
}

var mul = 1;
tool11.onMouseDrag = function(event){ 
    var step = event.delta.rotate(90 * mul);

    if (!values11.mouseOffset)
        step.length = values11.offset;

    path.add({
        point: event.point + step,
        handleIn: -event.delta * values11.curviness,
        handleOut: event.delta * values11.curviness
    });
    mul *= -1;
}


// TOOL 12 = Multi Lines
tool12 = new Tool();
tool12.fixedDistance = 30;

var values12 = {
    lines: 3,
    size: 30,
    smooth: true
};

var paths;

tool12.onMouseDown = function(event){ 
    paths = [];
    for (var i = 0; i < values12.lines; i++) {
        var path = new Path();
        path.strokeColor = currentColor;
        path.strokeWidth = currentWidth;
        paths.push(path);
    }
}

tool12.onMouseDrag = function(event){
    var offset = event.delta;
    offset.angle = offset.angle + 90;
    var lineSize = values12.size / values12.lines;
    for (var i = 0; i < values12.lines; i++) {
        var path = paths[values12.lines - 1 - i];
        offset.length = lineSize * i + lineSize / 2;
        path.add(event.middlePoint + offset);
        path.smooth();
    }
}

//////////////////////////////////
// Whenever buttons are pressed
activateTools("#tool0", tool0);
activateTools("#tool1", tool1);
activateTools("#tool2", tool2);
activateTools("#tool3", tool3);
activateTools("#tool4", tool4);
activateTools("#tool5", tool5);
activateTools("#tool6", tool6);
activateTools("#tool7", tool7);
activateTools("#tool8", tool8);
activateTools("#tool9", tool9);
activateTools("#tool10", tool10);
activateTools("#tool11", tool11);
activateTools("#tool12", tool12);

// WIDTH
activateWidth("#thin", 2);
activateWidth("#medium", 4);
activateWidth("#thick", 6);

function activateTools(elements, tool){
    $(elements).click(function(){
        tool.activate();
    });
}


function activateWidth(element, width){
    $(element).click(function(){
        currentWidth = width;
    });
}