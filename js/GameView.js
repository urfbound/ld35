/********************************************************************************************
** GameView.js
** @author Jake Parsons
** Copyright 2016.
**
** -Say a little about yourself
** -Created for Ludum Dare 35
********************************************************************************************/

function GameView(debugModeIn) {
	//set variables
	var CNVS_ID = 'ldgamecanvas';
	var CNVS_DIV_ID = 'ldgamecanvasdiv'; var CNVS_DIV_CLASS = 'game'; var TXTAREA_ID = 'text';
	var CNVS_MIN_WIDTH = 45; var CNVS_MIN_HEIGHT = 25;
	var dbgMd = debugModeIn;
	var viewCanvasDiv; //canvas div elements
	var viewCanvas; var viewContext; var isLandscape; var scaleFactor = -1; var gfxConst = 8; var gfxScaleFactor = scaleFactor/gfxConst; //canvas elements
	
	var RENDER_MODES = {
		MENU:		0,
		CUTSCENE:	1,
		MAZE3D:		2,
		SOLITAIRE:	3,
		TOPDOWN:	4,
		UNUSED5:	5,
		UNUSED6:	6,
		UNUSED7:	7,
	};
	var renderMode = RENDER_MODES.MAZE3D;
	var isRendering = true;
	var isTalking = false;
	//i'm sorry this is really gross
	var skyImg; var skyImgLoaded = false;
	var floorImg; var floorImgLoaded = false;
	var wallImg; var wallImgLoaded = false;
	var sideWallImg; var sideWallImgLoaded = false;
	var rearWallImg; var rearWallImgLoaded = false;
	
	var instructionsImg; var instructionsImgLoaded = false;
	
	var rabbitImg; var rabbitImgLoaded = false;
	var toadImg; var toadImgLoaded = false;
	var dogImg; var dogImgLoaded = false;
	var guardImg; var guardImgLoaded = false;
	var catImg; var catImgLoaded = false;
	var birdImg; var birdImgLoaded = false;
	var witchImg; var witchImgLoaded = false;
	var bushImg; var bushImgLoaded = false;
	var grateImg; var grateImgLoaded = false;
	var wellImg; var wellImgLoaded = false;
	var fountainImg; var fountainImgLoaded = false;
	var cageImg; var cageImgLoaded = false;
	var birdhouseImg; var birdhouseImgLoaded = false;
	
	var doorImg; var doorImgLoaded = false; var doorImgHeight; var doorImgWidth;
	var loadingDone = false;
	
	var checkResourcesLoaded = function() { 
		if(skyImgLoaded && floorImgLoaded && wallImgLoaded && sideWallImgLoaded && rearWallImgLoaded && doorImgLoaded
			&& rabbitImgLoaded && toadImgLoaded && dogImgLoaded && guardImgLoaded && catImgLoaded && birdImgLoaded && witchImgLoaded
			&& bushImgLoaded && grateImgLoaded && wellImgLoaded && fountainImgLoaded && cageImgLoaded && birdhouseImgLoaded && instructionsImgLoaded) { loadingDone = true; renderCanvas(); }
	}
	
	//game elements
	var ldGame;
	
	
	var checkIsLandscape = function() {
		var origState = isLandscape;
		if(viewCanvasDiv.scrollWidth > viewCanvasDiv.scrollHeight) { isLandscape = true; }
		else { isLandscape = false; }
		if(origState !== isLandscape ) { 
			if(dbgMd) { console.log("Div size updated to " + viewCanvasDiv.offsetWidth + "x" + viewCanvasDiv.offsetHeight); }
			if(dbgMd) { console.log("Canvas size updated to " + "TODO CANVAS WIDTH VAR" + "x" + "TODO CANVAS HEIGHT VAR"); }
			console.warn("Display mode has changed from " + origState + " to " + isLandscape); 
		}
	}
	
	var createDiv = function() {
		var checkDivExistence = function() {
			var divObj = document.getElementById(CNVS_DIV_ID);
			if(dbgMd) { console.log("Canvas DIV existence check returns " + ((divObj === null)? "false" : "true" )); }
			return !( divObj === null );
		}
		if( checkDivExistence() ) { return; }
		viewCanvasDiv = document.createElement("div");
		viewCanvasDiv.id = CNVS_DIV_ID;
		viewCanvasDiv.className = CNVS_DIV_CLASS;
		document.body.appendChild(viewCanvasDiv);
		viewCanvasDiv = document.getElementById(CNVS_DIV_ID);
		viewCanvasDiv.style.minWidth = "730px"; viewCanvasDiv.style.maxWidth = "730px";
		viewCanvasDiv.style.minHeight = "480px";viewCanvasDiv.style.maxHeight = "480px";
		//checkIsLandscape(); //maybe this can be worked back in at some point but leave it out for now
		if(dbgMd) { console.log("Canvas DIV element has now been created. Div ID = " + CNVS_DIV_ID + ", Div css class = " + CNVS_DIV_CLASS); }
	}
	
	var checkCanvasExistence = function() { //check if the view div exists
		var canvasObj = document.getElementById(CNVS_ID);
		if(dbgMd) { console.log("Canvas existence check returns " + ((canvasObj === null)? "false" : "true" )); }
		return ( canvasObj !== null );
	}
	
	var clearCanvas = function() {
		viewContext.clearRect(0,0,viewCanvas.width,viewCanvas.height);
	}
	
	var removeCanvas = function() {
		var oldCanvas = document.getElementById(CNVS_ID);
		var txtArea = document.getElementById(TXTAREA_ID);
		viewCanvasDiv.removeChild(oldCanvas);
		viewCanvasDiv.removeChild(txtArea);
	}
	
	var scaleCanvas = function() {
		//update the scale factor
		var prvScaleFactor = scaleFactor;
		var widthAvail = viewCanvasDiv.clientWidth;
		var heightAvail = viewCanvasDiv.clientHeight;
		var widthScale = Math.floor(widthAvail/CNVS_MIN_WIDTH);
		var heightScale = Math.floor(heightAvail/CNVS_MIN_HEIGHT);
		scaleFactor = Math.min(widthScale, heightScale); gfxScaleFactor = Math.floor(scaleFactor/gfxConst);
		if(scaleFactor !== prvScaleFactor || prvScaleFactor === -1/*first run only*/) { //apply the new scale factor if necessary, and report
			viewCanvas.width = CNVS_MIN_WIDTH * scaleFactor;
			viewCanvas.height = CNVS_MIN_HEIGHT * scaleFactor;
			console.warn("Resizing game canvas from scale factor " + prvScaleFactor + " with new factor " + scaleFactor);
			if(dbgMd){
				console.groupCollapsed("Canvas resizing");
				console.log("Critical new dimensions: " + widthAvail + "x" + heightAvail);
				console.log("X-scale factor: " + widthAvail + "/" + CNVS_MIN_WIDTH + "= " + widthScale);
				console.log("Y-scale factor: " + heightAvail + "/" + CNVS_MIN_HEIGHT + "= " + heightScale);
				console.log("Minimum of these two factors is: " + scaleFactor);
				console.groupEnd();
			}
		}
		clearCanvas();
		renderCanvas();
	}
	
	var createCanvas = function() {
		var newCanvas = document.createElement("canvas");
		newCanvas.id = CNVS_ID;
		viewCanvasDiv.appendChild(newCanvas);
		viewCanvas = document.getElementById(CNVS_ID);
		viewContext = viewCanvas.getContext('2d');
		var newTextArea = document.createElement("textarea");
		newTextArea.id=TXTAREA_ID;
		newTextArea.readOnly = true;
		viewCanvasDiv.appendChild(newTextArea);
		viewContext.save();
		scaleFactor = -1;
	}
	
	var render3dMaze = function() { //last check - lowest possible scale factor is 8
		//determine where to put everything
		var ctxLineWidth = gfxScaleFactor*4; var test1 = scaleFactor; var test2 = viewCanvas.width;
		var menuWidth = 80 * gfxScaleFactor; var menu1Origin = menuWidth + Math.floor(ctxLineWidth/2); var menu2origin = viewCanvas.width-menu1Origin;
		var mapHeight = 80 * gfxScaleFactor; var mapLineOrigin = mapHeight + Math.floor(ctxLineWidth/2);
		var statusHeight = viewCanvas.height - mapHeight;
		var mazeWidth = menu1Origin;
		var cellSize = Math.floor(menu1Origin/ldGame.getMazeSize());
		//draw the lines separating the map/status and inventory screens from the maze view
		viewContext.beginPath();
		viewContext.strokeStyle = "rgba(0, 0, 0, 1)";
		viewContext.moveTo(menu1Origin, 0); viewContext.lineTo(menu1Origin, viewCanvas.height); //separate maze from inventory
		viewContext.moveTo(menu2origin, 0); viewContext.lineTo(menu2origin, viewCanvas.height); //separate maze from map/status menu
		viewContext.moveTo(0, mapLineOrigin); viewContext.lineTo(menu1Origin, mapLineOrigin); //separate map from status
		viewContext.lineWidth = ctxLineWidth;
		viewContext.stroke();
		//render the directions
		viewContext.beginPath();
		viewContext.drawImage(instructionsImg, 2, mapLineOrigin+2, 160, 230);
		//render the maze view
		//render the sky
		viewContext.beginPath();
		var skyPattern = viewContext.createPattern( skyImg, 'repeat');
		viewContext.rect(menu1Origin, 0, menu2origin-menu1Origin, viewCanvas.height/2);
		viewContext.fillStyle = skyPattern;
		viewContext.fill();
		//render the ground
		viewContext.beginPath();
		var floorPattern = viewContext.createPattern( floorImg, 'repeat');
		viewContext.rect(menu1Origin, viewCanvas.height/2, menu2origin-menu1Origin, viewCanvas.height/2);
		viewContext.fillStyle = floorPattern;
		viewContext.fill();
		//now render the walls
		//front wall
		viewContext.beginPath();
		var wallPattern = viewContext.createPattern(wallImg, 'repeat');
		viewContext.rect(menu1Origin + (menu2origin-menu1Origin)/3, viewCanvas.height/3, 3*viewCanvas.height/6, viewCanvas.height/3);
		viewContext.fillStyle = wallPattern;
		viewContext.fill();
		//rear wall
		
		//left wall
		viewContext.beginPath();
		var sideWallPattern = viewContext.createPattern(sideWallImg, 'repeat');
		viewContext.moveTo(menu1Origin, viewCanvas.height/6);
		viewContext.lineTo(menu1Origin + (menu2origin-menu1Origin)/3, viewCanvas.height/3);
		viewContext.lineTo(menu1Origin + (menu2origin-menu1Origin)/3, 2*viewCanvas.height/3);
		viewContext.lineTo(menu1Origin, 5*viewCanvas.height/6);
		viewContext.fillStyle = sideWallPattern;
		viewContext.fill();
		//right wall 
		viewContext.beginPath();
		viewContext.moveTo(menu2origin, viewCanvas.height/6);
		viewContext.lineTo(menu2origin - (menu2origin-menu1Origin)/3, viewCanvas.height/3);
		viewContext.lineTo(menu2origin - (menu2origin-menu1Origin)/3, 2*viewCanvas.height/3);
		viewContext.lineTo(menu2origin, 5*viewCanvas.height/6);
		viewContext.fillStyle = sideWallPattern;
		viewContext.fill();
		//front wall left line
		viewContext.beginPath();
		viewContext.strokeStyle = "rgba(0, 0, 0, 0.7)";
		viewContext.lineWidth = 1;
		viewContext.moveTo(menu1Origin + (menu2origin-menu1Origin)/3, viewCanvas.height/3); viewContext.lineTo(menu1Origin + (menu2origin-menu1Origin)/3, 2*viewCanvas.height/3);
		viewContext.stroke();
		//front wall right line
		viewContext.beginPath();
		viewContext.strokeStyle = "rgba(0, 0, 0, 0.7)";
		viewContext.lineWidth = 1;
		viewContext.moveTo(menu2origin - (menu2origin-menu1Origin)/3, viewCanvas.height/3); viewContext.lineTo(menu2origin - (menu2origin-menu1Origin)/3, 2*viewCanvas.height/3);
		viewContext.stroke();
		//render a door if there;s one in front of you
		var currPosPtr = ldGame.getPosition();
		var doorArr = ldGame.gardenMaze[ currPosPtr[0] ][ currPosPtr[1] ].getExits();
		var doorInFront = doorArr[currPosPtr[2]];
		var doorOnLeftPtr = (currPosPtr[2]-1 < 0)? 3 : currPosPtr[2]-1;
		var doorOnRightPtr = (currPosPtr[2]+1)%4;
		var doorOnLeft = doorArr[doorOnLeftPtr];
		var doorOnRight = doorArr[doorOnRightPtr];
		if(doorInFront){
			viewContext.beginPath();
			viewContext.drawImage(doorImg, 5*(viewCanvas.width/12), (viewCanvas.height/3)+(viewCanvas.height/20), 2*(viewCanvas.width/12), (viewCanvas.height/3)-(viewCanvas.height/20));
		}
		if(doorOnLeft) {
			viewContext.beginPath(); //get ready the next line is gonna be UGLY
			viewContext.drawImage(doorImg,
				doorImgWidth/2, 0, doorImgWidth/2, doorImgHeight, //these values specify which portion of the image to draw. for the right door, draw the rightmost half
				menu1Origin, viewCanvas.height/6, (menu2origin-menu1Origin)/3, 4*viewCanvas.height/6); //these values specify where to draw it
		}
		if(doorOnRight) {
			viewContext.beginPath(); //get ready the next line is gonna be UGLY
			viewContext.drawImage(doorImg,
				0, 0, doorImgWidth/2, doorImgHeight, //these values specify which portion of the image to draw. for the left door, draw the leftmost half
				menu2origin - (menu2origin-menu1Origin)/3, viewCanvas.height/6, (menu2origin-menu1Origin)/3, 4*viewCanvas.height/6); //these values specify where to draw it
		}
		//draw whatever special object might be in this room
		var myObj = ldGame.gardenMaze[ currPosPtr[0] ][ currPosPtr[1] ].feature;
		var featKeys = Object.keys(ldGame.FEATURES).sort(function(a,b){
			return ldGame.FEATURES[a]-ldGame.FEATURES[b];
		});
		//myObj = featKeys[myObj];
		if(myObj !== ldGame.FEATURES.NONE && myObj !== "NONE") {
			var imgXPos = 5*((menu2origin-menu1Origin)/12)+menu1Origin;
			var imgYPos = 5*viewCanvas.height/12;
			var imgSize = (menu2origin-menu1Origin)/3;
			switch(myObj){
				case "RABBIT"://ldGame.FEATURES.RABBIT:
					viewContext.beginPath();
					viewContext.drawImage(rabbitImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "TOAD"://ldGame.FEATURES.TOAD:
					viewContext.beginPath();
					viewContext.drawImage(toadImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "DOG"://ldGame.FEATURES.DOG:
					viewContext.beginPath();
					viewContext.drawImage(dogImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "GUARD"://ldGame.FEATURES.GUARD:
					viewContext.beginPath();
					viewContext.drawImage(guardImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "CAT"://ldGame.FEATURES.CAT:
					viewContext.beginPath();
					viewContext.drawImage(catImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "BIRD"://ldGame.FEATURES.BIRD:
					viewContext.beginPath();
					viewContext.drawImage(birdImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "WITCH"://ldGame.FEATURES.WITCH:
					viewContext.beginPath();
					viewContext.drawImage(witchImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "BUSH"://ldGame.FEATURES.BUSH:
					viewContext.beginPath();
					viewContext.drawImage(bushImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "GRATE"://ldGame.FEATURES.GRATE:
					viewContext.beginPath();
					viewContext.drawImage(grateImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "WELL"://ldGame.FEATURES.WELL:
					viewContext.beginPath();
					viewContext.drawImage(wellImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "FOUNTAIN"://ldGame.FEATURES.FOUNTAIN:
					viewContext.beginPath();
					viewContext.drawImage(fountainImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "CAGE"://ldGame.FEATURES.CAGE:
					viewContext.beginPath();
					viewContext.drawImage(cageImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "BIRDHOUSE"://ldGame.FEATURES.BIRDHOUSE:
					viewContext.beginPath();
					viewContext.drawImage(birdhouseImg, imgXPos, imgYPos, imgSize, imgSize);
					break;
				case "NONE":
					break;
				default:
					console.error("Invalid feature requested to be drawn!");
					break;
			}
		}
		//draw the lines separating the controls from the inventory view
		/*//removed for now...
		viewContext.beginPath();
		viewContext.strokeStyle = "rgba(0, 0, 0, 1)";
		viewContext.moveTo(menu2origin, viewCanvas.height-mapLineOrigin); viewContext.lineTo(viewCanvas.width, viewCanvas.height-mapLineOrigin); //separate map from status
		viewContext.lineWidth = ctxLineWidth;
		viewContext.stroke();
		//draw the lines separating the individual controls from one another
		var buttonCellHeight = mapLineOrigin/3;
		viewContext.beginPath();
		viewContext.strokeStyle = "rgba(0, 0, 0, 1)";
		viewContext.moveTo( menu2origin, viewCanvas.height-buttonCellHeight ); viewContext.lineTo( viewCanvas.width, viewCanvas.height-buttonCellHeight ); //separate down from the others
		viewContext.moveTo( menu2origin, viewCanvas.height-(2*buttonCellHeight) ); viewContext.lineTo( viewCanvas.width, viewCanvas.height-(2*buttonCellHeight) ); //separate down from the others
		viewContext.moveTo( menu2origin+((viewCanvas.width-menu2origin)/2), viewCanvas.height-buttonCellHeight ); viewContext.lineTo( menu2origin+((viewCanvas.width-menu2origin)/2), viewCanvas.height-(2*buttonCellHeight) ); //separate CW from CCW
		viewContext.lineWidth = Math.max(ctxLineWidth/2, 1);
		viewContext.stroke();
		*/
		//render the map
		//draw all the map cells
		var playerPos = ldGame.getPosition();
		ldGame.gardenMaze[playerPos[0]][playerPos[1]].explored = true;
		for(var i = 0; i < ldGame.getMazeSize(); i=i+1){
			for(var j = 0; j < ldGame.getMazeSize(); j=j+1){
				var xOffset = j*cellSize;
				var yOffset = i*cellSize;
				if( ldGame.gardenMaze[i][j].explored ) { //cell was visited, draw its exits
					//put a gold square on cells which have objects
					if(ldGame.gardenMaze[i][j].feature !== ldGame.FEATURES.NONE && ldGame.gardenMaze[i][j].feature !== "NONE"){
						viewContext.beginPath();
						viewContext.rect(j*cellSize+(cellSize/6), i*cellSize+(cellSize/6), 2*cellSize/3, 2*cellSize/3);
						viewContext.fillStyle = "rgba(218, 165, 32, 1)";
						viewContext.fill();
					}
					//now draw any explored map cells
					var myExits = ldGame.gardenMaze[i][j].getExits();
					//look for any north exits
					if(!myExits[0]){
						viewContext.beginPath();
						viewContext.moveTo( xOffset, yOffset); viewContext.lineTo( xOffset+cellSize, yOffset);
						viewContext.strokeStyle = "rgba(0, 0, 255, 1)";
						viewContext.lineWidth = 2;
						viewContext.stroke();
					}
					//look for any east exits
					if(!myExits[1]){
						viewContext.beginPath();
						viewContext.moveTo( xOffset+cellSize, yOffset); viewContext.lineTo( xOffset+cellSize, yOffset+cellSize );
						viewContext.strokeStyle = "rgba(0, 0, 255, 1)";
						viewContext.lineWidth = 2;
						viewContext.stroke();
					}
					//look for any south exits
					if(!myExits[2]){
						viewContext.beginPath();
						viewContext.moveTo( xOffset, yOffset+cellSize); viewContext.lineTo( xOffset+cellSize, yOffset+cellSize );
						viewContext.strokeStyle = "rgba(0, 0, 255, 1)";
						viewContext.lineWidth = 2;
						viewContext.stroke();
					}
					//look for any west exits
					if(!myExits[3]){
						viewContext.beginPath();
						viewContext.moveTo( xOffset, yOffset); viewContext.lineTo( xOffset, yOffset+cellSize);
						viewContext.strokeStyle = "rgba(0, 0, 255, 1)";
						viewContext.lineWidth = 2;
						viewContext.stroke();
					}
				}
				else { //cell was not visited, draw a grey square
					viewContext.fillStyle = "rgba(204, 204, 204, 1)";
					viewContext.fillRect(xOffset, yOffset, cellSize, cellSize);
				}
			}
		}
		//our tile gets a red compass arrow (only do this once obviously!)
		switch(playerPos[2]) {
			case 0:
				viewContext.beginPath();
				viewContext.fillStyle = "rgba(204, 65, 65, 1)";
				viewContext.moveTo( (playerPos[1]*cellSize)+6, (playerPos[0]*cellSize)+cellSize-6 );
				viewContext.lineTo( (playerPos[1]*cellSize)+cellSize-6, (playerPos[0]*cellSize)+cellSize-6 ); viewContext.lineTo( (playerPos[1]*cellSize)+(cellSize/2), (playerPos[0]*cellSize)+6 );
				viewContext.fill();
				break;
			case 1:
				viewContext.beginPath();
				viewContext.fillStyle = "rgba(204, 65, 65, 1)";
				viewContext.moveTo( (playerPos[1]*cellSize)+6, (playerPos[0]*cellSize)+6 );
				viewContext.lineTo( (playerPos[1]*cellSize)+6, (playerPos[0]*cellSize)+cellSize-6  ); viewContext.lineTo( (playerPos[1]*cellSize)+cellSize-6, (playerPos[0]*cellSize)+cellSize/2 );
				viewContext.fill();
				break;
			case 2:
				viewContext.beginPath();
				viewContext.fillStyle = "rgba(204, 65, 65, 1)";
				viewContext.moveTo( (playerPos[1]*cellSize)+6, (playerPos[0]*cellSize)+6 );
				viewContext.lineTo( (playerPos[1]*cellSize)+cellSize-6, (playerPos[0]*cellSize)+6 ); viewContext.lineTo( (playerPos[1]*cellSize)+(cellSize/2), (playerPos[0]*cellSize)+cellSize-6 );
				viewContext.fill();
				break;
			case 3:
				viewContext.beginPath();
				viewContext.fillStyle = "rgba(204, 65, 65, 1)";
				viewContext.moveTo( (playerPos[1]*cellSize)+cellSize-6, (playerPos[0]*cellSize)+cellSize-6 );
				viewContext.lineTo( (playerPos[1]*cellSize)+cellSize-6, (playerPos[0]*cellSize)+6 ); viewContext.lineTo( (playerPos[1]*cellSize)+6, (playerPos[0]*cellSize)+cellSize/2 );
				viewContext.fill();
				break;
			default:
				console.error("Game object reported invalid player cardinality!");
				break;
		}
		//iterate the game state
		var outText = ldGame.determineOutputText();
		//write the output text
		if(outText!== null) { document.getElementById(TXTAREA_ID).value = outText; }
		else { document.getElementById(TXTAREA_ID).value = ""; }
		if(dbgMd) { console.log(outText); }
		//render the inventory
		var invImgs = [witchImg, rabbitImg, toadImg, dogImg, guardImg, catImg, birdImg];
		//write the titles to the right-hand menu
		viewContext.beginPath();
		viewContext.fillStyle = "rgba(0, 0, 0, 1)";
		viewContext.font="15px Courier New";
		viewContext.fillText("Available forms:", (menu2origin+10), viewCanvas.height/16);
		viewContext.beginPath();
		viewContext.fillText("Inventory:", (menu2origin+10), (8*viewCanvas.height/10)+viewCanvas.height/16);
		//list the inventory:
		if(ldGame.playerItems[0]) {
			viewContext.beginPath();
			viewContext.fillText("*Bone", menu2origin+5, (9*viewCanvas.height/10)+viewCanvas.height/16);
		}
		if(ldGame.playerItems[1]) {
			viewContext.beginPath();
			viewContext.fillText("*Water", menu2origin+60, (9*viewCanvas.height/10)+viewCanvas.height/16);
		}
		if(ldGame.playerItems[2]) {
			viewContext.beginPath();
			viewContext.fillText("*Key", menu2origin+125, (9*viewCanvas.height/10)+viewCanvas.height/16);
		}
		for(var i = 1; i <= 10; i++){
			//draw the line separating the states:
			yOffset = i*(viewCanvas.height/10);
			viewContext.beginPath();
			viewContext.moveTo(menu2origin, yOffset); viewContext.lineTo(viewCanvas.width, yOffset);
			viewContext.strokeStyle = "rgba(0, 0, 0, 1)";
			viewContext.lineWidth = 2;
			viewContext.stroke();
			//draw the relevant image or nothing!
			viewContext.beginPath();
			if(i<8) {
				if(ldGame.playerStatesUnlocked[i-1]) {
					var reqdKeyIn = i+1;
					//highlight the current playerState
					if(i==ldGame.playerState) {
						viewContext.beginPath();
						viewContext.rect(menu2origin+5, yOffset+5, viewCanvas.width-menu2origin-10, (viewCanvas.height/10)-10);
						viewContext.fillStyle = "rgba(218, 165, 32, 0.6)";
						viewContext.fill();
					}
					else {
						var instrText = "Press '" + i +"'!";
						viewContext.beginPath();
						viewContext.fillStyle = "rgba(0, 0, 0, 1)";
						viewContext.font="15px Courier New";
						viewContext.fillText(instrText, (menu2origin+(viewCanvas.height/10)+15), yOffset+(viewCanvas.height/16));
					}
					viewContext.drawImage(invImgs[i-1], menu2origin+5, yOffset+5, (viewCanvas.height/10)-10, (viewCanvas.height/10)-10);
				}
			}
			
			//write the relevant key shortcut
			
			
		}
		
		//render the current state text to the screen
		if(ldGame.gameComplete) { isTalking = true; }
	}
	
	var renderCanvas = function() {
		isRendering = true;
		clearCanvas();
		switch(renderMode) {
			case RENDER_MODES.MAZE3D:
				if(loadingDone === false) { checkResourcesLoaded(); console.error("Tried to render before resources were loaded!"); break; }
				render3dMaze();
				isRendering = false;
				break;/*
			case RENDER_MODES.SOLITAIRE:
				
				break;
			case RENDER_MODES.TOPDOWN:
				
				break;*/
			default:
				console.error("Invalid render mode requested");
				break;
		}
	}
	
	function setDebugMode(isDebugMode) {
		if(isDebugMode === false) { dbgMd = false; } //only turn off debugging if someone really means to
		else { dbgMd = true; } //otherwise, leave it on
	}
	
	this.windowResizeHandler = function() {
		console.warn("resize window handler reached");
		scaleCanvas();
		//checkIsLandscape();
		renderCanvas();
	}
	
	this.keyUpHandler = function(keyIn) {
		if(isRendering) { return; } //don't process input while the browser is rendering
		var actionRequiresRender = false;
		switch(keyIn) {
			case 87: //W
				if(isTalking) { break;}
				ldGame.playerAdvance();
				actionRequiresRender = true;
				break;
			case 38: //Up arrow
				if(isTalking) { break;}
				ldGame.playerAdvance();
				actionRequiresRender = true;
				break;
			case 68: //D
				if(isTalking) { break;}
				ldGame.rotatePlayerCw();
				actionRequiresRender = true;
				break;
			case 39: //Right Arrow
				if(isTalking) { break;}
				ldGame.rotatePlayerCw();
				actionRequiresRender = true;
				break;
			case 83: //S
				if(isTalking) { break;}
				ldGame.playerRetreat();
				actionRequiresRender = true;
				break;
			case 40: //Down arrow
				if(isTalking) { break;}
				ldGame.playerRetreat();
				actionRequiresRender = true;
				break;
			case 65: //A
				if(isTalking) { break;}
				ldGame.rotatePlayerCcw();
				actionRequiresRender = true;
				break;
			case 37: //Left Arrow
				if(isTalking) { break;}
				ldGame.rotatePlayerCcw();
				actionRequiresRender = true;
				break;
			case 65: //A
				if(isTalking) { break;}
				ldGame.rotatePlayerCcw();
				actionRequiresRender = true;
				break;
			case 37: //Left Arrow
				if(isTalking) { break;}
				ldGame.rotatePlayerCcw();
				actionRequiresRender = true;
				break;
			case 49: //1
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.NORMAL);
				actionRequiresRender = true;
				break;
			case 97: //1
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.NORMAL);
				actionRequiresRender = true;
				break;
			case 50: //2
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.RABBIT);
				actionRequiresRender = true;
				break;
			case 98: //2
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.RABBIT);
				actionRequiresRender = true;
				break;
			case 51: //3
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.TOAD);
				actionRequiresRender = true;
				break;
			case 99: //3
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.TOAD);
				actionRequiresRender = true;
				break;
			case 52: //4
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.DOG);
				actionRequiresRender = true;
				break;
			case 100: //4
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.DOG);
				actionRequiresRender = true;
				break;
			case 53: //5
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.GUARD);
				actionRequiresRender = true;
				break;
			case 101: //5
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.GUARD);
				actionRequiresRender = true;
				break;
			case 54: //6
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.CAT);
				actionRequiresRender = true;
				break;
			case 102: //6
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.CAT);
				actionRequiresRender = true;
				break;
			case 55: //7
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.BIRD);
				actionRequiresRender = true;
				break;
			case 103: //7
				if(isTalking) { break;}
				ldGame.requestStateChange(PLAYER_STATES.BIRD);
				actionRequiresRender = true;
				break;
			default:
				break;
		}
		if (actionRequiresRender) { renderCanvas(); }
	}
	
	//set up the canvas
	//called when loading the page
	function initView() { 
		var l_dbgMd = dbgMd;
		if(l_dbgMd) { console.group/*Collapsed*/("Document Setup"); }
		createDiv();
		if( checkCanvasExistence() ) { removeCanvas(); }
		console.assert( !( checkCanvasExistence() ), "Game canvas already exists and could not be deleted!");
		createCanvas();
		scaleCanvas();
		//now load the resources
		doorImg = new Image();
		doorImg.onload = function() {
			doorImgLoaded = true;
			checkResourcesLoaded();
			doorImgHeight = this.height;
			doorImgWidth = this.width;
		};
		doorImg.src = "./img/door.png";
		//------------------------------------------------------
		floorImg = new Image();
		floorImg.onload = function() {
			floorImgLoaded = true;
			checkResourcesLoaded();
		};
		floorImg.src = "./img/dirt.png";
		//------------------------------------------------------
		skyImg = new Image();
		skyImg.onload = function() {
			skyImgLoaded = true;
			checkResourcesLoaded();
		};
		skyImg.src = "./img/sky.png";
		//------------------------------------------------------
		rearWallImg = new Image();
		rearWallImg.onload = function() {
			rearWallImgLoaded = true;
			checkResourcesLoaded();
		};
		rearWallImg.src = "./img/wallfront.png"; //TODO make another wall, even darker, to be the back wall
		//------------------------------------------------------
		sideWallImg = new Image();
		sideWallImg.onload = function() {
			sideWallImgLoaded = true;
			checkResourcesLoaded();
		};
		sideWallImg.src = "./img/wallside.png";
		//------------------------------------------------------
		wallImg = new Image();
		wallImg.onload = function() {
			wallImgLoaded = true;
			checkResourcesLoaded();
		};
		wallImg.src = "./img/wallfront.png";
		//------------------------------------------------------
		//------------------------------------------------------
		rabbitImg = new Image();
		rabbitImg.onload = function() {
			rabbitImgLoaded = true;
			checkResourcesLoaded();
		};
		rabbitImg.src = "./img/rabbit.png";
		//------------------------------------------------------
		toadImg = new Image();
		toadImg.onload = function() {
			toadImgLoaded = true;
			checkResourcesLoaded();
		};
		toadImg.src = "./img/frog.png";
		//------------------------------------------------------
		dogImg = new Image();
		dogImg.onload = function() {
			dogImgLoaded = true;
			checkResourcesLoaded();
		};
		dogImg.src = "./img/dog.png";
		//------------------------------------------------------
		guardImg = new Image();
		guardImg.onload = function() {
			guardImgLoaded = true;
			checkResourcesLoaded();
		};
		guardImg.src = "./img/guard.png";
		//------------------------------------------------------
		catImg = new Image();
		catImg.onload = function() {
			catImgLoaded = true;
			checkResourcesLoaded();
		};
		catImg.src = "./img/cat.png";
		//------------------------------------------------------
		birdImg = new Image();
		birdImg.onload = function() {
			birdImgLoaded = true;
			checkResourcesLoaded();
		};
		birdImg.src = "./img/bird.png";
		//------------------------------------------------------
		witchImg = new Image();
		witchImg.onload = function() {
			witchImgLoaded = true;
			checkResourcesLoaded();
		};
		witchImg.src = "./img/witch.png";
		//------------------------------------------------------
		bushImg = new Image();
		bushImg.onload = function() {
			bushImgLoaded = true;
			checkResourcesLoaded();
		};
		bushImg.src = "./img/rosebush.png";
		//------------------------------------------------------
		grateImg = new Image();
		grateImg.onload = function() {
			grateImgLoaded = true;
			checkResourcesLoaded();
		};
		grateImg.src = "./img/grate.png";
		//------------------------------------------------------
		wellImg = new Image();
		wellImg.onload = function() {
			wellImgLoaded = true;
			checkResourcesLoaded();
		};
		wellImg.src = "./img/well.png";
		//------------------------------------------------------
		fountainImg = new Image();
		fountainImg.onload = function() {
			fountainImgLoaded = true;
			checkResourcesLoaded();
		};
		fountainImg.src = "./img/fountain.png";
		//------------------------------------------------------
		cageImg = new Image();
		cageImg.onload = function() {
			cageImgLoaded = true;
			checkResourcesLoaded();
		};
		cageImg.src = "./img/kingcage.png";
		//------------------------------------------------------
		birdhouseImg = new Image();
		birdhouseImg.onload = function() {
			birdhouseImgLoaded = true;
			checkResourcesLoaded();
		};
		birdhouseImg.src = "./img/birdhouse.png";
		//------------------------------------------------------
		instructionsImg = new Image();
		instructionsImg.onload = function() {
			instructionsImgLoaded = true;
			checkResourcesLoaded();
		};
		instructionsImg.src = "./img/directions.png";
		
		
		renderCanvas();
		if(l_dbgMd) { console.groupEnd(); }
	}
	
	ldGame = new Game(); ldGame.init();
	initView(); //TODO ~~remove this and put it in an init wrapper that gets called from the parent object~~ TODO
	initView(); //TODO ~~remove this, it is testing the functionality of this class~~ TODO
	scaleCanvas();
	renderCanvas(); //TODO ~~remove this, it is testing the functionality of this class~~ TODO
}