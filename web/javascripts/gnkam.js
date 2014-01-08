var agendaetudiantEasterEgg = agendaetudiantEasterEgg || {};
agendaetudiantEasterEgg.trueCombinaison = [
	38,
	38,
	40,
	40,
	37,
	39,
	37,
	39,
	65,
	66
];
agendaetudiantEasterEgg.combinaison = [];
agendaetudiantEasterEgg.listen = true;
agendaetudiantEasterEgg.pupup = false;
$(document).ready(function(){
	$(document).keydown(function(e){
		if(agendaetudiantEasterEgg.listen){
			agendaetudiantEasterEgg.combinaison.push(e.which);
			for(key in agendaetudiantEasterEgg.combinaison)
			{
				if(agendaetudiantEasterEgg.combinaison[key] != agendaetudiantEasterEgg.trueCombinaison[key])
				{
					agendaetudiantEasterEgg.combinaison = [];
					break;
				}
			}
			if(agendaetudiantEasterEgg.combinaison.length === agendaetudiantEasterEgg.trueCombinaison.length)
			{
				agendaetudiantEasterEgg.combinaison = [];
				agendaetudiantEasterEgg.launch();
				agendaetudiantEasterEgg.listen = false;
			}
		}
	});

});

agendaetudiantEasterEgg.launch = function()
{
	$("#modal").html('<div class="modal fade" id="modalSnake" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
	<div class="modal-dialog">\
		<div class="modal-content">\
		<div class="modal-header">\
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
			<h4 class="modal-title" id="myModalLabel">Snake</h4>\
		</div>\
		<div id="ae-snk" class="modal-body"></div>\
		<div class="modal-footer">\
			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
		</div>\
		</div><!-- /.modal-content -->\
	</div><!-- /.modal-dialog -->\
	</div><!-- /.modal -->');
	agendaetudiantSnake.launch('#ae-snk', 50, 40);
	$('#modalSnake').on('hidden.bs.modal', function (e) {
		agendaetudiantEasterEgg.listen = true;
		agendaetudiantSnake.stop();
	})
	$('#modalSnake').modal();
}

var agendaetudiantSnake = agendaetudiantSnake || {};
agendaetudiantSnake.selector = "#snake";
agendaetudiantSnake.columns = 42;
agendaetudiantSnake.lines = 42;
agendaetudiantSnake.snake = {};
agendaetudiantSnake.started = false;
agendaetudiantSnake.position = "up";
agendaetudiantSnake.apple = {i:0,j:0};
agendaetudiantSnake.concurrencePosition = "up";
agendaetudiantSnake.defaultSpeed= 50;
agendaetudiantSnake.speed= agendaetudiantSnake.defaultSpeed;
agendaetudiantSnake.listenning = false;


agendaetudiantSnake.launch = function(selector, columns, lines){
	agendaetudiantSnake.listenning = true;
	agendaetudiantSnake.selector = selector || agendaetudiantSnake.selector;
	agendaetudiantSnake.columns = columns || agendaetudiantSnake.columns;
	agendaetudiantSnake.lines = lines || agendaetudiantSnake.lines;
	agendaetudiantSnake.initPositions();
	agendaetudiantSnake.initPlateau();
	agendaetudiantSnake.initSnake();
	agendaetudiantSnake.randomApple();
	agendaetudiantSnake.draw();
	agendaetudiantSnake.drawAppleToCanvas();
	agendaetudiantSnake.drawSnakeToCanvas();
	agendaetudiantSnake.listen();
}

agendaetudiantSnake.stop = function()
{
	agendaetudiantSnake.gameover();
	agendaetudiantSnake.listenning = false;
	$(agendaetudiantSnake.selector).html('');
}

agendaetudiantSnake.initPositions = function(){
	agendaetudiantSnake.concurrencePosition = "up";
	agendaetudiantSnake.position = "up";
}

agendaetudiantSnake.debug = function(text)
{
	$("#debug").text(text);
}

agendaetudiantSnake.randomApple = function()
{
	agendaetudiantSnake.apple.i = Math.floor((Math.random()*agendaetudiantSnake.lines));
	agendaetudiantSnake.apple.j = Math.floor((Math.random()*agendaetudiantSnake.columns));
}

agendaetudiantSnake.run = function()
{
	setTimeout(function(){
		agendaetudiantSnake.concurrencePosition = agendaetudiantSnake.position;
		agendaetudiantSnake.move();
		if(agendaetudiantSnake.started)
		{
			agendaetudiantSnake.run();
		}
	},agendaetudiantSnake.speed);
}
agendaetudiantSnake.increaseSpeed = function()
{
	if(agendaetudiantSnake.speed - 1 > 1)
	{
		agendaetudiantSnake.speed--;
	}
}

agendaetudiantSnake.listen = function()
{
	$(document).keydown(function(e){
		if(agendaetudiantSnake.listenning)
		{
			// Start when arrow key is pressed
			if(e.which >= 37 && e.which <= 40 && !agendaetudiantSnake.started){
				agendaetudiantSnake.pause();
			}
			switch(e.which)
			{
				case 40:
					if(agendaetudiantSnake.concurrencePosition != "up")
					{
						agendaetudiantSnake.position = "down";
					}
					break;
				case 39:
					if(agendaetudiantSnake.concurrencePosition != "left")
					{
						agendaetudiantSnake.position = "right";
					}
					break;
				case 38:
					if(agendaetudiantSnake.concurrencePosition != "down")
					{
						agendaetudiantSnake.position = "up";
					}
					break;
				case 37:
					if(agendaetudiantSnake.concurrencePosition != "right")
					{
						agendaetudiantSnake.position = "left";
					}
					break;
				case 32:
					agendaetudiantSnake.pause();
					break;
			}
		}
	});
}

agendaetudiantSnake.pause = function()
{
	agendaetudiantSnake.started = !agendaetudiantSnake.started;
	if(agendaetudiantSnake.started)
	{
		agendaetudiantSnake.run();
	}
}

agendaetudiantSnake.move = function()
{

	agendaetudiantSnake.removeSnakeFromCanvas();
	window["agendaetudiantSnake"][agendaetudiantSnake.position]();
	agendaetudiantSnake.checkCollisions();
	agendaetudiantSnake.drawAppleToCanvas();
	agendaetudiantSnake.drawSnakeToCanvas();
}

agendaetudiantSnake.checkCollisions = function()
{
	// Bord de l'écran
	if(agendaetudiantSnake.snake[0].i < 0 ||
			agendaetudiantSnake.snake[0].j < 0 ||
			agendaetudiantSnake.snake[0].i >= agendaetudiantSnake.lines ||
			agendaetudiantSnake.snake[0].j >= agendaetudiantSnake.columns
	)
	{
		agendaetudiantSnake.gameover();
	}
	agendaetudiantSnake.checkEatSnake();
	agendaetudiantSnake.checkEatApple();
}

agendaetudiantSnake.checkEatApple = function()
{
	if(
		agendaetudiantSnake.apple.i == agendaetudiantSnake.snake[0].i &&
		agendaetudiantSnake.apple.j == agendaetudiantSnake.snake[0].j
	)
	{
		agendaetudiantSnake.snakeAddPart(agendaetudiantSnake.apple.i, agendaetudiantSnake.apple.j);
		agendaetudiantSnake.increaseSpeed();
		agendaetudiantSnake.randomApple();
	}
}

agendaetudiantSnake.checkEatSnake = function()
{
	var eatSnake = false;
	var i = 0;
	var j = 0;
	for(key in agendaetudiantSnake.snake)
	{
		var element = agendaetudiantSnake.snake[key];
		if(key == 0)
		{
			i = element.i;
			j = element.j;
		}
		else
		{
			if(element.i == i && element.j == j)
			{
				eatSnake = true;
			}
		}
	}
	if(eatSnake)
	{
		agendaetudiantSnake.gameover();
	}
}

agendaetudiantSnake.snakeAddPart = function(i,j)
{
	agendaetudiantSnake.snake.push({ i:i, j:j });
}

agendaetudiantSnake.gameover = function()
{
	agendaetudiantSnake.started = false;
	agendaetudiantSnake.speed = agendaetudiantSnake.defaultSpeed;
	agendaetudiantSnake.initPositions();
	agendaetudiantSnake.initSnake();
}

agendaetudiantSnake.initPlateau = function()
{
	
	var milieu = {
		i:Math.floor(agendaetudiantSnake.lines / 2),
		j:Math.floor(agendaetudiantSnake.columns / 2)
	}
	
	
	
	// Plateau
	agendaetudiantSnake.plateau = new Array();
	for(var i = 0; i < agendaetudiantSnake.lines; i++)
	{
		agendaetudiantSnake.plateau[i] = new Array();
		for(var j = 0; j < agendaetudiantSnake.columns; j++)
		{
			agendaetudiantSnake.plateau[i][j] = 'placement';
		}
	}
}

agendaetudiantSnake.initSnake = function()
{
	var milieu = {
		i: Math.floor(agendaetudiantSnake.lines / 2),
		j: Math.floor(agendaetudiantSnake.columns / 2)
	}
	agendaetudiantSnake.snake = [
		{
			i:milieu.i-1,
			j:milieu.j
		},
		{
			i:milieu.i,
			j:milieu.j
		},
		{
			i:milieu.i+1,
			j:milieu.j
		}
	];
}

agendaetudiantSnake.getPlateau = function()
{
	var plateau = new Array();
	
	for(var i = 0; i<agendaetudiantSnake.lines; i++)
	{
		plateau[i] = new Array();
		for(var j = 0; j<agendaetudiantSnake.columns; j++)
		{
			plateau[i][j] = agendaetudiantSnake.plateau[i][j];
		}
	}
	// Show snake;
	for(var key in agendaetudiantSnake.snake)
	{
		var part = agendaetudiantSnake.snake[key];
		plateau[part.i][part.j] = "snake";
	}
	return plateau;
}

agendaetudiantSnake.up = function()
{
	var prec = {i:null, j:null};
	var current = {i:null, j:null};
	for(var key in agendaetudiantSnake.snake)
	{
		current =  {
			i : agendaetudiantSnake.snake[key].i,
			j : agendaetudiantSnake.snake[key].j
		};
		if(prec.j === null || prec.i === null)
		{
			agendaetudiantSnake.snake[key].i--;
		}
		else{
			agendaetudiantSnake.snake[key].i = prec.i;
			agendaetudiantSnake.snake[key].j = prec.j;
		}
		prec.i = current.i;
		prec.j = current.j;
	}
}

agendaetudiantSnake.down = function()
{
	var prec = {i:null, j:null};
	var current = {i:null, j:null};
	for(var key in agendaetudiantSnake.snake)
	{
		current =  {
			i : agendaetudiantSnake.snake[key].i,
			j : agendaetudiantSnake.snake[key].j
		};
		if(prec.j === null || prec.i === null)
		{
			agendaetudiantSnake.snake[key].i++;
		}
		else{
			agendaetudiantSnake.snake[key].i = prec.i;
			agendaetudiantSnake.snake[key].j = prec.j;
		}
		prec.i = current.i;
		prec.j = current.j;
	}
}

agendaetudiantSnake.right = function()
{
	var prec = {i:null, j:null};
	var current = {i:null, j:null};
	for(var key in agendaetudiantSnake.snake)
	{
		current =  {
			i : agendaetudiantSnake.snake[key].i,
			j : agendaetudiantSnake.snake[key].j
		};
		if(prec.j === null || prec.i === null)
		{
			agendaetudiantSnake.snake[key].j++;
		}
		else{
			agendaetudiantSnake.snake[key].i = prec.i;
			agendaetudiantSnake.snake[key].j = prec.j;
		}
		prec.i = current.i;
		prec.j = current.j;
	}
}

agendaetudiantSnake.left = function()
{
	var prec = {i:null, j:null};
	var current = {i:null, j:null};
	for(var key in agendaetudiantSnake.snake)
	{
		current =  {
			i : agendaetudiantSnake.snake[key].i,
			j : agendaetudiantSnake.snake[key].j
		};
		if(prec.j === null || prec.i === null)
		{
			agendaetudiantSnake.snake[key].j--;
		}
		else{
			agendaetudiantSnake.snake[key].i = prec.i;
			agendaetudiantSnake.snake[key].j = prec.j;
		}
		prec.i = current.i;
		prec.j = current.j;
	}
}

agendaetudiantSnake.removeSnakeFromCanvas = function()
{
	for(var key in agendaetudiantSnake.snake)
	{
		var element = agendaetudiantSnake.snake[key];
		$("#snk-"+element.i+"-"+element.j).attr("class", "placement");
	}
}

agendaetudiantSnake.drawSnakeToCanvas = function()
{
	for(var key in agendaetudiantSnake.snake)
	{
		var element = agendaetudiantSnake.snake[key];
		$("#snk-"+element.i+"-"+element.j).attr("class", "snake");
	}
}

agendaetudiantSnake.drawAppleToCanvas = function()
{
	$("#snk-"+agendaetudiantSnake.apple.i+"-"+agendaetudiantSnake.apple.j).attr("class", "pomme");
}

agendaetudiantSnake.draw = function()
{
// 	var plateau = agendaetudiantSnake.getPlateau();
	var table = $('<table class="ae-snake"></table>');
	for(var i = 0; i < agendaetudiantSnake.lines; i++)
	{
		var line = $('<tr></tr>');
	
		for(var j = 0; j < agendaetudiantSnake.columns; j++)
		{
			line.append('<td id="snk-'+i+'-'+j+'" class="'+agendaetudiantSnake.plateau[i][j]+'" ></td>');
		}
		table.append(line);
	}
	$(agendaetudiantSnake.selector).html(table);
}