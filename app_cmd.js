var gotchi = require('./tamagotchi');

///////////////// READLINE SECTION ///////////////// 

// initiate readline
var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "\nWhat's next? \nPLAY (type p), FEED (f), SLEEP (s), BATTLE, (b), restart (r), quit (q) "
});

var pet;
var beast;

// create pet
function createPet(answer){
	var pet = new gotchi.data.Pet(answer,5,5,5);
	return pet;
}

// grab pet stats and formulate a legible message
function showStats() {
   var infoName = '\n' + pet.name.toUpperCase() + "'s life: ";
   var infoParameters = "Happiness: " + pet.happiness + ", Food: " + pet.food + ", Energy: " + pet.energy;
   var stats = infoName + infoParameters;
   return stats;
 }


// ask for name and create a new pet object
initiatePet = function(answer){
	pet = createPet(answer);
	var intro = "\nCongrats, your new Porg " + answer.toUpperCase() + " was created successfully!\n"
	console.log(intro, showStats());
	rl.prompt();
}

rl.question('How do you want to name your Porg? ', initiatePet);


rl.on('line', (line) => {
  switch (line) {
    case 'p':
			var outcome = pet.play();
      console.log(showStats());
			if (outcome === 1) {rl.question('\nNow, how do you want to name your NEW friend? ', initiatePet);}
			else if (outcome === 2) {console.log("\n~~~~~~~ Bye Bye! ~~~~~~~~"); process.exit(0);}
      break;
		case 'f':
			outcome = pet.feed();
      console.log(showStats());
			if (outcome === 1) {rl.question('\nNow, how do you want to name your NEW friend? ', initiatePet);}
			else if (outcome === 2) {console.log("\n~~~~~~~ Bye Bye! ~~~~~~~~"); process.exit(0);}
      break;
		case 's':
			outcome = pet.sleep();
      console.log(showStats());
			if (outcome === 1) {rl.question('\nNow, how do you want to name your NEW friend? ', initiatePet);}
			else if (outcome === 2) {console.log("\n~~~~~~~ Bye Bye! ~~~~~~~~"); process.exit(0);}
      break;
		case 'b':
			var answer = pet.battle(); // create beast, compare numbers, return 0 if pet died
			if (answer === 0) {rl.question('\nNow, how do you want to name your NEW friend? ', initiatePet);}
			break;
		case 'r':
			console.log("\n^^^^^^^ Your old porg " + pet.name.toUpperCase() + " was sent to a rescue shelter...! ^^^^^^^\n");
			rl.question('\nNow, how do you want to name your NEW friend? ', initiatePet);
      break;
		case 'q':
			console.log("\n~~~~~~~ See you later! ~~~~~~~~");
  		process.exit(0);
			break;
    default:
      console.log("\n******* Sorry, didn't get it! *******"); // if user typed in anything else than what is understood as proper commands
      break;
  }
  rl.prompt();
});

