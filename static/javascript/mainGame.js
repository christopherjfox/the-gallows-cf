

const url = "/hangmanProperties";
var serverJson = {};
var secretWord,
    secretWordArray = [],
    hiddenWord = [],
    letterBank = [],
    turns,
    player = "",
    score = 0, 
    gameOver = new Boolean;


    /**************************************/    
    async function init (){
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        serverJson = data;
        console.log(serverJson);
        
        setUpGame();  
        console.log("hiddenword: " + hiddenWord + " Turns: " + " Player: " + player + " score: " + score);

        document.getElementById("btn").onclick = function(){
            validateLetterBank();
        }
    }

    /**************************************/    
    async function setUpGame(){
        secretWord = serverJson.hangmanProperties.Secret;
        player = serverJson.hangmanProperties.Player;
        Hint = serverJson.hangmanProperties.Hint;
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
                }
            }
            if (letterExists === false){
                letterBank.push(letter);
                console.log("adding " + letter + " letterbank " + letterBank);
                printLetterBank(letter);
                validateHiddenWord(letter);
            }
            document.getElementById("guessedLetter").value = "";
        }
    }


    /**************************************/
    async function printLetterBank(letter){
        letterBank.sort();
        document.getElementById("guessedLetters").innerHTML = "";
        document.getElementById("guessedLetters").append(letterBank);
        /*if (letterBank.length > 1){
            document.getElementById("guessedLetters").append(", " + letter);
        }else{ 
            document.getElementById("guessedLetters").append(letter);
        }*/
    }


    /**************************************/
    async function validateHiddenWord(letter){
        let foundLetter = false
        console.log("checking agains secrete word");
        for (i=0; i < secretWord.length; i ++){
            if (letter === secretWord[i]){
                alert("letter exists");
                foundLetter = true;
            }  
        }
        if (foundLetter === false){
                turns ++;
                document.getElementById("turns").innerHTML = ("");
                document.getElementById("turns").append(turns);
                checkRemainingTurns();
            }
        if (foundLetter === true){
            displaySecretWord(letter);
            checkWin();
        }
      
        if (gameOver === true){
            alert("The game is over! you have lost");
            resetGame();
        } 
    }


    /***********************************/
    async function displaySecretWord(letter){
        for (i=0; i < secretWord.length; i ++){
            if ( letter === secretWord[i]){
                    hiddenWord[i] = (secretWord[i]);
                    console.log("hidden word " + hiddenWord);
            }
        }
        updateSecretWordDisplay();
    }

    /***********************************/
    async function updateSecretWordDisplay(){   
        document.getElementById("showWord").innerHTML = (""); 
        document.getElementById("showWord").append(hiddenWord);
    
    }

     /***********************************/
    async function makeArray(){
        for (i=0; i < secretWord.length; i ++){
            secretWordArray.push(secretWord[i]);    
        }
        console.log("Converting secret word string to array " + secretWordArray);
    }

     /***********************************/
    async function checkRemainingTurns(){ 
        paintImage();                                                       
        if (turns >= 10){
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
                score = score + 1; 
                resetGame();
            }else{
                console.log("New game aborted");
            }
        }
    }

    async function paintImage (){
            var node = document.createElement("p");

        if (turns === 1){
            var textnode = document.createTextNode("Strike 1");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 2){
            var textnode = document.createTextNode("Strike 2");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 3){
            var textnode = document.createTextNode("Strike 3");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 4){
            var textnode = document.createTextNode("Strike 4");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 5){
            var textnode = document.createTextNode("Strike 5");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 6){
            var textnode = document.createTextNode("Strike 6");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 7){
            var textnode = document.createTextNode("Strike 7");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 8){
            var textnode = document.createTextNode("Strike 8");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}

        if (turns === 9){
            var textnode = document.createTextNode("Strike 9");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}
        if (turns === 10){
            var textnode = document.createTextNode("Strike 10");
            node.appendChild(textnode);
            document.getElementById("image").appendChild(node);}
        }       

     /***********************************/
    function resetGame(){
        init();
    }



