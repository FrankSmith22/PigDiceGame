<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="user-scalable=0">
		<title>PIG</title>
		<link href="https://fonts.googleapis.com/css?family=Questrial" rel="stylesheet">
		<link rel="stylesheet" href="styles.css?v=<?php echo date( "U" );?>">
		<script src="L.js"></script>
		<script src="script.js?v=<?php echo date( "U" );?>"></script>
		<script src="m.js?v=<?php echo date( "U" );?>"></script>
	</head>
	<body>
		<div id="appHolder">
			<div id="introduction">
				<h1 id="welcomeHeader">Welcome to PIG! A game about rolling dice</h1><br>
				A two player game, the winner is the first person to reach a score of 100 while rolling a single die.<br><br>
				Players take turns rolling the dice. The "turn" begins with a player rolling the dice.
				The player can now either "hold" the amount of points they got thus far and add it to their overall total,
				or they can decide to roll again to see if they can add to their turn total.<br><br>
				However, if a player rolls a one at any point during their turn, they lose all points gathered during that turn,
				and then the next player goes.<br><br>
				Who will be the two players?<br><br>
				<h2>Player one: <input id="playerOneNameInput" size="12" type="text"></h2>
				<h2>Player two: <input id="playerTwoNameInput" size="12" type="text"></h2>
			</div>
			<div id="gameBoard">
				<div id="nameHolder">
					<span class="nameHolder">
						Player One<br>
						<span id="playerOneName" class="darkGreenText">Null</span>
					</span>
					<span class="nameHolder">
						Player Two<br>
						<span id="playerTwoName" class="darkGreenText">Null</span>
					</span>
				</div>
				<div id="diceHolder"><!-- image of dice goes here --></div>
				<div id="rollButton">
					ROLL
				</div>
				<div id="playerPanels">
					<span id="playerOnePanel">
						Overall Total<br><span id="playerOneOverallTotal" class="darkGreenText">00</span><br>
						Turn Total<br><span id="playerOneTurnTotal" class="darkGreenText">00</span>
						<div id="playerOneHoldButton" class="holdButtons">HOLD</div>
					</span>
					<span id="playerTwoPanel">
						Overall Total<br><span id="playerTwoOverallTotal" class="darkGreenText">00</span><br>
						Turn Total<br><span id="playerTwoTurnTotal" class="darkGreenText">00</span>
						<div id="playerTwoHoldButton" class="holdButtons">HOLD</div>
					</span>
				</div>
			</div>
		</div>
		<script>/*global c*/window.addEventListener("load", c.initialize)</script>
	</body>
</html>
