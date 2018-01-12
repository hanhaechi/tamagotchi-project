var gotchi = (function() { 
	
	function Pet(name,food,happiness,energy){

		this.name = name;
		this.food = food;
		this.happiness = happiness;
		this.energy = energy;

		this.THRESHOLDS = {
			death: 0,
			life: 3,
			deductionPoint: 20
		};

		this.LETHAL_ATTEMPTS = 0; // sequential interactions that have not been executed as they would kill the pet
		this.LETHAL_ATTEMPTS_TOLLERATED = 3;
		
		this.POSSIBLE_VALUES = { // how each action can change the current values
			play: {
				food: [-1, -2, -3],
				happiness: [3, 4, 5, 6],
				energy: [-1, -2, -3]
			},
			feed: {
				food: [2, 3, 4, 5],
				happiness: [1, 2, 3, 4],
				energy: [-2, -3, -4]
			},
			sleep: {
				food: [-2, -3, -4],
				happiness: [-1, 0, 1],
				energy: [3, 4, 5]
			}
		};
			
		// HELPER FUNCTIONS
		this.message;
			
		this.warning = function(message){
			console.log(message);
			this.message = message;
		}

		this.getRandom = function(array){
			//Takes an array
			//Returns a random item from that array
			var index = Math.floor(Math.random()*array.length);
			return array[index];
		}

		this.getRandomValues = function(possible_values){ //for example: this.POSSIBLE_VALUES.play
			//Takes an object in which each key is a list of numbers
			//Iterates through each key and creates a new object where each key contains one random number from each list
			var random_values = {};
			for (var key in possible_values){
				var item_array = possible_values[key];
				var random_number = this.getRandom(item_array);
				random_values[key] = random_number;
			}
			return random_values;
		}
		
		this.getCurrentValues = function(){ // get object with current values
			var currentValues = {
				food: this.food,
				happiness: this.happiness,
				energy: this.energy
			};
			return currentValues;
		}

		
		
		// FUNCTIONS TO DETECT AND HANDLE SITUATION WHEN PET IS IN DANGER-TO-DIE ZONE :))
		
		this.checkImpactDeath = function(valuesAfter){
			//Takes an object containing the values of the pet
			//Returns FALSE if adding new values to the current values WILL NOT KILL the pet
			//Returns TRUE if changes WILL KILL the pet
			for (var key in valuesAfter){
				var value = valuesAfter[key];
				//Check to make sure that the value is not less than death threshold
				if (value <= this.THRESHOLDS.death){
					return true
					}
				}
			return false
			}

		
		this.preventDeath = function(action_key) {
			// if action would have killed the pet, show relevant message, increase lethal.attempts count
			var message;
			switch (action_key) {
				case "play":
					message = "\n!!!!!!!!! Didn't PLAY as it would kill your porg !!!!!!!!!";
					this.LETHAL_ATTEMPTS++;
					break;
				case "feed":
					message = "\n!!!!!!!!! Didn't FEED as it would kill your porg !!!!!!!!!";
					this.LETHAL_ATTEMPTS++;
					break;
				case "sleep":
					message = "\n!!!!!!!!! Didn't SLEEP as it would kill your porg !!!!!!!!!";
					this.LETHAL_ATTEMPTS++;
					break;
			}
			this.warning(message);
			this.boost();
		}
		
		
		this.boost = function(){
			// if more than 3 lethal attempts either boost the lowest value, or tell user to try another action
			var message;
			if (this.LETHAL_ATTEMPTS >= this.LETHAL_ATTEMPTS_TOLLERATED) {
				var currentValues = this.getCurrentValues();
				var keys = Object.keys(currentValues);
				var keyValues = Object.values(currentValues);

				var smallestValue = Math.min(...keyValues);
				var smallestIndex = keyValues.indexOf(smallestValue);
				var theMinKey = keys[smallestIndex];
				var theMinKeyValue = keyValues.splice(smallestIndex,1);
				var secondSmallestValue = Math.min(...keyValues);
				
				if (secondSmallestValue < this.THRESHOLDS.life) {
					switch (theMinKey){
						case "food":
							this.food +=this.food;
							message = "\n^*^*^*^* Low on numbers? No problem! Your pet just got FOOD boost! ^*^*^*^*"
							this.LETHAL_ATTEMPTS = 0;
							break;
						case "happiness":
							this.happiness += this.happiness;
							message = "\n^*^*^*^* Low on numbers? No problem! Your pet just got HAPPINESS boost! ^*^*^*^*"
							this.LETHAL_ATTEMPTS = 0;
							break;
						case "energy":
							this.energy += this.energy;
							message = "\n^*^*^*^* Low on numbers? No problem! Your pet just got ENERGY boost! ^*^*^*^*"
							this.LETHAL_ATTEMPTS = 0;
							break;
					}
				}
				else {
					message = "\nWhy don't you try another action?"
					this.LETHAL_ATTEMPTS = 0;
				}
			this.warning(message);
			}
		}	
		
		
		this.checkForDanger = function(){
			// takes current values, checks if any of them are dangerously low
			// returns feedback message to the to user
			// if no death danger, checks for disbalance in points
			var message;
			var currentValues = this.getCurrentValues();
			var items = [];
			for (var key in currentValues){
				var value = currentValues[key];
				if (value <= this.THRESHOLDS.life){
					items.push(key.toUpperCase());
				}
			}
			if (items.length > 0) {
				message = "\nOwner! Do better with your porg's " + items;
				this.warning(message);
			} 
			else {
				this.checkForExcess(); 
			}
			
		}
		
		
		
		// FUNCTIONS TO CHECK FOR BALANCE IN PET LIFE AND HANDLE DISBALANCE :))
		
		this.checkForExcess = function(){
			// find the largest value and find the index of it
			// Save key name and value of the largest value into variables
			// Calculate remainder sum and if conditions are met
			// Return the name of the key and remainder Sum
			var message;
			var currentValues = this.getCurrentValues();
			var keys = Object.keys(currentValues);
			var keyValues = Object.values(currentValues);
			
			var largestValue = Math.max(...keyValues); 
			var largestIndex = keyValues.indexOf(largestValue); 
			var theMaxKey = keys[largestIndex]; 
			var theMaxKeyValue = keyValues.splice(largestIndex,1); 
			var remainderSum = keyValues.reduce((a, b) => a + b, 0);

			if (largestValue >= this.THRESHOLDS.deductionPoint && largestValue > remainderSum) {
				this.deductPoints(theMaxKey, remainderSum);
			}
			else {
				message = "\nYour porg is doing fine!";
				this.warning(message);
			}
		}
		
		
		this.deductPoints = function(theMaxKey, remainderSum){
			// cuts the highest value if disbalance is found and communicates the cut to the user
			var message;
			this[theMaxKey] = this[theMaxKey] - remainderSum;
				switch (theMaxKey) {
					case "food":
						message = "\nYour porg was too fat, so it got a surgery of -" + remainderSum + " points!"
						break;
					case "happiness":
						message = "\nYour porg was too happy. Gods just could not stand that and made him more miserable by deducting " + remainderSum + " points!"
						break;
					case "energy":
						message = "\nYour porg had too much energy. A special pill reduced energy by " + remainderSum + " points!"
						break;
				}
			this.warning(message);
		}
		
		
		
		this.tooPerfect = function(){
			// GAME OVER if all values > 33, pet dies if all values are equal at any point in the game
			var message;
			var outcome = 0;
			var currentValues = this.getCurrentValues();
			var keyValues = Object.values(currentValues);
			
			// traverses values array to see if all values are above a game win threshold
			function isAboveWinThreshold(value){
				return value > 33
			}
			
			if (keyValues[0] === keyValues[1] && keyValues[1] === keyValues[2]){
				message = "Your porg got too balanced and healthy. First Order does not like perfection or equal numbers, so we killed ze porg. Sorry not sorry..."
				outcome = 1;
				this.warning(message);
			}
			else if (keyValues.every(isAboveWinThreshold) === true){
				message = "Your porg exceeded the sum of 111 points and thus defeated the First Order! CONGRATULATIONS! Thanks for playing :)"
				outcome = 2;
				this.warning(message);
			}
			return outcome;
		}
		
		
		
		// MAIN ACTIONS AFFECTING PET VALUES
		
		this.executeAction = function(possible_values_action, action_key){ 
			// action key is a corresponding number to know what to communicate to the user
			var values = this.getRandomValues(possible_values_action);
			
			var valuesAfter = {
				food: this.food + values.food,
				happiness: this.happiness + values.happiness,
				energy: this.energy + values.energy
			};

			//Test to make sure that the pet is not going to die
			if (this.checkImpactDeath(valuesAfter) === false){
				this.food = valuesAfter.food;
				this.happiness = valuesAfter.happiness;
				this.energy = valuesAfter.energy;
				this.checkForDanger();
				}
			else{
				this.preventDeath(action_key);
			}
			return this.tooPerfect();
		};
		
		
		this.play = function(){
			return this.executeAction(this.POSSIBLE_VALUES.play, "play");
		}
		
		this.feed = function(){
			return this.executeAction(this.POSSIBLE_VALUES.feed, "feed");
		}
		
		this.sleep = function(){
			return this.executeAction(this.POSSIBLE_VALUES.sleep, "sleep");
		}		
		
		
		
		// FUNCTIONS TO CREATE BEAST FOR BATTLE AND BATTLE
		
		this.beast = function() {
			//function creating the beast for the battle with max being the half of the sum of the current values of the pet
			var currentValues = this.getCurrentValues();
			var values = Object.values(currentValues);
			var max_number = values.reduce((a, b) => a + b, 0)/2;
			var beastValues = [0,0,0];
			for (var i = 0; i < beastValues.length; i++){
				var number = Math.ceil(Math.random() * max_number);
				beastValues[i] = number;
			}
			return beastValues;
		}
		
		
		this.battle = function(){
			// pet vs beast battle function
			var message;
			var battleOutcome;
			var beastValues = this.beast();
			var petSum = this.food + this.happiness + this.energy;
			var beastSum = beastValues.reduce((a, b) => a + b, 0);

			if (petSum < beastSum){
				message = "Your porg LOST to the Order " + petSum + ":" + beastSum + " and went to porg heaven ...";
				this.warning(message);
				battleOutcome = 0;
			}
			else {
				message = "Yayyyyyyyyyy! \nYour porg WON the battle " + petSum + ":" + beastSum + '\nCONGRATULATIONS!';
				this.warning(message);
				battleOutcome = 1;
			}
			return battleOutcome;
		}
		
	}

		
	var module = {
		"Pet": Pet
	}
	return module;
})();

exports.data = gotchi;