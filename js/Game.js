/********************************************************************************************
** Game.js
** @author Jake Parsons
** Copyright 2016.
**
** -Say a little about yourself
** -Created for Ludum Dare 35
********************************************************************************************/

function Game(debugModeIn) {
	var debugMode = debugModeIn;
	
	PLAYER_STATES = { //i learned from the enum below that although this bubbles up to the top context, it's way easier to use ;3
		NORMAL:		1,
		RABBIT:		2,
		TOAD:		3,
		DOG:		4,
		GUARD:		5,
		CAT:		6,
		BIRD:		7,
		UNUSED:		8
	}
	this.playerState = PLAYER_STATES.NORMAL;
	this.playerStatesUnlocked = [true, false, false, false, false, false, false];
	this.playerItems = [false, false, false]; //dog bone, water bucket, king key
	this.witchAlive = true;
	this.gameComplete = false;
	
	this.requestStateChange = function(newStateIn) {
		switch(newStateIn) {
			case PLAYER_STATES.NORMAL:
				this.playerState = PLAYER_STATES.NORMAL;
				break;
			case PLAYER_STATES.RABBIT:
				if(this.playerStatesUnlocked[1]) { this.playerState = PLAYER_STATES.RABBIT; }
				break;
			case PLAYER_STATES.TOAD:
				if(this.playerStatesUnlocked[2]) { this.playerState = PLAYER_STATES.TOAD; }
				break;
			case PLAYER_STATES.DOG:
				if(this.playerStatesUnlocked[3]) { this.playerState = PLAYER_STATES.DOG; }
				break;
			case PLAYER_STATES.GUARD:
				if(this.playerStatesUnlocked[4]) { this.playerState = PLAYER_STATES.GUARD; }
				break;
			case PLAYER_STATES.CAT:
				if(this.playerStatesUnlocked[5]) { this.playerState = PLAYER_STATES.CAT; }
				break;
			case PLAYER_STATES.BIRD:
				if(this.playerStatesUnlocked[6]) { this.playerState = PLAYER_STATES.BIRD; }
				break;
			default:
				console.error("Invalid new player state requested!");
				break;
		}
	}
	this.determineOutputText = function() { //determine the output text and make any game state changes necessary
		var featureInMyTile = this.gardenMaze[playerI][playerJ].feature;
		var textOut = "";
		switch(featureInMyTile) {
			case "DOG"://this.FEATURES.DOG:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a dog. It looks hungry!";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a dog. It is watching you carefully...";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a dog. It is barking at you!";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a dog. It wags its tail in greeting!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a dog. It seems to think you are its owner.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a dog. It barks and chases you around.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a dog. Its eyes follow you hungrily...";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerItems[0]&&this.playerState===PLAYER_STATES.NORMAL&&!this.playerStatesUnlocked[3]) { 
					textOut += "<br />The hungry dog happily eats the bone.<br />You can now become a DOG!";
					this.playerItems[0] = false; this.playerStatesUnlocked[3] = true;
				}
				break;
			case "GUARD"://this.FEATURES.GUARD:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a guard. She is calling to her dog.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a guard. She watches you idly.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a guard. She seems not to notice you.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a guard. She runs toward you!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a guard. She salutes you.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a guard. She is suspicious of you.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a guard. She whistles to you.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(!this.playerStatesUnlocked[4]&&this.playerState === PLAYER_STATES.DOG) {
					textOut += "<br />The guard is happy she found you!<br />You can now become a GUARD!";
					this.playerStatesUnlocked[4] = true;
				}
				break;
			case "RABBIT"://this.FEATURES.RABBIT:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a rabbit. It's your pet Hermes!";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a rabbit. You rub noses happily.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a rabbit. Hope there are no witches nearby!.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a rabbit. It runs from you to hide in the hedges.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a rabbit. It seems afraid of you.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a rabbit. It runs for the hedges in fear!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a rabbit. It seems not to notice you.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(!this.playerStatesUnlocked[1]) { 
					textOut +="<br />Seeing you pet rabbit, you remember your early transfiguring lessons.<br />You can now become a RABBIT!";
					this.playerStatesUnlocked[1] = true;
				}
				break;
			case "CAT"://this.FEATURES.CAT:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a cat. It purrs and approaches.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a cat. It stalks you hungrily. Best stay clear!";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a cat. It watches in muted interest.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a cat. It hisses and arches its back!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a cat. It purrs and rubs your shin.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a cat. It seems to want to play!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a cat. It leaps at you. Best stay away!";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.DOG&&!this.playerStatesUnlocked[5]) { 
					textOut+="<br />Scarcely able to control yourself, you give chase to the cat - she drops her collar!<br />Inscribed is a spell! You can now become a CAT!";
					this.playerStatesUnlocked[5]=true;
				}
				break;
			case "BIRD"://this.FEATURES.BIRD:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a bird. It sings and flutters in the hedges.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a bird. It goes about its usual business.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a bird. It looks at you placidly.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a bird. It flies to a safe distance.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a bird. It sings from a safe distance.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a bird. It flies well away!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a bird. It chirps happily.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(true) { 
					break;
				}
				break;
			case "WITCH"://this.FEATURES.WITCH:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = this.witchAlive? "Before you is the evil witch. She cackles and flies around you!" : "This is where the witch was!";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = this.witchAlive? "Before you is the evil witch. Don't let her get your tail!" : "This is where the witch was.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = this.witchAlive? "Before you is the evil witch. Don't let her put you in a potion!" : "This is where the witch was.";
						break;
					case PLAYER_STATES.DOG:
						textOut = this.witchAlive? "Before you is the evil witch. Don't let her get your tail!" : "The witch used to be here!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = this.witchAlive? "Before you stands the evil witch. She cackles and casts spells at you!" : "The witch was here once.";
						break;
					case PLAYER_STATES.CAT:
						textOut = this.witchAlive? "Before you stands the evil witch. She thinks you are her pet!" : "You sure showed that witch who's boss!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = this.witchAlive? "Before you stands the evil witch. She cackles menacingly!" : "The witch was once here!";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerItems[1] && this.playerState === PLAYER_STATES.CAT) { 
					textOut+="<br />Approaching as the witch's beloved cat, you get close enough to throw the water!<br />The witch flees! Her spell on the King's cage is gone!";
					this.playerState = PLAYER_STATES.NORMAL;
					this.witchAlive = false;
				}
				break;
			case "BUSH"://this.FEATURES.BUSH:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a bush. You can't fit in. You hear a ribbit from inside.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a bush. You can just fit between its branches!";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a bush. Home sweet home!";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a bush. Doubt there are any rabbits to chase in there.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a bush. Guards don't usually have to worry about these.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a bush. Doubt there are any mice in there to chase.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a bush. This one is too thorny to nest in.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.RABBIT&&!this.playerStatesUnlocked[2]) { 
					textOut+="<br />Entering the bush, you see a magical toad! It teaches you a spell<br />You can now become a TOAD! Still don't think you'll kiss it though!";
					this.playerStatesUnlocked[2]=true;
				}
				break;
			case "GRATE"://this.FEATURES.GRATE:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a grate. There are some bones inside, but your arms are too big too reach.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a grate. It is deep and full of water. You would get stuck down there!";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a grate. Would make a great toad home!";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a grate. You see some tasty bones down there!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a grate. Be careful not to drop your spear down there again!";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a grate. You smell mice, but can't fit between the bars.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a grate. It is too dangerous to fly down there!";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.TOAD&&!this.playerItems[0]) { 
					textOut+="<br />Hopping into the grate, you collect a bone. Not much use to a toad though.";
					this.playerItems[0]=true;
				}
				break;
			case "WELL"://this.FEATURES.WELL:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a well. Magi should be careful of these! Anyway, the lever is stuck.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a well. Best not hop in, you could be stuck for a while!";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a well. It would be nice to relax here.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a well. You remember a friend of yours that rescued a kid here.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a well. Your strength is enough to pull up the water.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a well. You wouldn't want to fall in and get wet.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a well. You could make a nest on top some day.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(!this.playerItems[1]&&this.playerState===PLAYER_STATES.GUARD) { 
					textOut+="<br />With a mighty pull, you haul up a bucket full of water.";
					this.playerItems[1]=true;
				}
				break;
			case "FOUNTAIN"://this.FEATURES.FOUNTAIN:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a fountain. In the top something is shimmering!";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a fountain. The mist is nice. Something glimmers up high.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a fountain. You splash in the bottom, but something glimmers too high to reach.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a fountain. The top sparkles.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a fountain. You toss in a coin. The top is glittering!";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a fountain. You don't like water, but something up top catches your eye.";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a fountain. In the upper pool something is shining!";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.BIRD&&!this.playerItems[2]) { 
					textOut+="<br />Perching on the top, you find a large key!";
					this.playerItems[2]=true;
				}
				break;
			case "CAGE"://this.FEATURES.CAGE:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - it is locked!";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - you can't reach the lock to let him out!";
						break;
					case PLAYER_STATES.TOAD:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - you can't reach the lock to let him out!";
						break;
					case PLAYER_STATES.DOG:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - he asks if you've seen the court mage!";
						break;
					case PLAYER_STATES.GUARD:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - he asks you to bring the court mage.";
						break;
					case PLAYER_STATES.CAT:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - the lock is too high for you to reach!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = (this.witchAlive)? "The king's cage is here - the witch's magic is too strong to approach!" : "The king's cage is here - you perch on top but are too weak to open the lock.";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.NORMAL&&this.playerItems[2]) { 
					textOut+="<br />You use the key to let out the king!<br />Congratulations! A royal banquet is in order! GAME OVER";
				}
				break;
			case "BIRDHOUSE"://this.FEATURES.BIRDHOUSE:
				switch(this.playerState) {
					case PLAYER_STATES.NORMAL:
						textOut = "Before you is a birdhouse. It is too high to reach.";
						break;
					case PLAYER_STATES.RABBIT:
						textOut = "Before you is a birdhouse. You can't jump high enough to reach.";
						break;
					case PLAYER_STATES.TOAD:
						textOut = "Before you is a birdhouse. These are of little use to toads.";
						break;
					case PLAYER_STATES.DOG:
						textOut = "Before you is a birdhouse. A crow squawks at you.";
						break;
					case PLAYER_STATES.GUARD:
						textOut = "Before you is a birdhouse. You can't reach it.";
						break;
					case PLAYER_STATES.CAT:
						textOut = "Before you is a birdhouse. Usually there's something good inside!";
						break;
					case PLAYER_STATES.BIRD:
						textOut = "Before you is a birdhouse. Its rude occupant refuses to let you in. You wish you could teach him a lesson!";
						break;
					default:
						console.error("Invalid player state given to text generator!");
						break;
				}
				if(this.playerState===PLAYER_STATES.CAT&&!this.playerStatesUnlocked[6]) { 
					textOut+="<br />You climb in and pretend to chase the rude bird inside. He offers to teach you a spell to leave!<br />You can now become a BIRD!";
					this.playerStatesUnlocked[6]=true;
				}
				break;
			case "NONE":
				textOut=null;
				break;
			case 13://why is this different than "NONE"?
				textOut=null;
				break;
			default:
				console.error("Invalid feature requested by text generator logic!");
				break;
		}
		return textOut;
	}
	
	//MAZE STUFF
	this.gardenMaze = [];
	var mazeSize = 8; this.getMazeSize = function() { return mazeSize; }
	var playerI = mazeSize-1; var playerJ = 0; var playerCardn = 1;
	
	this.FEATURES = {
		DOG:		1,
		GUARD:		2,
		CAT:		3,
		BIRD:		4,
		WITCH:		5,
		BUSH:		6,
		GRATE:		7,
		WELL:		8,
		FOUNTAIN:	9,
		CAGE:		10,
		BIRDHOUSE:	11,
		RABBIT:		12,
		NONE:		13
	}
	
	function GardenMazeCell(featsIn) {
		var exits = [false, false, false, false]; //N,E,S,W --- I know, I know I really should have used an enum here. oops
		this.feature = featsIn.NONE;
		this.isEntrance = false; this.isExit = false;
		this.explored = false; //TODO SET THIS TO FALSE TO OBSCURE THE MAZE INITIALLY
		this.generated = false; //used by the maze generation algo
		this.setExit = function(exitIndex) {
			switch(exitIndex){
				case 0: //NORTH
					exits[0] = true;
					break;
				case 1: //EAST
					exits[1] = true;
					break;
				case 2: //SOUTH
					exits[2] = true;
					break;
				case 3: //WEST
					exits[3] = true;
					break;
				default: //ERROR
					console.error("Invalid cell exit requested!");
					break;
			}
		}
		this.getExits = function(){
			return exits;
		}
	}
	
	var generateGardenMaze = function(ftrIn) {
		var myMaze = [];
		var featureIndices = [];
		//internal methods
		var visitCell = function(tgtI, tgtJ) {
			myMaze[tgtI][tgtJ].generated = true; //mark the current cell generated
			var possibleDirections = []; //make a list of directions we can go in
			if(tgtI > 0) { 
				possibleDirections.push(0);
			} //can we go north?
			if(tgtJ < mazeSize-1) { 
				possibleDirections.push(1);
			} //can we go east?
			if(tgtI < mazeSize-1) {
				possibleDirections.push(2);
			} //can we go south?
			if(tgtJ > 0) {
				possibleDirections.push(3);
			} //can we go west?
			//while there are remaining cells, choose the next one and continue
			while(possibleDirections.length > 0) {
				var chosenDirectnIndx = Math.floor( Math.random()*possibleDirections.length ); //choose the direction to go in
				var chosenDirectn = possibleDirections[chosenDirectnIndx];
				possibleDirections.splice(chosenDirectnIndx, 1);
				switch(chosenDirectn) {//visit the next cell:
					case 0: //N
						if( myMaze[tgtI-1][tgtJ].generated ) { break; }
						myMaze[tgtI][tgtJ].setExit(0);//set the outgoing exit from this cell
						myMaze[tgtI-1][tgtJ].setExit(2);//set the incoming exit to the next cell
						visitCell(tgtI-1, tgtJ); //visit the next cell
						break;
					case 1: //E
						if( myMaze[tgtI][tgtJ+1].generated ) { break; }
						myMaze[tgtI][tgtJ].setExit(1);//set the outgoing exit from this cell
						myMaze[tgtI][tgtJ+1].setExit(3);//set the incoming exit to the next cell
						visitCell(tgtI, tgtJ+1); //visit the next cell
						break;
					case 2: //S
						if( myMaze[tgtI+1][tgtJ].generated ) { break; }
						myMaze[tgtI][tgtJ].setExit(2);//set the outgoing exit from this cell
						myMaze[tgtI+1][tgtJ].setExit(0);//set the incoming exit to the next cell
						visitCell(tgtI+1, tgtJ); //visit the next cell
						break;
					case 3: //W
						if( myMaze[tgtI][tgtJ-1].generated ) { break; }
						myMaze[tgtI][tgtJ].setExit(3);//set the outgoing exit from this cell
						myMaze[tgtI][tgtJ-1].setExit(1);//set the incoming exit to the next cell
						visitCell(tgtI, tgtJ-1); //visit the next cell
						break;
					default:
						console.error("Invalid target garden maze cell requested!");
						break;
				}
			}
		}
		
		//populate the maze with new GardenMazeCell
		myMaze = [];
		for(var i = 0; i < mazeSize; i=i+1) {
			var mazeRow = [];
			for(var j = 0; j < mazeSize; j=j+1) {
				mazeRow.push( new GardenMazeCell(ftrIn) );
				var thisCellAddr = [i, j];
				featureIndices.push(thisCellAddr);
			}
			myMaze.push(mazeRow);
		}
		//add the entrance and exit
		myMaze[(mazeSize-1)][0].isEntrance = true;
		myMaze[0][(mazeSize-1)].isExit = true;
		//recursively generate the maze based on the new cells
		var startCellX = Math.floor( Math.random()*mazeSize ); var startCellY = Math.floor( Math.random()*mazeSize );
		visitCell(startCellX, startCellY); //NOTE: this algorithm is recursive and will generate the whole maze now.
		//populate cells with features
		var featureKeys = Object.keys(ftrIn).sort(function(a,b){
			return ftrIn[a]-ftrIn[b];
		});
		for(var i = 0; i < 13; i=i+1) {
			var nextIndx = Math.floor( Math.random() * featureIndices.length );//choose the cell to place the object
			var cellAddr = featureIndices[nextIndx];
			featureIndices.splice(nextIndx, 1);//pop that cell from the list of available cells
			//populate that cell with the object
			myMaze[ cellAddr[0] ][ cellAddr[1] ].feature = featureKeys[i];
		}
		return myMaze;
	}
	
	this.rotatePlayerCw = function() {
		playerCardn = (playerCardn+1)%4;
	}
	
	
	this.rotatePlayerCcw = function() {
		if(playerCardn === 0) { playerCardn = 3; }
		else { playerCardn=playerCardn-1; }
	}
	
	this.playerAdvance = function() {
		var possibleExits = this.gardenMaze[playerI][playerJ].getExits();
		switch(playerCardn) {
			case 0: //N
				if(possibleExits[0]) { playerI = playerI-1; }
				break;
			case 1: //E
				if(possibleExits[1]) { playerJ = playerJ+1; }
				break;
			case 2: //S
				if(possibleExits[2]) { playerI = playerI+1; }
				break;
			case 3: //W
				if(possibleExits[3]) { playerJ = playerJ-1; }
				break;
			default:
				console.error("Invalid player cardinality! Can't make the requested move");
		}
		var posArr = [playerI, playerJ, playerCardn];
		return posArr;
	}
	
	this.playerRetreat = function() {
		this.rotatePlayerCw(); this.rotatePlayerCw();
		this.playerAdvance();
		this.rotatePlayerCw(); this.rotatePlayerCw();
	}
	
	this.getPosition = function() {
		var posArr = [playerI, playerJ, playerCardn];
		return posArr;
	}
	
	//set up the game, called when initializing
	this.init = function() {
		this.gardenMaze = generateGardenMaze(this.FEATURES);
		var wastealine = 6;
	}
	
	//init(); //TODO remove this and put it in an init wrapper that gets called more intelligently TODO
}