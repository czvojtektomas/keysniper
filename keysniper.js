/**
 * KeySniper (verze 1.0.1)
 * © Tomáš Vojtek 2021
 * https://github.com/vojtektomascz/keysniper
 */

/* výchozí nastavení */
let ksEnabled = true; // zapnutí/vypnutí všech funkcí KeySniperu
let consoleOutput = true; // výstup příkazů do konzole
let keyboardShortcuts = true; // klávesové zkratky
let autoNext = false; // automatické přepnutí po dokončení
let autoRepeat = false; // automatické opakování při chybě
let correctType = false; // bezchybné psaní
let correctTypeErrors = 0; // chybovost při bezchybném psaní (0 = vypnuto, číslo větší než 0 = zapnuto - čím vyšší, tím menší pravděpodobnost chyby)
let showErrors = true; // zobrazování chyb v titulku stránky

/* kód */
function consoleOut(message) {
    if (consoleOutput && ksEnabled) console.log("[KS] " + message);
}
function showHelp() {
    if (ksEnabled) {
        console.log(`
    _  __           _____       _                 
   | |/ /          / ____|     (_)                             
   | ' / ___ _   _| (___  _ __  _ _ __  ___ _ __            KeySniper (verze 1.0.1)
   |  < / _ | | | ||___ || '_ || | '_ |/ _ | '__|           GitHub: https://github.com/vojtektomascz/keysniper
   | . ||  __/ |_| |____) | | | | | |_)|  __/ |             © Tomáš Vojtek 2021
   |_||_|___||__, |_____/|_| |_|_| .__/|___|_|              https://tomasvojtek.cz
              __/ |              | |              
             |___/               |_|              
   
             @@@@@@@@@@@@@@@@@@@@@@@@@@                     KLÁVESOVÉ ZKRATKY:
           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                   Ctrl + Shift      kompletní vypnutí veškerých funkcí KeySniperu
         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                 Ctrl + ↑          skrytí/odkrytí ATF lišty
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@               Ctrl + ↓          skrytí/odkrytí virtuální klávesnice
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@              Ctrl + Del        zobrazení nápovědy
   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           Ctrl + Alt        obnovení snímku
   @@@@  ...                             ..   @@@           Ctrl + ←          přepnutí snímku na předchozí
   @@@@,.*                                 , .@@@           Ctrl + →          přepnutí snímku na následující
   @@@@,*                                   ,,@@@           Ctrl + Enter      povolení/zakázání výstupu do konzole
   @@@@*(               @@@@                *,@@@           Ctrl + Z          povolení/zakázání automatického opakování při chybě
   @@@@*%             @@@@@@@@@@@@@         (,@@@           Ctrl + ,          povolení/zakázání bezchybného psaní
   @@@@*%            @@@@@@@@@#  @          (,@@@           Ctrl + Q          povolení/zakázání zobrazování chyb v titulku stránky
   @@@@*%            @@@@@,                 (,@@@           Ctrl + J          povolení/zobrazení automatického přepnutí snímku na následující po dokončení
   @@@@*%            @@@@@@                 (,@@@           
   @@@@*%           @@@@ @@@@               (,@@@           
   @@@@*%           @@@    @@@              (,@@@           
   @@@@*%         /@@@      @@@             (,@@@           
   @@@@*%       /@@          @@             (,@@@             
   @@@@*%                     @@@           (,@@@           
   @@@@*%**                               **(,@@@           
   @@@@**%**//****,,,,,......,,,,,,,****/**%,*@@@         
   @@@@#***&//****,,,,,.......,,,,,,****/%**,#@@@          
   @@@@,@##*,,,,,,,.....     .....,,,,,,,*##@,@@@          
   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           
     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@             
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@               
         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                 
           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                   
             @@@@@@@@@@@@@@@@@@@@@@@@@@                    
   
   `);
    }
}
const pageUrl = new URL(window.location).searchParams.get("page");
const catUrl = new URL(window.location).searchParams.get("cat");
if (catUrl == "edu" || pageUrl == "edu-typing" || catUrl == "grp") {
    let errors, position, positionTemp, correct;
    function resetPage() {
        if (ksEnabled) {
            position = -1;
            positionTemp = -1;
            errors = 0;
            showTitle();
        }
    }
    function showTitle() {
        showErrors ? document.title = errors + " ch" : document.title = "ATF - výuka psaní všemi deseti online bez reklam";
    }
    function newSnap(word) {
        resetPage();
        consoleOut("Snímek byl přepnut na " + word + " => " + document.getElementById("mess").innerText);
    }
    resetPage();
    showTitle();
    showHelp();
    document.addEventListener("keydown", function (e) {
        if (ksEnabled) {
            if (keyboardShortcuts) {
                if (e.ctrlKey && e.shiftKey) {
                    showErrors = false;
                    showTitle();
                    console.clear();
                    ksEnabled = false;
                } else if (e.ctrlKey && e.key == "Delete") { 
                    showHelp();
                } else if (e.ctrlKey && e.keyCode == '38') {
                    const menu = document.getElementById("cdribbon");
                    if (menu.style.display == "none") {
                        menu.style.display = "";
                        consoleOut("ATF lišta byla odkryta");
                    } else {
                        menu.style.display = "none";
                        consoleOut("ATF lišta byla skryta");
                    }
                } else if (e.ctrlKey && e.keyCode == '40') {
                    const keyboardHand = document.getElementById("board");
                    if (keyboardHand.style.display == "none") {
                        keyboardHand.style.display = "";
                        consoleOut("Virtuální klávesnice byla odkryta");
                    } else {
                        keyboardHand.style.display = "none";
                        consoleOut("Virtuální klávesnice byla skryta");
                    }
                } else if (e.ctrlKey && e.key == "Enter") {
                    if (consoleOutput) {
                        consoleOut("Výpis do konzole byl zakázán");
                        consoleOutput = false;
                    } else {
                        consoleOutput = true;
                        consoleOut("Výpis do konzole byl povolen");
                    }
                } else if (e.ctrlKey && e.key == 'a') {
                    if (keyboardShortcuts) {
                        keyboardShortcuts = false;
                        consoleOut("Klávesové zkratky byly zakázány");
                    } else {
                        keyboardShortcuts = true;
                        consoleOut("Klávesové zkratky byly povoleny");
                    }
                } else if (e.ctrlKey && e.key == 'z') {
                    if (autoRepeat) {
                        autoRepeat = false;
                        consoleOut("Automatické opakování snímku při chybě bylo zakázáno");
                    } else {
                        autoRepeat = true;
                        consoleOut("Automatické opakování snímku při chybě bylo povoleno");
                    }
                } else if (e.ctrlKey && e.key == ',') {
                    if (correctType) {
                        correctType = false;
                        consoleOut("Bezchybné psaní bylo zakázáno");
                    } else {
                        correctType = true;
                        consoleOut("Bezchybné psaní bylo povoleno");
                    }
                } else if (e.ctrlKey && e.key == 'q') {
                    if (showErrors) {
                        showErrors = false;
                        consoleOut("Zobrazování chyb v titulku stránky bylo zakázáno");
                    } else {
                        showErrors = true;
                        consoleOut("Zobrazování chyb v titulku stránky bylo povoleno");
                    }
                    showTitle();
                } else {
                    if (catUrl == "edu" || pageUrl == "edu-typing") {
                        if (e.ctrlKey && e.keyCode == '37') {
                            document.getElementById("prevSnap").click();
                        } else if (e.ctrlKey && e.keyCode == '39') {
                            document.getElementById("nextSnap").click();
                        } else if (e.ctrlKey && e.key == 'j') {
                            if (autoNext) {
                                autoNext = false;
                                consoleOut("Automatické přepnutí snímku po dokončení bylo zakázáno");
                            } else {
                                autoNext = true;
                                consoleOut("Automatické přepnutí snímku po dokončení bylo povoleno");
                            }
                        } else if (e.ctrlKey && e.altKey) {
                            document.getElementById("repeatSnap").click();
                        } else {
                            checkKey();
                        }
                    } else if (catUrl == "grp") {
                        if (e.ctrlKey && e.altKey) {
                            document.getElementById("repeatText").click();
                        } else {
                            checkKey();
                        }
                    }
                }
            } else {
                checkKey();
            }
            function checkKey() {
                const paper = document.getElementById("caret").innerText;
                const sentence = document.getElementById("original").innerText;
                const error = document.getElementById("correction").innerText.replace(/\s+/g, "");
                correct = "ANO";
                if (paper == "") position = -1;
                position++;
                if (sentence[position] == "¶" && e.key == "Enter") return true;
                if (sentence[position] != e.key) {
                    position--;
                    correct = "NE";
                    if (correctType) {
                        const rand = Math.round(Math.random() * correctTypeErrors);
                        if (rand == 0) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
                function checkKeyWord(key) {
                    switch(key) {
                        case " ":
                            return "mezera";
                            break;
                        case "¶":
                            return "enter";
                            break;
                        default:
                            return key;
                    }
                }
                correct == "NE" ? positionTemp = position + 1 : positionTemp = position;
                consoleOut("Platný znak: " + checkKeyWord(sentence[positionTemp]) + "  |  Zadaný znak: " + checkKeyWord(e.key) + "  |  Unicode: " + e.which + "  |  Správně: " + correct + "  |  KSindex: " + position);
                if (autoNext && sentence.includes("Počet chyb:")) document.getElementById("nextSnap").click();
                if (error.length > errors) {
                    if (autoRepeat) document.getElementById("repeatSnap").click();
                    errors++;
                    showTitle();
                }
            }
        }
    });
    if (catUrl == "edu" || pageUrl == "edu-typing") {
        document.getElementById("prevSnap").addEventListener("click", function() { newSnap("předchozí"); });
        document.getElementById("nextSnap").addEventListener("click", function() { newSnap("následující"); });
        document.getElementById("eduLection").addEventListener("change", function() { newSnap("lekci"); });
        document.getElementById("eduSublection").addEventListener("change", function() { newSnap("část lekce"); });
        document.getElementById("fileSnap").addEventListener("click", function() { newSnap("text ze souboru"); });
        document.getElementById("repeatSnap").addEventListener("click", function() {
            resetPage();
            consoleOut("Snímek byl obnoven");
        });
        document.getElementById("reverseSnap").addEventListener("click", function() { newSnap("snímek pozpátku"); });
        document.getElementById("errorSnap").addEventListener("click", function() { newSnap("snímek s chybnými slovy"); });
    } else if (catUrl == "grp") {
        document.getElementById("forwardText").addEventListener("click", function() {
            resetPage();
            consoleOut("Text byl natažen");
        });
        document.getElementById("repeatText").addEventListener("click", function() {
            resetPage();
            consoleOut("Text byl obnoven");
        });
    }
} else {
    consoleOut("KeySniper funguje pouze na stránkách \"Výuka CS Qwertz\" a \"Skupiny\"");
}
consoleOut("KeySniper byl úspěšně načten!");
