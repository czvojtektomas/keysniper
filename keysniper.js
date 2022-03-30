/**
 * KeySniper (verze 2.0.1)
 * © Tomáš Vojtek 2022
 * https://github.com/vojtektomascz/keysniper
*/

// výchozí nastavení
const settings = {
    consoleOutput: true, // výstup příkazů do konzole
    keyboardShortcuts: true, // klávesové zkratky
    autoNext: false, // automatické přepnutí snímku na následující po dokončení
    autoRepeat: false, // automatické opakování při chybě
    correctType: false, // bezchybné psaní
    correctTypeErrors: 10, // chybovost při bezchybném psaní (číslo > 0 = zapnuto - čím vyšší, tím menší pravděpodobnost chyby)
    correctTypeErrorsEnabled: false, // zapnutí/vypnutí chybovosti při bezchybném psaní
    showTab: false, // zobrazování chyb, rychlosti a času v titulku stránky
    askBeforeSend: true, // zeptat se na rychlost a chybovost při falešném odeslání snímku
    sendSnapErrorsFrom: 0.0, // náhodná chybovost falešně odeslaného snímku (od)
    sendSnapErrorsTo: 0.0, // náhodná chybovost falešně odeslaného snímku (do)
    sendSnapSpeedFrom: 200, // náhodná rychlost falešně odeslaného snímku (od)
    sendSnapSpeedTo: 350, // náhodná rychlost falešně odeslaného snímku (do)
    chatServer: "https://vojtek.php5.cz/projects/keysniper/chat.php", // server pro chat
    fightServer: "https://vojtek.php5.cz/projects/keysniper/fight.php" // server pro fight
  };
  
  // klávesové zkratky (Ctrl + ...)
  const shortcuts = [
    ["skrytí/odkrytí ATF lišty", "ArrowUp"],
    ["skrytí/odkrytí virtuální klávesnice", "ArrowDown"],
    ["přepnutí snímku na následující", "ArrowRight"],
    ["přepnutí snímku na předchozí", "ArrowLeft"],
    ["zobrazení nápovědy", "Shift"],
    ["povolení/zakázání výstupu příkazů do konzole", "Enter"],
    ["povolení/zakázání klávesových zkratek", "A"],
    ["povolení/zakázání automatického opakování při chybě", "Z"],
    ["", "Q"],
    ["povolení/zakázání automatického přepnutí snímku na následující po dokončení", ";"],
    ["povolení/zakázání bezchybného psaní", ","],
    ["odeslání aktuálního snímku", "Space"],
    ["", "Delete"],
    ["", "."],
    ["", "*"], 
    ["", "/"]
  ];
  
  // výstup do konzole
  function consoleOut(message) {
    if (settings.consoleOutput) console.log("[KS] " + message);
  }
  
  // nápověda
  function showHelp() {
    let text = `
     _  __           _____       _
    | |/ /          / ____|     (_)
    | ' / ___ _   _| (___  _ __  _ _ __  ___ _ __
    |  < / _ | | | ||___ || '_ || | '_ |/ _ | '__|
    | . ||  __/ |_| |____) | | | | | |_)|  __/ |
    |_||_|___||__, |_____/|_| |_|_| .__/|___|_|
               __/ |              | |
              |___/               |_|
  
  //////  KeySniper 2.0.1
  ////    © Tomáš Vojtek ${new Date().getFullYear()} 
  ///     ******************************************
  //      Web: https://tomasvojtek.cz 
  /       GitHub: https://github.com/vojtektomascz
  
  
KLÁVESOVÉ ZKRATKY:
`;
  for (let i = 0; i < shortcuts.length; i++) text += "Ctrl + " + shortcuts[i][1] + " => " + shortcuts[i][0] + "\n";
  console.log(text);
  }
  function updateDisplay(item, name, t, f) {
    const element = document.getElementById(item);
    let syntax = name + " ";
    if (element.style.display == "none") {
      element.style.display = "";
      syntax += t;
    } else {
      element.style.display = "none";
      syntax += f;
    }
    return syntax;
  }
  function updateSettings(item, name, t, f) {
    settings[item] = !settings[item];
    let syntax = name + " ";
    settings[item] ? syntax += t : syntax += f;
    return syntax;
  }
  function sendSnap(username, lection, sublection, snap, speed, erroneous) {
      if (username == undefined || isNaN(lection) || isNaN(sublection) || isNaN(snap)) {
        consoleOut("Snímek se nepodařilo odeslat - zadali jste neplatné parametry!");
      } else {
        if (speed == null) speed = Math.trunc(Math.random() * (settings.sendSnapSpeedFrom - settings.sendSnapSpeedTo)) + settings.sendSnapSpeedTo;
        if (erroneous == null) erroneous = Math.random() * (settings.sendSnapErrorsFrom - settings.sendSnapErrorsTo) + settings.sendSnapErrorsTo;
        if (isNaN(speed) || isNaN(erroneous)) {
            consoleOut("Snímek se nepodařilo odeslat - zadali jste neplatnou rychlost nebo chybovost!");
          return;
        }
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes("nenalezen")) {
              consoleOut("Snímek se nepodařilo odeslat - uživatel nebyl nalezen v databázi!");
            } else if (this.responseText.includes("OK")) {
              consoleOut("Snímek byl úspěšně odeslán!");
            } else {
              consoleOut("Snímek se nepodařilo odeslat!");
            }
          }
        };
        xhttp.open(
          "GET",
          "https://www.atfonline.cz/saveSnapResult.php?username=" +
            username +
            "&normal=YES&lection=" +
            lection +
            "&sublection=" +
            sublection +
            "&snap=" +
            snap +
            "&fortime=-1&speed=" +
            speed +
            "&erroneous=" +
            erroneous.toFixed(2) +
            "&corrmode=YES",
          true
        );
        xhttp.send();
    }
  }
  const pageUrl = new URL(window.location).searchParams.get("page");
  const catUrl = new URL(window.location).searchParams.get("cat");
  function openBackend() {
    const xhttp = new XMLHttpRequest();
    if (catUrl == "edu" || pageUrl == "edu-typing") {
      xhttp.open("GET", "https://vojtek.php5.cz/projects/keysniper/backend.php?type=edu&user="+sessionStorage.getItem("logUserName")+"&data="+sessionStorage.getItem("logUserPass")+"&disKey=" + eduProfile.disKey + "&disHand=" + eduProfile.disHand + "&selKey=" + eduProfile.selKey + "&corrMode=" + eduProfile.corrMode + "&genSnap=" + eduProfile.genSnap + "&errorSound=" + eduProfile.errorSound + "&lec=" + eduProfile.lec + "&sub=" + eduProfile.sub + "&snap=" + eduProfile.snap + "&hardKey=" + eduProfile.hardKey + "&playMode=" + eduProfile.playMode + "&moveMode=" + eduProfile.moveMode + "&timeMin=" + eduProfile.timeMin, true);
    } else if (catUrl == "grp") {
      xhttp.open("GET", "https://vojtek.php5.cz/projects/keysniper/backend.php?type=grp&user=" + sessionStorage.getItem("logUserName") + "&data=" + sessionStorage.getItem("logUserPass") + "&class=" + groupProfile.groupName + "&autoResult=" + groupProfile.autoResult + "&disKey=" + groupProfile.disKey + "&disHand=" + groupProfile.disHand + "&selKey=" + groupProfile.selKey + "&hardKey=" + groupProfile.hardKey, true);
    }
    xhttp.send();
  }
  openBackend();
  if (catUrl == "edu" || pageUrl == "edu-typing" || catUrl == "grp") {
    let index, position, positionTemp, errors, errorsTemp, trueErrors, correct;
    function resetPage() {
        index = -1;
        position = -1;
        positionTemp = -1;
        errors = 0;
        errorsTemp = 0;
        trueErrors = 0;
        showTitle();
    }
    function showTitle() {
      settings.showTab ? (document.title = errors + " ch | " + speed + " úh/m |" + time) : (document.title = "ATF - výuka psaní všemi deseti online bez reklam");
    }
    function newSnap(word) {
      resetPage();
      let msg = document.getElementById("mess").innerText;
      msg.includes("Lekce") ? (msg = "=> " + msg) : (msg = "");
      consoleOut("Snímek byl přepnut na " + word + " " + msg);
    }
    function checkKeyWord(key) {
      switch (key) {
        case " ":
          return "Space";
          break;
        case "¶":
          return "Enter";
          break;
        default:
          return key;
      }
    }
    resetPage();
    showTitle();
    showHelp();
    document.addEventListener("resize", function () {
      resetPage();
    });
    let sentence, paper;
    document.addEventListener("keypress", function (e) {
      if (sentence[position] != e.key) {
        if (settings.autoRepeat) {
          if (catUrl == "edu" || pageUrl == "edu-typing") {
            document.getElementById("repeatSnap").click();
          } else if (catUrl == "grp") {
            document.getElementById("repeatText").click();
          }
        }
      }
      showTitle();
      consoleOut(
        "Platný znak: " +
          checkKeyWord(sentence[positionTemp]) +
          "  |  Zadaný znak: " +
          checkKeyWord(e.key) +
          "  |  Unicode: " +
          e.which +
          "  |  Správně: " +
          correct +
          "  |  Pozice: " +
          position +
          "  |  Index: " +
          index +
          "  |  Počet chyb před opravou (přibližně): " +
          trueErrors +
          "  |  Počet chyb po opravě: " +
          errors
      );
    });
    document.addEventListener("keydown", function (e) {
        if (settings.keyboardShortcuts) {
          if (e.ctrlKey && e.shiftKey) {
            updateSettings("askBeforeSend", "Dotázání se na rychlost a chybovost před odesláním bylo", "povoleno", "zakázáno");
          } else if (e.ctrlKey && e.key == "Delete") {
            showHelp();
          } else if (e.ctrlKey && e.key == "ArrowUp") {
            consoleOut(updateDisplay("cdribbon", "ATF lišta byla", "odkryta", "skryta"));
          } else if (e.ctrlKey && e.key == "ArrowDown") {
            consoleOut(updateDisplay("board", "Virtuální klávesnice byla", "odkryta", "skryta"));
          } else if (e.ctrlKey && e.key == "Enter") {
            if (settings.consoleOutput) {
              consoleOut("Výpis do konzole byl zakázán");
              settings.consoleOutput = false;
            } else {
              settings.consoleOutput = true;
              consoleOut("Výpis do konzole byl povolen");
            }
          } else if (e.ctrlKey && e.key == "a") {
            consoleOut(updateSettings("keyboardShortcuts", "Klávesové zkratky byly", "povoleny", "zakázány"));
          } else if (e.ctrlKey && e.key == "z") {
            consoleOut(updateSettings("autoRepeat", "Automatické opakování snímku při chybě bylo", "povoleno", "zakázáno"));
          } else if (e.ctrlKey && e.key == ",") {
            consoleOut(updateSettings("correctType", "Bezchybné psaní bylo", "povoleno", "zakázáno"));
          } else if (e.ctrlKey && e.key == ".") {
            consoleOut(updateSettings("autoRewrite", "Automatické přepisování chybných znaků bylo", "povoleno", "zakázáno"));
          } else if (e.ctrlKey && e.key == "q") {
            consoleOut(updateSettings("showTab", "Zobrazování informací v titulku stránky bylo", "povoleno", "zakázáno"));
            showTitle();
          } else if (e.ctrlKey && e.key == "/") {
            consoleOut(updateSettings("correctTypeErrorsEnabled", "Automatická chybovost byla", "povolena", "zakázána"));
          } else if (e.shiftKey && e.key == "ArrowUp") {
            settings.correctTypeErrors++;
            consoleOut("Pravděpodobnost chybovosti byla navýšena o 1");
          } else if (e.shiftKey && e.key == "ArrowDown") {
            settings.correctTypeErrors--;
            if (settings.correctTypeErrors <= 0) settings.correctTypeErrors++;
            consoleOut("Pravděpodobnost chybovosti byla snížena o 1");
          } else if (e.ctrlKey && e.key == ";") {
            
          } else {
            if (catUrl == "edu" || pageUrl == "edu-typing") {
              if (e.ctrlKey && e.keyCode == "37") {
                document.getElementById("prevSnap").click();
              } else if (e.ctrlKey && e.keyCode == "39") {
                document.getElementById("nextSnap").click();
              } else if (e.ctrlKey && e.key == "*") {
                consoleOut(updateSettings("autoNext", "Automatické přepnutí snímku po dokončení bylo", "povoleno", "zakázáno"));
              } else if (e.ctrlKey && e.altKey) {
                document.getElementById("repeatSnap").click();
              } else if (e.ctrlKey && e.keyCode == "32") {
                let mess = document.getElementById("mess").innerText;
                let lection = parseInt(mess.match(/\d+/));
                let sublection = parseInt(document.getElementById("eduSublection").value);
                let snap;
                lection > 9 ? (snap = parseInt(mess.replace(/[^0-9]/g, "")[2])) : (snap = parseInt(mess.replace(/[^0-9]/g, "")[1]));
                settings.askBeforeSend ? sendSnap(eduProfile.userName, lection, sublection, snap, parseInt(prompt("Zadejte rychlost:")), parseInt(prompt("Zadejte chybovost:"))) : sendSnap(eduProfile.userName, lection, sublection, snap, null, null);
              } else {
                checkKey();
              }
            } else if (catUrl == "grp") {
              if (e.ctrlKey && e.altKey) {
                document.getElementById("repeatText").click();
              } else {
                checkKey();
              }
            } else {
              checkKey();
            }
          }
        } else {
          checkKey();
        }
        function checkKey() {
          const error = document.getElementById("correction").innerText.replace(/\s+/g, "").length;
          if (error > errorsTemp) {
            errors++;
            errorsTemp++;
          }
          sentence = document.getElementById("original").innerText;
          if (sentence.includes("Počet chyb:")) {
            if (settings.autoNext) document.getElementById("nextSnap").click();
          } else {
            paper = document.getElementById("caret").innerText;
            correct = "ANO";
            if (paper == "") {
              position = -1;
              errorsTemp = 0;
            }
            index++;
            position++;
            if (sentence[position] != e.key) {
              trueErrors++;
              if ((sentence[position] == "¶" && e.key == "Enter") || (sentence[position] == "—" && e.key == "-") || e.key == "F5" || e.key == "F12") {
                trueErrors--;
                return true;
              }
              index--;
              position--;
              if (settings.correctType) {
                if (settings.correctTypeErrors <= 0) correctTypeErrors = 1;
                let rand;
                settings.correctTypeErrorsEnabled? (rand = Math.trunc(Math.random() * settings.correctTypeErrors)) : (rand = 1);
                if (rand > 0) {
                  e.preventDefault();
                  return false;
                }
              }
              correct = "NE";
            }
            correct == "NE" ? (positionTemp = position + 1) : (positionTemp = position);
          }
        }
      });
    if (catUrl == "edu" || pageUrl == "edu-typing") {
      document.getElementById("prevSnap").addEventListener("click", function () {
        newSnap("předchozí");
      });
      document.getElementById("nextSnap").addEventListener("click", function () {
        newSnap("následující");
      });
      document.getElementById("eduLection").addEventListener("change", function () {
          newSnap("lekci");
        });
      document.getElementById("eduSublection").addEventListener("change", function () {
          newSnap("část lekce");
        });
      document.getElementById("fileSnap").addEventListener("click", function () {
        newSnap("text ze souboru");
      });
      document.getElementById("repeatSnap").addEventListener("click", function () {
          resetPage();
          consoleOut("Snímek byl obnoven");
        });
      document.getElementById("reverseSnap").addEventListener("click", function () {
          newSnap("snímek pozpátku");
        });
      document.getElementById("errorSnap").addEventListener("click", function () {
        newSnap("snímek s chybnými slovy");
      });
      document.getElementById("corrMode").addEventListener("click", function () {
        resetPage();
        consoleOut("");
      });
    } else if (catUrl == "grp") {
      document.getElementById("forwardText").addEventListener("click", function () {
          resetPage();
          consoleOut("Text byl natažen");
        });
      document.getElementById("repeatText").addEventListener("click", function () {
          resetPage();
          consoleOut("Text byl obnoven");
        });
    }
  } else {
    consoleOut('KeySniper funguje pouze na stránkách "Výuka CS Qwertz" a "Skupiny"');
  }
  consoleOut("KeySniper byl úspěšně načten!");
