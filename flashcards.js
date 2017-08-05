var fs = require("fs");
var inquirer = require("inquirer");
var library = require("./flashcardslibrary.json");
var basicCard = require("./basicCard.js")
var clozeCard = require("./clozeCard.js")
var drawnCard;
var playedCard;
var count = 0;

function openMenu() {
  inquirer.prompt([															
      {
          type: "list",														
          message: "\nPlease, choose an option?",	
          choices: ["Make", "Deal All", "Any Card", "Shuffle", "Exit"],
          name: "menuOptions"												
      }
  ]).then(function (answer) {												
    var waitMsg;

    switch (answer.menuOptions) {

        case 'Make':
            console.log("It's time to make some cards");
            // where is createCard defined? getting errors, I think you 
            // meant makeCard here
            waitMsg = setTimeout(makeCard, 1000);
            break;

        case 'Deal All':
            console.log("So you're taking on the whole deck");
            waitMsg = setTimeout(askQuestions, 1000);
            break;

        case 'Any Card':
            console.log("Here comes a random card");
            waitMsg = setTimeout(randomCard, 1000);
            break;

        case 'Shuffle':
            console.log("And everything gets shuffled");
            waitMsg = setTimeout(shuffleDeck, 1000);
            break;

        case 'Exit':
            console.log("We appreciate you playing flashcards");
            return;
            break;

        default:
            console.log("");
            console.log("I am afraid I can't do that Dave.");
            console.log("");
    }

  });

}

openMenu();


function makeCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "What type of flashcard do you want to make?",
            choices: ["Basic Card", "Cloze Card"],
            name: "cardType"
        }

    ]).then(function (appData) {

        var cardType = appData.cardType;  			
        console.log(cardType);			  			

        if (cardType === "Basic Card") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please type what you would like on the front of your card.",
                    name: "front"
                },

                {
                    type: "input",
                    message: "Please type what you would like on the back of the card.",
                    name: "back"
                }

            ]).then(function (cardData) {

                var cardObj = {						
                    type: "basicCard",
                    front: cardData.front,
                    back: cardData.back
                };
                library.push(cardObj);				
                fs.writeFile("flashcardlibrary.json", JSON.stringify(library, null, 2)); 

                inquirer.prompt([					
                    {
                        type: "list",
                        message: "Do you want to make another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (appData) {				
                    if (appData.anotherCard === "Yes") {	
                        makeCard();						
                    } else {								
                        setTimeout(openMenu, 1000);			
                    }
                });
            });

        } else {						
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please type out what you would like on the back your card.",
                    name: "text"
                },

                {
                    type: "input",
                    message: "Please type a section of your previous task to be removed.",
                    name: "cloze"
                }

            ]).then(function (cardData) {            
                var cardObj = {						
                    type: "clozeCard",
                    text: cardData.text,
                    cloze: cardData.cloze
                };
                if (cardObj.text.indexOf(cardObj.cloze) !== -1) {   
                    library.push(cardObj);							
                    fs.writeFile("flashcardlibrary.json", JSON.stringify(library, null, 2)); 
                } else {											
                    console.log("I'm sorry, I couldn't find that on the other side");

                }
                inquirer.prompt([					
                    {
                        type: "list",
                        message: "Would you like to make another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (appData) {				
                    if (appData.anotherCard === "Yes") {	
                        makeCard();						
                    } else {								
                        setTimeout(openMenu, 1000);		
                    }
                });
            });
        }

    });
};


function getQuestion(card) {
    if (card.type === "basicCard") {						
        drawnCard = new basicCard(card.front, card.back);	
        return drawnCard.front;								
    } else if (card.type === "clozeCard") {					
        drawnCard = new clozeCard(card.text, card.cloze)	
        return drawnCard.clozeRemoved();					
    }
};


function askQuestions() {
    if (count < library.length) {					
        playedCard = getQuestion(library[count]);	
        inquirer.prompt([							
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log("That is correct.");
            } else {
            	
                if (drawnCard.front !== undefined) { 
                    console.log(("Oops the answer was ") + library[count].back + "."); 
                } else { 
                    console.log(("Oops the answer was ") + library[count].cloze + ".");
                }
            }
            count++; 		
            askQuestions(); 
        });
    } else {
      	count=0;			
      	openMenu();			
    }
};

function shuffleDeck() {
  newDeck = library.slice(0);
  for (var i = library.length - 1; i > 0; i--) { 

      var getIndex = Math.floor(Math.random() * (i + 1));
      var shuffled = newDeck[getIndex];

      newDeck[getIndex] = newDeck[i];

      newDeck[i] = shuffled;
  }
  fs.writeFile("flashcardlibrary.json", JSON.stringify(newDeck, null, 2));
  console.log("The deck of flashcards have been shuffled");
}

function randomCard() {
  var randomNumber = Math.floor(Math.random() * (library.length - 1));  

  playedCard = getQuestion(library[randomNumber]);
        inquirer.prompt([							
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					
        	
            if (answer.question === library[randomNumber].back || answer.question === library[randomNumber].cloze) {
                console.log("That is correct");
                setTimeout(openMenu, 1000);
            } else {
            	
                if (drawnCard.front !== undefined) { 
                    console.log(("Oops the answer was ") + library[randomNumber].back + "."); 
                    setTimeout(openMenu, 1000);
                } else { 
                    console.log(("Oops the answer was ") + library[randomNumber].cloze + ".");
                    setTimeout(openMenu, 1000);
                }
            }
        });

};

function showCards () {

  var library = require("./flashcardLibrary.json");

  // this works, but you could use a loop here and remove the count variables below,
  // this is generally preferred for looping through an array as its more concise i.e.
  // for(var i=0; i < library.length; i++) {
  if (count < library.length) {                     

    // We can just check for library[count].front is "truthy" aka defined
    // and reverse the logic rather than checking for undefined.
    if (library[count].front) {
        console.log("");
        console.log("++++++++++++++++++ Cloze Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Text: " + library[count].text); 
        console.log("------------------------------------------------");
        console.log("Cloze: " + library[count].cloze + "."); 
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");
    } else {
        console.log("");
        console.log("++++++++++++++++++ Basic Card ++++++++++++++++++");
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("Front: " + library[count].front);
        console.log("------------------------------------------------");
        console.log("Back: " + library[count].back + "."); 
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log("");
    }
    count++;		
    showCards();	
  } else {
    count=0;		
    openMenu();		
  }
}
