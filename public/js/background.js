/*
/* Javascript for first index page
/* background -- stars??
/* Feb.23, 2015
/* 
*/
// Make the paper scope global, by injecting it into window
paper.install(window);

window.onload = function(){
	// get id from canvas and set up
	var canvas = document.getElementById('backgroundCanvas');
	paper.setup(canvas);

	///// draw stars
	// number of stars that I am going to make
	var count = 150;

	// star symbol
	var path = new Path.Circle({
		radius: 4,
		fillColor: 'white',
	});
	var star = new Symbol(path);

	// Distribute
	for ( var i = 0; i < count; i++){
		console.log(view.size);
		// Place two instances of the symbol:
		var placedSymbol = star.place(new Point(view.size._width * Math.random(), view.size.height * Math.random()));
		placedSymbol.scale(i/ count);
	}

}
