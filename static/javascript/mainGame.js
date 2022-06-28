

const jsonURL = "/hangmanProperties";

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
        await setUpGame();  
        console.log("hiddenword: " + hiddenWord + " Turns: " + " Player: " + player + " score: " + score);

        document.getElementById("btn").onclick = function(){
            validateLetterBank();
        }
    }

    /**************************************/    
    async function setUpGame(){
        await updateSecretWord();
        await getSecretWord();
        await getSecretHint();
        await getPlayer(); 
        await getScore();
        //secretWord = serverJson.hangmanProperties.Secret;
        //Hint = serverJson.hangmanProperties.Hint;
        gameOver = false; 
        turns = 0; 
        letterBank = [];
        hiddenWord = [];
        secretWordArray = [];
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
    async function validateLetterBank(){
        var letterExists = false;
        let letter = "";
        letter = document.getElementById("guessedLetter").value;
        letter = letter.toUpperCase(); 
        if (letter === ""){
            alert("you must enter in a letter");
        }else{
        console.log("valdiating letter: " + letter);
        console.log(letterBank.length);
            for (i=0; i < letterBank.length; i ++){
                if (letter === letterBank[i]){
                    alert("letter already guessed");
                    letterExists = true;
            }}

            if (letterExists === false){
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
        console.log("checking agains secrete word");
        for (i=0; i < secretWord.length; i ++){
            if (letter === secretWord[i]){
                alert("letter exists");
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
                    if (confirm("The game is over! you have lost\n" +
                        "Would you like to start another game?")){
                        console.log("New Game Starting");
                        resetGame();
                    }else{
                        console.log("New game aborted");
                    }
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
            if (confirm("Congratulations you have won the game!\n" +
                        "Would you like to start another game?")){
                console.log("New Game Starting");
                updateScore();
                resetGame();
            }else{
                console.log("New game aborted");
            }
        }
    }

    /***********************************/
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

    
    
    /**********Server calls from Client*************/
    /***********************************/
    async function updateSecretWord(){
        var secretWordResponse = await fetch('/updateSecreteWord');
        var secretWordData = await secretWordResponse.text();
        console.log(secretWordData);

        var hintServerResponse = await fetch('/updateSecreteWordHint');
        var hintServerData = await hintServerResponse.text();
        console.log(hintServerData);
    }

    
    
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



    /**********Server calls from Client*************/
    /***********************************/
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
    // Calling server to update player name and return data //
    async function getPlayer(){
        var playerResponse = await fetch('/getPlayerName');
        var playerData = await playerResponse.text();
        console.log("Printing score: " + playerData);
        player = playerData;
    }



