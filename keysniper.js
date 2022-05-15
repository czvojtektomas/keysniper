  /**
   * KeySniper (verze 2.0.2)
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
    correctTypeErrors: 10, // náhodná chybovost při bezchybném psaní (číslo > 0 = zapnuto - čím vyšší, tím menší pravděpodobnost chyby)
    correctTypeErrorsEnabled: false, // povolení/zakázání náhodné chybovosti při bezchybném psaní
    showTab: false, // zobrazování chyb, rychlosti a času v titulku stránky
    askBeforeSend: true, // zeptat se na rychlost a chybovost při simulovaném odeslání snímku
    sendSnapErrorsFrom: 0.0, // náhodná chybovost simulovaně odeslaného snímku (od)
    sendSnapErrorsTo: 0.0, // náhodná chybovost simulovaně odeslaného snímku (do)
    sendSnapSpeedFrom: 200, // náhodná rychlost simulovaně odeslaného snímku (od)
    sendSnapSpeedTo: 350 // náhodná rychlost simulovaně odeslaného snímku (do)
  };

  // klávesové zkratky (Ctrl + ...)
  const shortcuts = [
    ["skrytí/odkrytí ATF lišty", "ArrowUp"],
    ["skrytí/odkrytí virtuální klávesnice", "ArrowDown"],
    ["zobrazení nápovědy", "Shift"],
    ["povolení/zakázání výstupu příkazů do konzole", "Enter"],
    ["povolení/zakázání klávesových zkratek", "a"],
    ["povolení/zakázání automatického opakování při chybě", "z"],
    ["povolení/zakázání bezchybného psaní", ","],
    ["povolení/zakázání zobrazení chyb, rychlosti a času v titulku stránky", "Delete"],
    ["přepnutí snímku na následující", "ArrowRight"],
    ["přepnutí snímku na předchozí", "ArrowLeft"],
    ["obnovení snímku", "Alt"],
    ["povolení/zakázání dotázání se na rychlost a chybovost při simulovaném odeslání snímku", "."],
    ["simulované odeslání aktuálního snímku", " "],
    ["povolení/zakázání automatického přepnutí snímku na následující po dokončení", ";"],
    ["povolené/zakázání náhodné chybovosti při bezchybném psaní", "*"]
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
              __/  /              | |
              |___/               |_|

  //////  KeySniper 2.0.2
  ////    © Tomáš Vojtek ${new Date().getFullYear()} 
  ///     ******************************************
  //      Web: https://tomasvojtek.cz 
  /       GitHub: https://github.com/vojtektomascz


KLÁVESOVÉ ZKRATKY:
`;
    for (let i = 0; i < shortcuts.length; i++) text += "Ctrl + " + shortcuts[i][1] + " => " + shortcuts[i][0] + "\n";
    console.log(text);
  }

  // aktualizace zobrazení objektů
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
    consoleOut(syntax);
  }

  // aktualizace nastavení
  function updateSettings(item, name, t, f) {
    settings[item] = !settings[item];
    let syntax = name + " ";
    settings[item] ? syntax += t : syntax += f;
    consoleOut(syntax);
  }

  // simulované odesílání snímku
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

  if (pageUrl == "edu-typing" || catUrl == "edu" || catUrl == "grp" || catUrl == "rss") {
    let index, position, positionTemp, errors, errorsTemp, trueErrors, correct, seconds, minutes, time, timer, active;
    document.getElementById("copy").addEventListener("DOMSubtreeModified", function () {
      if (index == 0 && !timer) {
        timer = true;
        time = setInterval(function () {
          seconds++;
          if (seconds == 60) {
            seconds = 0;
            minutes++;
          }
          showTitle();
        }, 1000);
      }
    });
    function resetPage() {
      clearInterval(time);
      index = -1;
      position = -1;
      positionTemp = -1;
      errors = 0;
      errorsTemp = 0;
      trueErrors = 0;
      timer = false;
      seconds = 0;
      minutes = 0;
      showTitle();
    }
    function checkTime(value) {
      if (value < 10) {
        return "0" + value;
      } else {
        return value;
      }
    }
    function showTitle() {
      settings.showTab ? (document.title = errors + "ch | " + checkTime(minutes) + ":" + checkTime(seconds)) : (document.title = "ATF - výuka psaní všemi deseti online bez reklam");
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
    showHelp();
    document.addEventListener("resize", function () {
      resetPage();
    });
    let sentence, paper;
    document.addEventListener("keypress", function (e) {
      if (active) {
        if (sentence[position] != e.key) {
          if (settings.autoRepeat) {
            if (catUrl == "edu" || pageUrl == "edu-typing") {
              document.getElementById("repeatSnap").click();
            } else if (catUrl == "grp") {
              document.getElementById("repeatText").click();
            } else if (catUrl == "rss") {
              document.getElementById("actRss").click();
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
      }
    });
    document.getElementById("original").addEventListener("DOMSubtreeModified", function () {
      if (this.innerText.includes("Počet chyb:")) {
        active = false;
        resetPage();
      }
    });
    document.addEventListener("keydown", function (e) {
        if (settings.keyboardShortcuts && e.ctrlKey) {
          if (e.key == shortcuts[0][1]) {
            updateDisplay("cdribbon", "ATF lišta byla", "odkryta", "skryta");
          } else if (e.key == shortcuts[1][1]) {
            updateDisplay("board", "Virtuální klávesnice byla", "skryta", "odkryta");
          } else if (e.key == shortcuts[2][1]) {
            showHelp();
          } else if (e.key == shortcuts[3][1]) {
            if (settings.consoleOutput) {
              consoleOut("Výstup příkazů do konzole byl zakázán");
              settings.consoleOutput = false;
            } else {
              settings.consoleOutput = true;
              consoleOut("Výstup příkazů do konzole byl povolen");
            }
          } else if (e.key == shortcuts[4][1]) {
            updateSettings("keyboardShortcuts", "Klávesové zkratky byly", "povoleny", "zakázány");
          } else if (e.key == shortcuts[5][1]) {
            updateSettings("autoRepeat", "Automatické opakování při chybě bylo", "povoleno", "zakázáno");
          } else if (e.key == shortcuts[6][1]) {
            updateSettings("correctType", "Bezchybné psaní bylo", "povoleno", "zakázáno");
          } else if (e.key == shortcuts[14][1]) {
            updateSettings("correctTypeErrorsEnabled", "Náhodná chybovost při bezchybném psaní byla", "povolena", "zakázána");
          } else if (e.key == shortcuts[7][1]) {
            updateSettings("showTab", "Zobrazení chyb, rychlosti a času v titulku stránky bylo", "povoleno", "zakázáno");
            showTitle();
          } else {
            if (catUrl == "edu" || pageUrl == "edu-typing") {
              if (e.key == shortcuts[8][1]) {
                document.getElementById("nextSnap").click();
              } else if (e.key == shortcuts[9][1]) {
                document.getElementById("prevSnap").click();
              } else if (e.key == shortcuts[10][1]) {
                document.getElementById("repeatSnap").click();
              } else if (e.key == shortcuts[11][1]) {
                updateSettings("askBeforeSend", "Dotázání se na rychlost a chybovost při simulovaném odeslání snímku bylo", "povoleno", "zakázáno");
              } else if (e.key == shortcuts[12][1]) {
                let mess = document.getElementById("mess").innerText;
                let lection = parseInt(mess.match(/\d+/));
                let sublection = parseInt(document.getElementById("eduSublection").value);
                let snap;
                lection > 9 ? (snap = parseInt(mess.replace(/[^0-9]/g, "")[2])) : (snap = parseInt(mess.replace(/[^0-9]/g, "")[1]));
                settings.askBeforeSend ? sendSnap(eduProfile.userName, lection, sublection, snap, parseInt(prompt("Zadejte rychlost:")), parseFloat(prompt("Zadejte chybovost:"))) : sendSnap(eduProfile.userName, lection, sublection, snap, null, null);
              } else if (e.key == shortcuts[13][1]) {
                updateSettings("autoNext", "Přepnutí snímku na následující po dokončení bylo", "povoleno", "zakázáno");
              } else {
                checkKey();
              }
            } else if (catUrl == "grp") {
              if (e.key == shortcuts[10][1]) {
                document.getElementById("repeatText").click();
              } else {
                checkKey();
              }
            } else if (catUrl == "rss") {
              if (e.key == shortcuts[8][1]) {
                document.getElementById("nextRss").click();
              } else if (e.key == shortcuts[9][1]) {
                document.getElementById("prevRss").click();
              } else if (e.key == shortcuts[10][1]) {
                document.getElementById("actRss").click();
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
          if (error > errorsTemp && active) {
            errors++;
            errorsTemp++;
          }
          sentence = document.getElementById("original").innerText;
          if (sentence.includes("Počet chyb:") && settings.autoNext) {
            if (catUrl == "edu" || pageUrl == "edu-typing") {
              document.getElementById("nextSnap").click();
            } else if (catUrl == "rss") {
              document.getElementById("nextRss").click();
            }
          } else {
            active = true;
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
              if (sentence[position] == "¶" && e.key == "Enter" || sentence[position] == "—" && e.key == "-" || sentence[position] == "–" && e.key == "-" || e.key == "F5" || e.key == "F12") {
                trueErrors--;
                return true;
              }
              index--;
              position--;
              if (settings.correctType) {
                if (settings.correctTypeErrors <= 0) settings.correctTypeErrors = 1;
                let rand;
                settings.correctTypeErrorsEnabled ? (rand = Math.trunc(Math.random() * settings.correctTypeErrors)) : (rand = 1);
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
      document.getElementById("timeSnap").addEventListener("click", function () {
        newSnap("snímek na čas");
      });
      document.getElementById("reverseSnap").addEventListener("click", function () {
        newSnap("snímek pozpátku");
      });
      document.getElementById("errorSnap").addEventListener("click", function () {
        newSnap("snímek s chybnými slovy");
      });
      document.getElementById("corrMode").addEventListener("click", function () {
        resetPage();
        consoleOut("Snímek byl obnoven");
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
    } else if (catUrl == "rss") {
      document.getElementById("actRss").addEventListener("click", function () {
        resetPage();
        consoleOut("Text byl obnoven");
      });
      document.getElementById("prevRss").addEventListener("click", function () {
        newSnap("předchozí");
      });
      document.getElementById("nextRss").addEventListener("click", function () {
        newSnap("následující");
      });
      document.getElementById("listRss").addEventListener("change", function() {
        newSnap("nový");
      });
    }
  } else {
    consoleOut('KeySniper funguje pouze na stránkách "Výuka", "Skupiny" a "RSS texty"!');
  }
  consoleOut("KeySniper byl úspěšně načten!");
