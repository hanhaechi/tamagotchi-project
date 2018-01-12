# tamagotchi-project
Digital pet game (web and command line interfaces). The first individual coding project 

last updated: Jan 11, 2018

FILE STRUCTURE
tamagotchi.js - the main logic file
index.html - main html file (using Bootstrap 4) - to play the game, open this file on browser window
style.css - main styling file
app.js - to play the game on web browser (the connector between tamagotchi.js and html / css files)
app_cmd.js - to play the gotchi game via command line interface (command node app_cmd.js)
favicon.ico - icon to be displayed on browser tab


ABOUT THE GOTCHI GAME
Created by Modesta Naciute as the first individual project during the coding program, it has the following features:

/// Game over when:
_ after the actions play/feed/sleep values are equal (pet dies)
_ user wins by achieving 30 points in each area (food / happiness / energy). It's not as easy as you think
_ user decides to leave :)

/// User side
_ give a NAME to a digital creature
_ augment it's numbers by playing, feeding, sleeping
_ engage in a digital battle with an invisible creature
_ reset own creature, quit the game


/// Logic side
1. Prompt user for the name of the creature  > create new pet with values 5,5,5 for food, happiness, energy, show congratulatory message for the user

2. When user chooses one of 3 main functions (play, feed, sleep), check for the impact of the action on the pet (checkImpactDeath()) > generate random numbers via (get.RandomValues()), check how adding them to the current values affects the pet (does it die or not). Death in this game is defined as at least one of the pet values reaching 0. 
  
3. If checkImpactDeath() returns true: 
	a) adjust values of the respective pet keys, give feedback on what action was performed and invoke checkForDanger() function to see if pet is in need of certain elements (food, happiness or water), and communicate that to the user, invoke checkForExcess()
	b) checkForExcess() checks if some value is disproportionately high. If value reaches certain threshold (currently the deductionPoint is set to 20) and is higher than the sum of the other two values, call deductPoints() to deduct this sum from the highest value, and communicate that to the user
	
4. If checkImpactDeath() returns false:
	a) invoke preventDeath() to show feedback message, and to prevent from stalemate (when two of the values are dangerously low) invoke pet.boost() function;
	b) if preventDeath() was invoked 3 times in a row (= user tried to perform an action that would kill the pet):
	c) check if the second lowest value is lower than life threshold. If it is lower, double the lowest parameter in value and show message to the user
	d) if it's not lower than life threshold nicely suggest user to try another action 

 5. Battle with invisible creature
 	a) create the beast using random numbers (with max number being half of the sum of the current pet values)
	b) if sum of beast values is higher than sum of pet values, pet dies automatically, else (if sum is equal or lower), pet wins.

6. If while playing the game user gains 30 points in each area (food, happiness, energy), game is over.6

7. If at any point during the game (from first action onwards), all the values are equal, pet dies
 
 
Thanks for your time exploring my project!

MODESTA NACIUTE
mnaciute@yahoo.com
