/**
 * --------------------------------------------------------Animation------------------------------------------------------
 */

// symbolic constants
const oneSecond = 1000;
const fps = 24;
const firstIndex = 0;

/**
 * Get Images
 */
var images = [];

for (let i = 1; i <= 21; i++) {

    images.push(`images/bk${i}.png`);
}

/**
 * Animate Images
 */
var stop = false; // image is static by default
var imagesIndex = firstIndex; // first image in images

function animate() {

    document.slide.src = images[imagesIndex]; // static frame is first frame

    console.log((animationStage));

    if (imagesIndex < animationStage) { // increments during animation
        imagesIndex++;
    } else {
        stop = true;
        animationStage += 4;
    }

    if (stop) { // if paused
        cancelAnimationFrame(animate);
        stop = false;
    } else {
        setTimeout(() => { // caps animation to fps constant
            requestAnimationFrame(animate); // resumes
        }, oneSecond / fps);
    }
}

/**
 * --------------------------------------------------------Hangman--------------------------------------------------------
 */

var guesses = 6; // errors you can make until you lose
var animationStage = 0;

/**
 * Filters out characters that aren't recognized input; can't be guessed by the player
 */
const wordRegex = /[A-Za-z0-9 ]/g;

for (let i = 0; i < Object.keys(data).length; i++) {

    keys = Object.keys(data);
    keys[i] = (keys[i].match(wordRegex)).join("");
}

/**
 * Chooses a title of a random Nintendo 64 game
 * @param {*} dictionary
 * @returns title of a random Nintendo 64 game
 */
function chooseTitle(dictionary) {

    const keys = Object.keys(dictionary);

    return keys[Math.floor(Math.random() * keys.length)]
}

var chosenTitle = chooseTitle(data); // stores a random title

var chosenTitleBank = []; // for the word being guessed's innherHTML

for (let i = 0; i < chosenTitle.length; i++) { // placeholders at the beginning of the game

    if (chosenTitle.charAt(i) == " ") {
        chosenTitleBank.push(" ");
    } else {
        chosenTitleBank.push("_");
    }
}

var characterBank = [ // characters that can be chosen
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
];

/**
 * When an A-Z or 0-9 key is clicked
 */
if (guesses != 0 || $("#word").html() == chosenTitle.toUpperCase()) {

}
window.addEventListener("keydown", function (e) {

    let key = e.key.toUpperCase();

    if (characterBank.includes(key) && guesses != 0 && $("#word").html() != chosenTitle.toUpperCase()) {

        characterBank.splice(characterBank.indexOf(key), 1); // remove chosen character from the available bank
        $("#bank").html(characterBank.join(" ")); // update the html of the bank
        checkCharacter(key); // check if guess is right or wrong
    }
})

/**
 * Checks if the player guessed right
 * @param {*} character the character to check
 */
function checkCharacter(character) {

    if (chosenTitle.toUpperCase().includes(character)) { // right guess

        rightGuess(character);

    } else { // wrong guess

        wrongGuess();
    }
}

/**
 * When the player guesses right
 * @param {*} character the character to add to the secret word html
 */
function rightGuess(character) {

    /**
     * Looks for character in the title
     */
    for (let i = 0; i < chosenTitle.toUpperCase().length; i++) {

        if (chosenTitle.toUpperCase().charAt(i) == character) {
            chosenTitleBank[i] = character;
            $("#word").html(chosenTitleBank.join(""));
        }
    }

    /**
     * If the player is able to guess the word
     */
    if ($("#word").html() == chosenTitle.toUpperCase()) {

        /**
         * Animates in reverse
         */
        images = images.reverse();
        animationStage = 20;
        imagesIndex = animationStage - imagesIndex;
        animate();

        $("#word").css("color", "green");

        /**
         * Opportunity to restart the game
         */
        $("#replay").css("visibility", "visible");
    }
}

/**
 * When the player guesses wrong
 */
function wrongGuess() {

    guesses -= 1;
    animate();

    /**
     * Update html of guesses counter
     */
    $("#status").html("Hint: " + data[chosenTitle]["Genres"].join(", ") + ", Remaining Guesses: " + guesses);

    /**
     * If the player ran out of guesses
     */
    if (guesses == 0) {

        $("#word").html(chosenTitle);
        $("#word").css("color", "red");

        /**
         * Opportunity to restart the game
         */
        $("#replay").css("visibility", "visible");
    }
}

// Setup before the beginning of the game

$("#bank").html(characterBank.join(" ")); // available characters
$("#word").html(chosenTitleBank.join("")); // word to guess

// Hint and guesses

$("#status").html("Hint: " + data[chosenTitle]["Genres"].join(", ") + ", Remaining Guesses: " + guesses); 