/*
/* Javascript for Drawing page
/* simple drawing
/* Feb.14, 2015
/* 
*/

// Make the paper scope global, by injecting it into window
paper.install(window);

var tool1, tool2;

//canvasWH
var width = 800;
var height = 500;

var currentColor = 'black';

window.onload = function(){


    /******************************************************
      _             _                             _ 
     | |__  __ _ __| |____ _ _ _ ___ _  _ _ _  __| |
     | '_ \/ _` / _| / / _` | '_/ _ \ || | ' \/ _` |
     |_.__/\__,_\__|_\_\__, |_| \___/\_,_|_||_\__,_|
                       |___/                   
    ******************************************************/
	// get id from canvas and set up
	var canvas = document.getElementById('myCanvas');
	paper.setup(canvas);

	var path;


	/////////////////////////////////////////////////
	// white background papers
	var rect = new Path.Rectangle([0,0], [ width, height]);
	rect.fillColor = 'white';


	/******************************************************
     _            _    
    | |_ ___  ___| |___
    |  _/ _ \/ _ \ (_-<
     \__\___/\___/_/__/
                        
    ******************************************************/
	// Create drawing tools
	// TOOL 1 = brushline thin
	tool1 = new Tool();
	tool1.onMouseDown = function(event){
		path = new Path();
		path.strokeColor = currentColor;
		path.strokeWidth = 2; // stroke weight
		path.add(event.point);
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
    // tool4.minDistance = 20;
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
    }


    // TOOL 6 = brush end test
    tool6 = new Tool();
  	tool6.minDistance = 10;
    tool6.onMouseDown = function(event){
	   	path = new Path();
		path.strokeColor = '#00000';

		path.add(event.point);
    }
    tool6.onMouseDrag = function(event){
	    path.add(event.point);

		var step = event.delta;
		step.angle += 90;

		var top = event.middlePoint.push(step); //event.middlePoint + step;
		// var bottom = event.middlePoint - step; //event.middlePoint + step;
		
		console.log(top);
		console.log(event.middlePoint);
		console.log(step);

		/*

		middlePoint: Point {x: 373.609375, y: 119}
		step: Point {x: 6.735557395310443e-16, y: 11, _angle: 1.5707963267948966}
		top: { x: 373.60938, y: 119 }{ x: 0, y: 11 }

		middlePoint: Point {x: 915, y: 229.5}
		step: Point {x: -0.9999999999999977, y: 10, _angle: 1.6704649792860584}
		top: Point {x: 914, y: 239.5}
		*/

		var line = new Path();
		line.strokeColor = '#000000';
		line.add(top);
		// line.add(bottom);
    }

    tool6.onMouseUp = function(event){	
    }  

 

    //////////////////////////////////
	// Whenever buttons are pressed

	activateTools("#tool1", tool1);
    activateTools("#tool2", tool2);
    activateTools("#tool3", tool3);
    activateTools("#tool4", tool4);
    activateTools("#tool5", tool5);
    activateTools("#tool6", tool6);


    function activateTools(elements, tool){
    	$(elements).click(function(){
			tool.activate();
		});
    }




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

}
