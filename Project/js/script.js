/**
 * @author Derek D'Souza 
 * @credit Nintendo Co., Ltd., Rare Ltd., Microsoft Co. for materials used
 */

/**
 * --------------------------------------------------------Animation------------------------------------------------------
 */

// Symbolic constants
const fps = 24;
const firstIndex = 0;
const imageQuantity = 21;

/**
 * Get Images
 */
var images = [];

for (let i = 1; i <= imageQuantity; i++) {

    images.push(`images/bk${i}.png`);
}

/**
 * Animate Images
 */
var stop = false; // Image is static by default
var imagesIndex = firstIndex; // First image in images

function animate() {

    document.slide.src = images[imagesIndex]; // Static frame is first frame

    if (imagesIndex < animationStage) { // Animates in increments
        imagesIndex++;
    } else {
        stop = true;
        animationStage += 4; // Animation is only enabled the second wrong guess
    }

    if (stop) { // If paused
        cancelAnimationFrame(animate);
        stop = false;
    } else {
        setTimeout(() => { // Caps animation to fps constant
            requestAnimationFrame(animate); // Resumes
        }, 1000 / fps);
    }
}

/**
 * Popup
 */

// When the user waits 3 seconds, open the popUp 
setTimeout(function () {

    if (!start) {
        $("#popUp").fadeIn(1000);
    }
}, 3000);

// When the user clicks on <span> (x), close the popUp
$("#close").on("click", function () {
    $("#popUp").css("display", "none");
})

/**
 * --------------------------------------------------------Hangman--------------------------------------------------------
 */

// Symbolic constants
const chosenTitle = chooseTitle(data);

const correct = $(".sfx")[0];
const incorrect = $(".sfx")[1];
const win = new $(".sfx")[2];
const lose = new $(".sfx")[3];

/**
 * Game object, stores title and genres
 */
const game = {

    title: chosenTitle,
    genres: data[chosenTitle]["Genres"].join(", ")
}

var guesses = 6; // Errors you can make until you lose
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
 * @returns Title of a random Nintendo 64 game
 */
function chooseTitle(dictionary) {

    const keys = Object.keys(dictionary);

    return keys[Math.floor(Math.random() * keys.length)]
}

var chosenTitleBank = []; // For the word being guessed's innherHTML

for (let i = 0; i < game.title.length; i++) { // Placeholders at the beginning of the game

    if (game.title.charAt(i) == " ") {
        chosenTitleBank.push(" ");
    } else {
        chosenTitleBank.push("_");
    }
}

var characterBank = [ // Characters that can be chosen
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
];

/**
 * When an A-Z or 0-9 key is clicked
 */
if (guesses != 0 || $("#title").html() == game.title.toUpperCase()) {

}
window.addEventListener("keydown", function (e) {

    start = true;
    let key = e.key.toUpperCase();

    if (characterBank.includes(key) && guesses != 0 && $("#title").html() != game.title.toUpperCase()) {

        characterBank.splice(characterBank.indexOf(key), 1); // Remove chosen character from the available bank
        $("#bank").html(characterBank.join(" ")); // Update the html of the bank
        checkCharacter(key); // Check if guess is right or wrong
    }
})

/**
 * Checks if the player guessed right
 * @param {*} character the character to check
 */
function checkCharacter(character) {

    if (game.title.toUpperCase().includes(character)) { // right guess

        rightGuess(character);

    } else { // Wrong guess

        wrongGuess();
    }
}

/**
 * When the player guesses right
 * @param {*} character The character to add to the secret word html
 */
function rightGuess(character) {

    correct.play(); // "Correct" sound effect feedback

    /**
     * Looks for character in the title
     */
    for (let i = 0; i < game.title.toUpperCase().length; i++) {

        if (game.title.toUpperCase().charAt(i) == character) {
            chosenTitleBank[i] = character;
            $("#title").html(chosenTitleBank.join(""));
        }
    }

    /**
     * If the player is able to guess the word
     */
    if ($("#title").html() == game.title.toUpperCase()) {

        win.play(); // "Win" sound effect feedback

        /**
         * Animates in reverse
         */
        images = images.reverse();
        animationStage = 20;
        imagesIndex = animationStage - imagesIndex;
        animate();

        $("#title").css("color", "green");

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

    incorrect.play(); // "Incorrect" sound effect feedback

    guesses -= 1;
    animate();

    /**
     * Update html of guesses counter
     */
    $("#status").html("Hint: " + game.genres + ", Remaining Guesses: " + guesses);

    /**
     * If the player ran out of guesses
     */
    if (guesses == 0) {

        lose.play(); // "Lose" sound effect feedback

        $("#title").html(game.title);
        $("#title").css("color", "red");

        /**
         * Opportunity to restart the game
         */
        $("#replay").css("visibility", "visible");
    }
}


// Setup before the beginning of the game

$("#bank").html(characterBank.join(" ")); // Available characters
$("#title").html(chosenTitleBank.join("")); // Word to guess

// Hint and guesses

$("#status").html("Hint: " + game.genres + ", Remaining Guesses: " + guesses);

var start = false;