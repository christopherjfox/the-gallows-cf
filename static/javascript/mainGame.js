/* 
 The Gallows 
 Christopher Fox 
 Lewis University Summer 2022 
 CPSC - 24700 - Web and Distributed Prog 
 Sound effects downloaded from Soundboard.com/sb/sound/939487 and  freesoundeffect.net/tags/cheers
*/

// Global Variables
var serverJson = {};
var secretWord,
    secretWordArray = [],
    hiddenWord = [],
    letterBank = [],
    turns,
    player = "",
    score = "", 
    hint = "",
    gameOver = new Boolean;


    /**************************************/    
    async function init (){
        setUpGame();  
        //console.log("hiddenword: " + hiddenWord + " Turns: " + " Player: " + player + " score: " + score);

        //set listeners for buttons
        document.getElementById("btn").onclick = function(){
            validateLetterBank();
        }
        document.getElementById("newGameBtn").onclick = function(){
            setUpGame();
        }
        document.getElementById("resetScoreBtn").onclick = function(){
            resetScore();
        }
    }

    /**************************************/    
    async function setUpGame(){
        turns = 0; 
        letterBank = [];
        hiddenWord = [];
        secretWordArray = [];    
        gameOver = false; 
        await loadServerData();
        await loadPageData ();
    }

    // function that calls serverfunctions to get game properties
    async function loadServerData(){
        await updateSecretWordHint();
        await updateSecretWord();
        await getSecretWord();
        await getSecretHint();
        await getPlayer(); 
        await getScore();
    }

    // paints defaulted values to page. 
        function loadPageData(){
        document.getElementById("guessedLetter").value = "";
        document.getElementById("winLoseBox").innerHTML = ("");
        document.getElementById("turns").innerHTML = ("");
        document.getElementById("turns").append("Turns: " + turns);
        document.getElementById("player").innerHTML = ("");
        document.getElementById("player").append("Player: " + player );
        document.getElementById("score").innerHTML = ("");
        document.getElementById("score").append("Score: " + score);
        document.getElementById("guessedLetters").innerHTML = (""); 
        document.getElementById("hint").innerHTML = ("");
        document.getElementById("hint").append( "Hint: " + "\"" + hint + "\""); 
        document.getElementById("image").innerHTML = ("");   
        for(i=0; i < secretWord.length; i ++){
            hiddenWord[i] = "*";
        }       
        updateSecretWordDisplay(); 
        makeArray(); 
    }


    /**************************************/
    // Takes user input and validates if it has been guessed already. 
    async function validateLetterBank(){
        var letterExists = false;
        let letter = "";
        letter = document.getElementById("guessedLetter").value;
        letter = letter.toUpperCase(); 
        if (letter === ""){
            document.getElementById("winLoseBox").innerHTML = ("");
            document.getElementById("winLoseBox").append("***You must enter in a value***");
        }else{
        console.log("valdiating letter: " + letter);
        console.log(letterBank.length);
            for (i=0; i < letterBank.length; i ++){
                if (letter === letterBank[i]){
                    document.getElementById("winLoseBox").innerHTML = ("");
                    document.getElementById("winLoseBox").append("***Letter already Guessed***");
                    letterExists = true;
            }}

            // puts letter in used letter bank if not already guessed. 
            if (letterExists === false){
                document.getElementById("winLoseBox").innerHTML = ("");
                letterBank.push(letter);
                console.log("adding " + letter + " letterbank " + letterBank);
                printLetterBank(letter);
                validateHiddenWord(letter);
            }
            document.getElementById("guessedLetter").value = "";
        }}

    /**************************************/
    // updates display of guessed letters
    async function printLetterBank(letter){
        letterBank.sort();
        document.getElementById("guessedLetters").innerHTML = "";
        document.getElementById("guessedLetters").append(letterBank);
    }


    /**************************************/
    //Checks to see if entered letter exists in secret word
    async function validateHiddenWord(letter){
        let foundLetter = false
        console.log("checking agains secret word");
        for (i=0; i < secretWord.length; i ++){
            if (letter === secretWord[i]){
                document.getElementById("winLoseBox").innerHTML = ("");
                //alert("letter exists");
                foundLetter = true;
            }  
        }
        // if letter not found add one turn taken and check if game is over 
        if (foundLetter === false){
                turns ++;
                document.getElementById("turns").innerHTML = ("");
                document.getElementById("turns").append("Turns: " + turns);
                checkRemainingTurns();
                if (gameOver === true){

                    document.getElementById("winLoseBox").innerHTML = ("");
                    document.getElementById("winLoseBox").innerHTML = ("");
                    var audio = new Audio('sounds/losing-horn.mp3');
                    audio.play();
                    document.getElementById("winLoseBox").append("***You have Lost*** ");
                    document.getElementById("winLoseBox").append("The Secret Word Was: " + secretWord);
                    //document.getElementById("winLoseBox").append(" Please hit the \"New Game\" button to start again");
                }
            }

        if (foundLetter === true){
            checkSecretWord(letter);
            checkWin();
        }
                    
        }


    /***********************************/
    //updates hidden word with selected letter
    async function checkSecretWord(letter){
        for (i=0; i < secretWord.length; i ++){
            if ( letter === secretWord[i]){
                    hiddenWord[i] = (secretWord[i]);
                    console.log("hidden word " + hiddenWord);
            }
        }
        updateSecretWordDisplay();
    }

    /***********************************/
    // displays updated hidden word to display
    async function updateSecretWordDisplay(){   
        document.getElementById("showWord").innerHTML = (""); 
        document.getElementById("showWord").append(hiddenWord);
    
    }

     /***********************************/
     // takes secret word and makes it an array to compare
    async function makeArray(){
        for (i=0; i < secretWord.length; i ++){
            secretWordArray.push(secretWord[i]);    
        }
        console.log("Converting secret word string to array " + secretWordArray);
    }

     /***********************************/
     //check if turns taken is maxed out
    async function checkRemainingTurns(){ 
        paintImage();                                                       
        if (turns >= 8){
            gameOver = true;
        }
    }

    /***********************************/
    //checking if player won
    async function checkWin(){
        let winner = true;
        console.log("checking winning " + hiddenWord + " " + secretWordArray);
        for (i=0; i<secretWordArray.length; i ++ ){
            if (secretWordArray[i] !== hiddenWord[i]){
                console.log("still missing letters ");
                winner = false;
            }
        }
        if(winner === true){
            document.getElementById("winLoseBox").innerHTML = ("");
            var audio = new Audio('sounds/crowd-cheer.mp3');
            audio.play();
            document.getElementById("winLoseBox").append("***Winner Winner***");
            updateScore();
        }
    }

    /***********************************/
    //updates hangman image on screen.
    async function paintImage (){
            var node = document.createElement("p");

        if (turns === 1){
            var img = document.createElement("img");
            img.src = "images/image0.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 2){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image1.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 3){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image2.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 4){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image3.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 5){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image4.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 6){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image5.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 7){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image6.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);}

        if (turns === 8){
            document.getElementById("image").innerHTML = (""); 
            var img = document.createElement("img");
            img.src = "images/image7.png";
            img.width = "550";
            img.height = "550";
            document.getElementById("image").append(img);
        }}       

    /***********************************/
    function resetGame(){
        init();
    }

    
    /**********calls from Client -> server -> database*************/
    /***********************************/
    async function updateSecretWord(){
        var secretWordResponse = await fetch('/updateSecretWord');
        var secretWordData = await secretWordResponse.text();
        console.log(secretWordData);
    }
    
    async function updateSecretWordHint(){
        var hintServerResponse = await fetch('/updateSecretWordHint');
        var hintServerData = await hintServerResponse.text();
        console.log(hintServerData);
    }

    
    /**********call to retrieve server data*************/
    /***********************************/
    async function getSecretWord(){
        var secretResponse = await fetch("/getSecretWord");
        var secretData = await secretResponse.text();
        console.log(secretData);
        secretWord = secretData; 
    }

    async function getSecretHint(){
        var hintResponse = await fetch("/getSecretWordHint");
        var hintData = await hintResponse.text();
        console.log(hintData);
        hint = hintData; 
    }

    async function getScore(){
        var scoreResponse = await fetch('/score');
        var scoreData = await scoreResponse.text();
        console.log("Printing score: " + scoreData);
        score = scoreData;
    }

    /***********************************/
    // Calling server to update score and return data //
    async function updateScore(){
        var scoreUpdate = await fetch('/updateScore');
        var updateScoreData = await scoreUpdate.text();
        console.log("Printing updated: score " + updateScoreData);
    }

    /***********************************/
    // resets score saved in server
    async function resetScore(){
        var resetScore = await fetch('/resetScore');
        var resetScoreData = await resetScore.text();
        console.log("score reset to 0");
        resetGame();
    }

    /***********************************/
    // Calling server to update player name and return data //
    async function getPlayer(){
        var playerResponse = await fetch('/getPlayerName');
        var playerData = await playerResponse.text();
        console.log("Printing score: " + playerData);
        player = playerData;
    }



