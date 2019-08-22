/*global L*/
//m={};
  v={};
  c={};

c.initialize = function(){
	L.attachAllElementsById(v);
	c.startGame();
	v.playerOneNameInput.addEventListener('keydown', (eo)=>{if(eo.which == 13 || eo.keyCode == 13){c.setPlayers(eo)}});
	v.playerTwoNameInput.addEventListener('keydown', (eo)=>{if(eo.which == 13 || eo.keyCode == 13){c.setPlayers(eo)}});
	v.playerOneHoldButton.addEventListener('mousedown', ()=>{if(m.playerOne.turnActive){c.hold(m.playerOne, m.playerTwo)}});
	v.playerTwoHoldButton.addEventListener('mousedown', ()=>{if(m.playerTwo.turnActive){c.hold(m.playerTwo, m.playerOne)}});
	v.rollButton.addEventListener('mousedown', ()=>{
		if(m.playerOne.turnActive){c.roll(m.playerOne, m.playerTwo)}
							  else{c.roll(m.playerTwo, m.playerOne)}
	})
	alert('WARNING: currently being worked on; very buggy');
};

c.startGame = function(){
	m.gameIsWon = false;
	m.rollableNums = [ 1,2,3,4,5,6 ];
	m.dice = 0;
	m.playerOne.turnActive = true;
	
	c.showIntroduction();
	c.hideGameBoard();
};

c.setPlayers = function(eo){
	if(v.playerOneNameInput.value !== "" && v.playerTwoNameInput.value !== ""){
		m.playerOne.name = v.playerOneNameInput.value;
		m.playerTwo.name = v.playerTwoNameInput.value;
		
		c.hideIntroduction();
		c.showGameBoard();
	}
	//TODO add modal to tell players to fill fields
};

c.hideIntroduction = function(){
	v.introductionContainer.style.visibility = "hidden";
	v.introductionContainer.style.opacity = "0";
};

c.showIntroduction = function(){
	v.introductionContainer.style.visibility = "visible";
	v.introductionContainer.style.opacity = "1";
};

c.hideGameBoard = function(){
	v.gameBoard.style.visibility = "hidden";
	v.gameBoard.style.opacity = "0";
};

c.showGameBoard = function(){
	v.gameBoard.style.visibility = "visible";
	v.gameBoard.style.opacity = "1";
	
	c.updateNames();
	c.updateScores();
	c.roll(m.playerOne, m.playerTwo);
};

c.roll = function(activePlayer, inactivePlayer){
	if(m.gameIsWon){return}
	let num = Math.floor(Math.random()*10);
	if(m.rollableNums.includes(num)){
		m.dice = num;
		c.showDiceFace(m.dice);
		c.checkDiceValue(activePlayer, m.dice, inactivePlayer);
	}
	else{
		c.roll(activePlayer, inactivePlayer);
	}
};

c.hold = function(activePlayer, inactivePlayer){
	if(m.gameIsWon){return;}
	let activeTurnTotalElement = c.transitionTurnTotal(activePlayer);
	setTimeout(()=>{
		activeTurnTotalElement.style.removeProperty('transform');
		activeTurnTotalElement.style.opacity = '1';
		activePlayer.overallTotal += activePlayer.turnTotal;
		activePlayer.turnTotal = 0;
		
		activePlayer.turnActive = false;
		inactivePlayer.turnActive = true;
		c.updateScores();
		c.roll(inactivePlayer, activePlayer);
	}, 600);
};

c.checkDiceValue = function(activePlayer, diceRoll, inactivePlayer){
	if(diceRoll !== 1){
		activePlayer.turnTotal += diceRoll;
		if((activePlayer.turnTotal + activePlayer.overallTotal) >= 100){c.completeGame(activePlayer)}
		c.updateScores();
		//awaiting roll or hold decision...
	}
	else{
		//activate oneRolledModal
		c.showRolledOneModal(activePlayer);
		activePlayer.turnTotal = 0;
		activePlayer.turnActive = false;
		inactivePlayer.turnActive = true;
		c.updateScores();
		c.roll(inactivePlayer, activePlayer);
	}
};

c.completeGame = function(activePlayer){
	m.gameIsWon = true;
	//activate wonModal
	c.showWinModal(activePlayer);
	Object.freeze(m.playerOne);
	Object.freeze(m.playerTwo);
	c.updateScores();
};






//HELPER FUNCTIONS






c.showDiceFace = function(diceRoll){
	v.diceHolder.style.backgroundImage = `url('./DieFaces/dice-six-faces-${diceRoll}.png')`;
};

c.updateNames = function(){
	v.playerOneName.innerText = m.playerOne.name;
	v.playerTwoName.innerText = m.playerTwo.name;
};

c.updateScores = function(){
	v.playerOneOverallTotal.innerText = m.playerOne.overallTotal;
	v.playerOneTurnTotal.innerText = m.playerOne.turnTotal;
	
	v.playerTwoOverallTotal.innerText = m.playerTwo.overallTotal;
	v.playerTwoTurnTotal.innerText = m.playerTwo.turnTotal;
	
	if(m.gameIsWon){
		v.playerTwoHoldButton.style.backgroundColor = "#a7a7a7";
		v.playerTwoHoldButton.style.boxShadow = "none";
		
		v.playerOneHoldButton.style.backgroundColor = "#a7a7a7";
		v.playerOneHoldButton.style.boxShadow = "none";
		
		v.rollButton.style.backgroundColor = "#a7a7a7";
		v.rollButton.style.boxShadow = "none";
	}
	else{
		c.updateButtons();
	}
};

c.updateButtons = function(){
	if(m.playerOne.turnActive){
		v.playerTwoHoldButton.style.backgroundColor = "#a7a7a7";
		v.playerTwoHoldButton.style.boxShadow = "none";
		
		v.playerOneHoldButton.style.backgroundColor = "#c2f1dd";
		v.playerOneHoldButton.style.boxShadow = "7px 7px 0px 0px grey";
	}
	else{
		v.playerOneHoldButton.style.backgroundColor = "#a7a7a7";
		v.playerOneHoldButton.style.boxShadow = "none";
		
		v.playerTwoHoldButton.style.backgroundColor = "#c2f1dd";
		v.playerTwoHoldButton.style.boxShadow = "7px 7px 0px 0px grey";
	}
};

c.transitionTurnTotal = function(activePlayer){
	let activeTurnTotalElement;
	if(activePlayer == m.playerOne){
		activeTurnTotalElement = v.playerOneTurnTotal;
	}
	else{
		activeTurnTotalElement = v.playerTwoTurnTotal;
	}
	activeTurnTotalElement.style.transform = "translateY(-150%)";
	activeTurnTotalElement.style.opacity = "0.15";
	
	return activeTurnTotalElement;
}

c.showRolledOneModal = function(activePlayer){
	v.oneRolledModal.innerHTML = `<span style="color:black"><b style="color:red">${activePlayer.name}</b> has rolled a 1!</span>`
	v.oneRolledModal.style.visibility = "visible";
	v.oneRolledModal.style.opacity = 1;
	v.oneRolledModal.style.top = "15%";
	setTimeout(()=>{
		v.oneRolledModal.style.top = "-10%";
		v.oneRolledModal.style.opacity = 0;
		setTimeout(()=>{
			v.oneRolledModal.style.visibility = "hidden";
		}, 500);
	}, 500);
}

c.showWinModal = function(activePlayer){
	v.winMessage.innerHTML = `<span id="winMessage"><b style="color:#55ff55">${activePlayer.name}</b>, you have won!</span>`
	v.playerVictoryModal.style.visibility = "visible";
	v.playerVictoryModal.style.opacity = 1;
	v.playerVictoryModal.style.top = "50%";
}