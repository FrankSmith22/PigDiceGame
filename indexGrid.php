<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
		<title>PIG</title>
		<link href="https://fonts.googleapis.com/css?family=Questrial" rel="stylesheet">
		<link rel="stylesheet" href="stylesGrid.css?v=<?php echo date( "U" );?>">
		<script src="L.js"></script>
		<script src="scriptGrid.js?v=<?php echo date( "U" );?>"></script>
		<script src="m.js?v=<?php echo date( "U" );?>"></script>
	</head>
	<body>
		<div id="appHolder">
			<div id="introductionContainer">
				<div id="welcomeHeader">Welcome to PIG! A game about rolling dice</div>
				<div id="rules">Two players take turns rolling a dice, where the face of the dice determines your accumulating points(your turn total). However, rolling a 1 at any point sets your turn total back down to 0, so it is sometimes wise to hold your points permanently so they will not be lost, and then the turn will pass to the other player. First to 100 points wins!</div>
				<div id="introQuestion">Who will be the two players?</div>
				<div id="playerOneHeader">Player one: <input id="playerOneNameInput" size="12" type="text"></div>
				<div id="playerTwoHeader">Player two: <input id="playerTwoNameInput" size="12" type="text"></div>
				<div id="startButton" onclick="c.setPlayers()" class="noSelect">start game</div>
			</div>
			<div id="gameBoard">
				<div class="nameOneHolder">Player One</div>
				<div id="playerOneName" class="darkGreenText">Null</div>
				<div class="nameHolder">Player Two</div>
				<div id="playerTwoName" class="darkGreenText">Null</div>
				
				<div id="diceHolder"><!-- image of dice goes here --></div>
				<div id="rollButton">ROLL</div>
				
				<div id="playerOneOverallTitle">Overall Total</div>
				<div id="playerOneOverallTotal" class="darkGreenText">00</div>
				<div id="playerOneTurnTitle">Turn Total</div>
				<div id="playerOneTurnTotal" class="darkGreenText">00</div>
				<div id="playerOneHoldButton" class="holdButtons">HOLD</div>
				
				<div id="playerTwoOverallTitle">Overall Total</div>
				<div id="playerTwoOverallTotal" class="darkGreenText">00</div>
				<div id="playerTwoTurnTitle">Turn Total</div>
				<div id="playerTwoTurnTotal" class="darkGreenText">00</div>
				<div id="playerTwoHoldButton" class="holdButtons">HOLD</div>
			</div>
		</div>
		<script>/*global c*/window.addEventListener("load", c.initialize)</script>
	</body>
</html>