/**
 * KeySniper (verze 1.0.3)
 * © Tomáš Vojtek 2022
 * https://github.com/vojtektomascz/keysniper
*/

/* výchozí nastavení */
const settings = {
    ksEnabled: true, // zapnutí/vypnutí všech funkcí KeySniperu
    consoleOutput: true, // výstup příkazů do konzole
    keyboardShortcuts: true, // klávesové zkratky
    autoNext: false, // automatické přepnutí po dokončení
    autoRepeat: false, // automatické opakování při chybě
    correctType: false, // bezchybné psaní
    correctTypeErrors: 10, // chybovost při bezchybném psaní (číslo větší než 0 = zapnuto - čím vyšší, tím menší pravděpodobnost chyby)
    correctTypeErrorsEnabled: false, // zapnutí/vypnutí chybovosti
    showErrors: false, // zobrazování chyb v titulku stránky
    sendSnapErrorsFrom: 0.00, // náhodná chybovost falešně odeslaného snímku (od)
    sendSnapErrorsTo: 0.00, // náhodná chybovost falešně odeslaného snímku (do)
    sendSnapSpeedFrom: 200, // náhodná rychlost falešně odeslaného snímku (od)
    sendSnapSpeedTo: 350 // náhodná rychlost falešně odeslaného snímku (do)
}

/* kód */
function consoleOut(message) {
    if (settings.consoleOutput && settings.ksEnabled) console.log("[KS] " + message);
}
function showHelp() {
    if (settings.ksEnabled) {
        console.log(`
    _  __           _____       _                 
   | |/ /          / ____|     (_)                             
   | ' / ___ _   _| (___  _ __  _ _ __  ___ _ __            KeySniper (verze 1.0.3)
   |  < / _ | | | ||___ || '_ || | '_ |/ _ | '__|           GitHub: https://github.com/vojtektomascz/keysniper
   | . ||  __/ |_| |____) | | | | | |_)|  __/ |             © Tomáš Vojtek 2022
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
   @@@@*%            @@@@@,                 (,@@@           Ctrl + M          povolení/zákázání automatického přepnutí snímku na následující po dokončení
   @@@@*%            @@@@@@                 (,@@@           Ctrl + .          povolení/zakázání automatické chybovosti při bezchybném psaní
   @@@@*%           @@@@ @@@@               (,@@@           Ctrl + Space      odeslání aktuálního snímku
   @@@@*%           @@@    @@@              (,@@@           Shift + ↑         zvýšení pravděpodobnosti chyby během bezchybného psaní o 1
   @@@@*%         /@@@      @@@             (,@@@           Shift + ↓         snížení pravděpodobnosti chyby během bezchybného psaní o 1
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
function sendSnap(username, lection, sublection, snap, speed, erroneous) {
    if (settings.ksEnabled) {
        if (username == undefined || isNaN(lection) || isNaN(sublection) || isNaN(snap)) {
            consoleOut("Snímek se nepodařilo odeslat - zadali jste neplatné parametry!");
        } else {
            if (speed == null) speed = Math.trunc(Math.random() * (settings.sendSnapSpeedFrom - settings.sendSnapSpeedTo)) + settings.sendSnapSpeedTo;
            if (erroneous == null) erroneous = parseFloat(Math.random() * (settings.sendSnapErrorsFrom - settings.sendSnapErrorsTo) + settings.sendSnapErrorsTo);
            if (isNaN(speed) || isNaN(erroneous)) consoleOut("Snímek se nepodařilo odeslat - zadali jste neplatnou rychlost nebo chybovost!");
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText.includes("nenalezen")) {
                        consoleOut("Snímek se nepodařilo odeslat - uživatel nebyl nalezen v databázi!");
                    } else if (this.responseText.includes("OK")) {
                        consoleOut("Snímek byl úspěšně odeslán!");
                    } else {
                        consoleOut("Snímek se nepodařilo odeslat!");
                    }
                }
            }
            xhttp.open("GET", "https://www.atfonline.cz/saveSnapResult.php?username=" + username + "&normal=YES&lection=" + lection + "&sublection=" + sublection + "&snap=" + snap + "&fortime=-1&speed=" + speed + "&erroneous=" + erroneous.toFixed(2) + "&corrmode=YES", true);
            xhttp.send();
        }
    }
}
const pageUrl = new URL(window.location).searchParams.get("page");
const catUrl = new URL(window.location).searchParams.get("cat");
if (catUrl == "edu" || pageUrl == "edu-typing" || catUrl == "grp") {
    let errors, position, positionTemp, correct, trueErrors, consoleOutputTemp;
    function resetPage() {
        if (settings.ksEnabled) {
            position = -1;
            positionTemp = -1;
            errors = 0;
            trueErrors = 0;
            showTitle();
        }
    }
    function showTitle() {
        settings.showErrors ? document.title = errors + " ch" : document.title = "ATF - výuka psaní všemi deseti online bez reklam";
    }
    function newSnap(word) {
        resetPage();
        consoleOut("Snímek byl přepnut na " + word + " => " + document.getElementById("mess").innerText);
    }
    resetPage();
    showTitle();
    showHelp();
    document.addEventListener("keydown", function (e) {
        if (settings.ksEnabled) {
            if (settings.keyboardShortcuts) {
                function checkDisplay(item) {
                    const itemID = document.getElementById(item);
                    if (itemID.style.display == "none") {
                        itemID.style.display = "";
                        return false;
                    } else {
                        itemID.style.display = "none";
                        return true;
                    }
                }
                function checkValue(value) {
                    settings[value] = !settings[value];
                    if (settings[value]) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (e.ctrlKey && e.shiftKey) {
                    settings.showErrors = false;
                    showTitle();
                    console.clear();
                    settings.ksEnabled = false;
                } else if (e.ctrlKey && e.key == "Delete") { 
                    showHelp();
                } else if (e.ctrlKey && e.keyCode == '38') {
                    checkDisplay("cdribbon") ? consoleOut("ATF lišta byla skryta") : consoleOut("ATF lišta byla odkryta"); 
                } else if (e.ctrlKey && e.keyCode == '40') {
                    checkDisplay("board") ? consoleOut("Virtuální klávesnice byla skryta") : consoleOut("Virtuální klávesnice byla odkryta");
                } else if (e.ctrlKey && e.key == "Enter") {
                    checkValue("consoleOutput") ? consoleOut("Výpis do konzole byl povolen") : consoleOut("Výpis do konzole byl zakázán");
                } else if (e.ctrlKey && e.key == 'a') {
                    checkValue("keyboardShortcuts") ? consoleOut("Klávesové zkratky byly povoleny") : consoleOut("Klávesové zkratky byly zakázány");
                } else if (e.ctrlKey && e.key == 'z') {
                    checkValue("autoRepeat") ? consoleOut("Automatické opakování snímku při chybě bylo povoleno") : consoleOut("Automatické opakování snímku při chybě bylo zakázáno");
                } else if (e.ctrlKey && e.key == ',') {
                    checkValue("correctType") ? consoleOut("Bezchybné psaní bylo povoleno") : consoleOut("Bezchybné psaní bylo zakázáno");
                } else if (e.ctrlKey && e.key == 'q') {
                    checkValue("showErrors") ? consoleOut("Zobrazování chyb v titulku stránky bylo povoleno") : consoleOut("Zobrazování chyb v titulku stránky bylo zakázáno");
                    showTitle();
                } else if (e.ctrlKey && e.key == '.') {
                    checkValue("correctTypeErrorsEnabled") ? consoleOut("Automatická chybovost byla povolena") : consoleOut("Automatická chybovost byla zakázána");
                } else if (e.shiftKey && e.keyCode == '38') {
                    settings.correctTypeErrors++;
                    consoleOut("Pravděpodobnost chybovosti byla navýšena o 1");
                } else if (e.shiftKey && e.keyCode == '40') {
                    settings.correctTypeErrors--;
                    if (settings.correctTypeErrors <= 0) settings.correctTypeErrors++;
                    consoleOut("Pravděpodobnost chybovosti byla snížena o 1");
                } else {
                    if (catUrl == "edu" || pageUrl == "edu-typing") {
                        if (e.ctrlKey && e.keyCode == '37') {
                            document.getElementById("prevSnap").click();
                        } else if (e.ctrlKey && e.keyCode == '39') {
                            document.getElementById("nextSnap").click();
                        } else if (e.ctrlKey && e.key == 'm') {
                            checkValue("autoNext") ? consoleOut("Automatické přepnutí snímku po dokončení bylo povoleno") : consoleOut("Automatické přepnutí snímku po dokončení bylo zakázáno");
                        } else if (e.ctrlKey && e.altKey) {
                            document.getElementById("repeatSnap").click();
                        } else if (e.ctrlKey && e.keyCode == '32') {
                            let mess = document.getElementById("mess").innerText;
                            let lection = parseInt(mess.match(/\d+/));
                            let sublection = parseInt(document.getElementById("eduSublection").value);
                            let snap;
                            lection > 9 ? snap = parseInt(mess.replace(/[^0-9]/g, '')[2]) : snap = parseInt(mess.replace(/[^0-9]/g, '')[1]);
                            sendSnap(eduProfile.userName, lection, sublection, snap, null, null);
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
                if ((sentence[position] == "¶" && e.key == "Enter") || (sentence[position] == "—" && e.key == "-") || e.key == "F12" || e.key == "F5") return true;
                if (sentence[position] != e.key) {
                    position--;
                    trueErrors++;
                    if (e.keyCode == '8' || e.ctrlKey) trueErrors--;
                    if (settings.correctType) {
                        if (settings.correctTypeErrors <= 0) correctTypeErrors = 1;
                        let rand;
                        settings.correctTypeErrorsEnabled ? rand = Math.trunc(Math.random() * settings.correctTypeErrors) : rand = 1;
                        if (rand > 0) {
                            if (settings.autoRepeat) document.getElementById("repeatSnap").click();
                            e.preventDefault();
                            return false;
                        }
                    } else {
                         if (settings.autoRepeat) {
                             document.getElementById("repeatSnap").click();
                             e.preventDefault();
                             return false;
                         }
                    }
                    correct = "NE";
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
                if (settings.autoNext && sentence.includes("Počet chyb:")) document.getElementById("nextSnap").click();
                if (error.length > errors) {
                    errors++;
                    showTitle();
                }
                consoleOut("Platný znak: " + checkKeyWord(sentence[positionTemp]) + "  |  Zadaný znak: " + checkKeyWord(e.key) + "  |  Unicode: " + e.which + "  |  Správně: " + correct + "  |  KSindex: " + position + "  |  Počet chyb: " + errors + "  |  Počet pochybení: " + trueErrors);
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
