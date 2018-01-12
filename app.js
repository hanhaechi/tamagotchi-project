$(document).ready(function() {
	checkStatus();
});


var pet;
var beast;


function checkStatus() {
	if (pet === undefined) {
		namePet();
	}
}

// show modal to ask for name input, create pet if answer's length is > 0
function namePet(){
	var $nameModal = $('#nameModal');
	var $answerField = $('#answerNameInput');
	var $answer = $('#answerNameInput').val();
	var $giveAnswer = $('#porgNameSave');
	$nameModal.modal('show');
	$nameModal.on('shown.bs.modal', function() {
  	$answerField.focus();
	});
	
	// capture input, call pet creation function on Save button click
	$giveAnswer.on('click', function(event){
		var $answer = $('#answerNameInput').val();
		$('#nameModal').modal('hide');
		showName($answer);
	});
	
	// capture input, call pet creation function on ENTER key click
	$answerField.keypress(function(event) {
    if (event.which == 13) {
			console.log(event);
        event.preventDefault();
				var $answer = $('#answerNameInput').val();
				$('#nameModal').modal('hide');
				showName($answer);
    }
	});	

	
	// checks if name is more than one symbol, then creates pet, shows game buttons, sets up visual environment
	function showName($answer) {
		var $answerLength = $answer.length;
		if ($answerLength > 0) {
			startLife();
			changeMood(0); // restore original visual setup in case this function is invoked after one death event
			pet = createPet($answer);
			var message = "Congrats, your new Porg " + $answer.toUpperCase() + " was created successfully and got some life!\nInteract using the buttons above"
			$('.name').text($answer.toUpperCase());
			showStats();
			congrat(message);
		}
		else {
			location.reload();
		}
	}
}


// create pet
function createPet($answer){
	var pet = new gotchi.Pet($answer,5,5,5);
	return pet;
}


// get pet stats, show them and call function to show feedback message on user action outcome
function showStats() {
	var currentValues = pet.getCurrentValues();
	var $foodResult = $('#food');
	var $happinessResult = $('#happiness');
	var $energyResult = $('#energy');

	$foodResult.text(currentValues.food);
	$happinessResult.text(currentValues.happiness);
	$energyResult.text(currentValues.energy);
	petTalk();
}


/////////// EFFECTS //////////


// make the game buttons available, show battle button, restore colors of the 
function startLife(){
	$('.jumbotron').removeClass("smallScreen");
	$('#battle').show();
	$play_button.removeClass("disabled");
	$feed_button.removeClass("disabled");
	$sleep_button.removeClass("disabled");
	warningsColor();
}


// kill pet if it loses battle
function killPet(){
	pet.name = "rip porg";
	$('.name').text(pet.name.toUpperCase());
	$play_button.addClass("disabled");
	$feed_button.addClass("disabled");
	$sleep_button.addClass("disabled");
	changeMood(1);
}

// change background depending on the case

function changeMood(situation){
	var $jumbo = $('.jumbotron');
	var $colorSection = $('.color_section');
	var $title = $('.caption');
	var $porgImg = $('#porg > img');
	
	function deathSetup(){
		$jumbo.addClass("smallScreen");
		$title.hide();
		$('#battlesWon').hide();
		$jumbo.css("background", "linear-gradient(45deg, #c60100, #620b98)");
		$porgImg.attr("src", "https://img00.deviantart.net/46d2/i/2017/350/a/c/porg_by_alexandrabowmanart-dbwxibq.jpg");
		$jumbo.animate({height: "830px"}, 2000);
		$porgImg.animate({width: "100%", height: "100%"}, 2000);
		$jumbo.append($title);
		$title.text("Your porg has died");
		$title.css({color: "#7b0000", textShadow: "-1px -1px 0 rgb(168, 168, 168), 1px -1px 0 rgba(88, 69, 170, 0.5), -1px 1px 0 rgba(88, 69, 170, 0.5), 1px 1px 0 rgba(88, 69, 170, 0.5)"});
		$title.animate({fontSize: "5rem", marginTop: "30px"}, 2000, finalTouches);
		
		function finalTouches(){
			$title.show();
			showButtons(1);
		}
	}
	
	function birthSetup(){
		showButtons(0);
		$porgImg.css("width", "15%");
		$jumbo.css("background", "linear-gradient(45deg, #00c371, #9c00d6)");
		$porgImg.attr("src", "https://orig00.deviantart.net/fc57/f/2017/303/c/9/porg_by_r0ra-dbs6wcm.jpg");
		$porgImg.show();
	}
	
	if (situation === 1){ // pet died
		deathSetup();
	}
	else if (situation === 0) { // new pet
		birthSetup();
	}
}

function warningsColor(){
	$('.warnings').removeClass("negative positive winner");
}

function congrat(message){
	$('.warnings > p').text(message);
}

function petTalk() {
	var message = pet.message;
	$('.warnings > p').text(message);
}

function gameEnd() {
	var outcome = pet.tooPerfect();
	if (outcome === 1){ // pet got too balanced and died
		petDeath();
		petTalk();
	}
	else if (outcome === 2){ // pet won the game
		$('.warnings').addClass("winner");
		petTalk();
		setTimeout(fanfares, 1500);
	}
}

function fanfares(){
	$('.caption').text("Your porg is a champion!");
	$('.caption').css({color: "#f38a00", fontSize: "2rem"});
	$('.jumbotron').css("background", "linear-gradient(45deg, #FF9800, #FF5722)");
	$play_button.addClass("disabled");
	$feed_button.addClass("disabled");
	$sleep_button.addClass("disabled");
	$battleButton.hide();
}

function petDeath(){
		$('.warnings').removeClass("positive negative").addClass("negative");
		$battleButton.hide();
		setTimeout(killPet, 1500);
}

// EVENT LISTENERS

var $play_button = $('#play > a');
$play_button.on('click', function(e){
	pet.play();
	showStats();
	warningsColor();
	gameEnd();
});

var $feed_button = $('#feed > a');
$feed_button.on('click', function(e){
	pet.feed();
	showStats();
	warningsColor();
	gameEnd();
});

var $sleep_button = $('#sleep > a');
$sleep_button.on('click', function(e){
	pet.sleep();
	showStats();
	warningsColor();
	gameEnd();
});


var battlesWon = 0;

var $battleButton = $('#battle');
$battleButton.on('click', function(e){
	var petSum = pet.food + pet.happiness + pet.energy;
	var outcome = pet.battle(petSum);
	if (outcome === 0) { // pet died in battle
		petDeath();
		battlesWon = 0;
	}
	else {
		battlesWon += 1;
		$('.battleNumber').text(battlesWon);
		$('#battlesWon').show();
		$('.warnings').removeClass("positive negative").addClass("positive");
	}
	showStats();
});

var $resetButton = $('#reset');
$resetButton.on('click', function(e){
	location.reload();
})

var $quitButton = $('#quit');
var $quitConfirmButton = $('#quitConfirm');
$quitConfirmButton.on('click', function(e){
	window.location = "https://i.pinimg.com/736x/6d/92/e0/6d92e02d194cf1f7a43db25d4b3d7c21.jpg";
})

var $newGameButton = $('#newGame');
$newGameButton.on('click', function(e){
	location.reload();
})


function showButtons(situation){
	if (situation === 0){
		$resetButton.show();
		$battleButton.show();
		$quitButton.show();
		$newGameButton.hide();
	}
	else if (situation === 1){
		$resetButton.hide();
		$battleButton.hide();
		$quitButton.hide();
		$newGameButton.show();
	}
}



/* NOT WORKING CHUNK calling namePet();

// show modal to ask for name input, create pet if answer's length is valid
function namePet(){
	var $nameModal = $('#nameModal');
	var $answerField = $('#answerNameInput');
	var $answer = $('#answerNameInput').val();
	var $giveAnswer = $('#porgNameSave');
	$nameModal.modal('show');
	$nameModal.on('shown.bs.modal', function() {
  	$answerField.focus();
	});
		
	$giveAnswer.on('click', function(e){
		var $answer = $('#answerNameInput').val();
		$('#nameModal').modal('hide');
		showName($answer);
	});	
};
	
// checks if name is more than one symbol, then creates pet, shows game buttons, sets up visuals
function showName($answer) {
//	debugger;
	var $answerLength = $answer.length;
	if ($answerLength > 0) {
		startLife();
		changeMood(0); // restore original visual setup in case this function is invoked after one death event
		pet = createPet($answer);
		var message = "Congrats, your new Porg " + $answer.toUpperCase() + " was created successfully and got some life!\nInteract using the buttons above"
		$('.name').text($answer.toUpperCase());
		showStats();
		warning(message);
	}
	else {
//			location.reload();
		namePet();
	}
};

*/