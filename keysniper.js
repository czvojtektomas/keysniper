/**
 * KeySniper (verze 1.0.4)
 * © Tomáš Vojtek 2022
 * https://github.com/vojtektomascz/keysniper
 */

// výchozí nastavení
const settings = {
  ksEnabled: true, // zapnutí/vypnutí všech funkcí KeySniperu
  consoleOutput: true, // výstup příkazů do konzole
  keyboardShortcuts: true, // klávesové zkratky
  autoNext: false, // automatické přepnutí po dokončení
  autoRepeat: false, // automatické opakování při chybě
  correctType: false, // bezchybné psaní
  correctTypeErrors: 10, // chybovost při bezchybném psaní (číslo větší než 0 = zapnuto - čím vyšší, tím menší pravděpodobnost chyby)
  correctTypeErrorsEnabled: false, // zapnutí/vypnutí chybovosti
  rewrite: false, // automatické přepisování chybných znaků při bezchybném psaní
  autoRewrite: false,
  showErrors: false, // zobrazování chyb v titulku stránky
  sendSnapErrorsFrom: 0.0, // náhodná chybovost falešně odeslaného snímku (od)
  sendSnapErrorsTo: 0.0, // náhodná chybovost falešně odeslaného snímku (do)
  sendSnapSpeedFrom: 200, // náhodná rychlost falešně odeslaného snímku (od)
  sendSnapSpeedTo: 350 // náhodná rychlost falešně odeslaného snímku (do)
};
const core = {
  version: "1.0.4",
  updateServer: "https://vojtek.php5.cz/projects/updatechecker/check.php",
  defaultChatServer: "https://vojtek.php5.cz/projects/keysniper/chat.php",
  defaultFightServer: "https://vojtek.php5.cz/projects/keysniper/fight.php",
  defaultFeedURL: "http://zsbludov.cz/rss.xml"
};

// kód
function consoleOut(message) {
  if (settings.consoleOutput && settings.ksEnabled)
    console.log("[KS] " + message);
}
function showHelp() {
  if (settings.ksEnabled) {
    console.log(`
         _  __           _____       _                 
        | |/ /          / ____|     (_)                             
        | ' / ___ _   _| (___  _ __  _ _ __  ___ _ __            KeySniper (verze ${core.version})
        |  < / _ | | | ||___ || '_ || | '_ |/ _ | '__|           GitHub: https://github.com/vojtektomascz/keysniper
        | . ||  __/ |_| |____) | | | | | |_)|  __/ |             © Tomáš Vojtek ${new Date().getFullYear()}
        |_||_|___||__, |_____/|_| |_|_| .__/|___|_|              https://tomasvojtek.cz
                   __/ |              | |              
                  |___/               |_|              
        
                  @@@@@@@@@@@@@@@@@@@@@@@@@@                     KLÁVESOVÉ ZKRATKY:
                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                   Ctrl Shift      kompletní vypnutí veškerých funkcí KeySniperu
              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                 Ctrl ↑          skrytí/odkrytí ATF lišty
            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@               Ctrl ↓          skrytí/odkrytí virtuální klávesnice
         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@              Ctrl Del        zobrazení nápovědy
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           Ctrl Alt        obnovení snímku
        @@@@  ...                             ..   @@@           Ctrl ←          přepnutí snímku na předchozí
        @@@@,.*                                 , .@@@           Ctrl →          přepnutí snímku na následující
        @@@@,*                                   ,,@@@           Ctrl Enter      povolení/zakázání výstupu do konzole
        @@@@*(               @@@@                *,@@@           Ctrl Z          povolení/zakázání automatického opakování při chybě
        @@@@*%             @@@@@@@@@@@@@         (,@@@           Ctrl ,          povolení/zakázání bezchybného psaní
        @@@@*%            @@@@@@@@@#  @          (,@@@           Ctrl Q          povolení/zakázání zobrazování chyb v titulku stránky
        @@@@*%            @@@@@,                 (,@@@           Ctrl *          povolení/zákázání automatického přepnutí snímku na následující po dokončení
        @@@@*%            @@@@@@                 (,@@@           Ctrl /          povolení/zakázání automatické chybovosti při bezchybném psaní
        @@@@*%           @@@@ @@@@               (,@@@           Ctrl Space      odeslání aktuálního snímku
        @@@@*%           @@@    @@@              (,@@@           Shift ↑         zvýšení pravděpodobnosti chyby během bezchybného psaní o 1
        @@@@*%         /@@@      @@@             (,@@@           Shift ↓         snížení pravděpodobnosti chyby během bezchybného psaní o 1
        @@@@*%       /@@          @@             (,@@@           Ctrl .          povolení/zakázání automatického přepisování chybných znaků  
        @@@@*%                     @@@           (,@@@           Shift →         skrytí/odkrytí grafického rozhraní KeySniperu
        @@@@*%**                               **(,@@@           Shift ←         skrytí/odkrytí widgetů
        @@@@**%**//****,,,,,......,,,,,,,****/**%,*@@@           Ctrl A          povolení/zakázání klávesových zkratek
        @@@@#***&//****,,,,,.......,,,,,,****/%**,#@@@           Ctrl ;          zkontrolovat aktualizace
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
    if (
      username == undefined ||
      isNaN(lection) ||
      isNaN(sublection) ||
      isNaN(snap)
    ) {
      consoleOut(
        "Snímek se nepodařilo odeslat - zadali jste neplatné parametry!"
      );
    } else {
      if (speed == null)
        speed =
          Math.trunc(
            Math.random() *
              (settings.sendSnapSpeedFrom - settings.sendSnapSpeedTo)
          ) + settings.sendSnapSpeedTo;
      if (erroneous == null)
        erroneous = parseFloat(
          Math.random() *
            (settings.sendSnapErrorsFrom - settings.sendSnapErrorsTo) +
            settings.sendSnapErrorsTo
        );
      if (isNaN(speed) || isNaN(erroneous))
        consoleOut(
          "Snímek se nepodařilo odeslat - zadali jste neplatnou rychlost nebo chybovost!"
        );
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText.includes("nenalezen")) {
            consoleOut(
              "Snímek se nepodařilo odeslat - uživatel nebyl nalezen v databázi!"
            );
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
}
const pageUrl = new URL(window.location).searchParams.get("page");
const catUrl = new URL(window.location).searchParams.get("cat");
if (catUrl == "edu" || pageUrl == "edu-typing" || catUrl == "grp") {
  let index, position, positionTemp, errors, errorsTemp, correct;
  function resetPage() {
    if (settings.ksEnabled) {
      index = -1;
      position = -1;
      positionTemp = -1;
      errors = 0;
      errorsTemp = 0;
      showTitle();
    }
  }
  function showTitle() {
    settings.showErrors
      ? (document.title = errors + " ch")
      : (document.title = "ATF - výuka psaní všemi deseti online bez reklam");
  }
  function newSnap(word) {
    resetPage();
    consoleOut(
      "Snímek byl přepnut na " +
        word +
        " => " +
        document.getElementById("mess").innerText
    );
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
        "  |  Počet chyb: " +
        errors
    );
  });
  document.addEventListener("keydown", function (e) {
    if (settings.ksEnabled) {
      if (settings.keyboardShortcuts) {
        function updateDisplay(item, text, t, f) {
          const itemID = document.getElementById(item);
          let syntax = text + " ";
          if (itemID.style.display == "none") {
            itemID.style.display = "";
            syntax += t;
          } else {
            itemID.style.display = "none";
            syntax += f;
          }
          return syntax;
        }
        function updateSettings(value, text, t, f) {
          settings[value] = !settings[value];
          let syntax = text + " ";
          if (settings[value]) {
            syntax += t;
          } else {
            syntax += f;
          }
          return syntax;
        }
        if (e.ctrlKey && e.shiftKey) {
          settings.showErrors = false;
          showTitle();
          console.clear();
          settings.ksEnabled = false;
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
          consoleOut(updateSettings("showErrors", "Zobrazování chyb v titulku stránky bylo", "povoleno", "zakázáno"));
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
          checkUpdates();
        } else {
          if (catUrl == "edu" || pageUrl == "edu-typing") {
            if (e.ctrlKey && e.keyCode == "37") {
              document.getElementById("prevSnap").click();
            } else if (e.ctrlKey && e.keyCode == "39") {
              document.getElementById("nextSnap").click();
            } else if (e.ctrlKey && e.key == "*") {
              console(updateSettings("autoNext", "Automatické přepnutí snímku po dokončení bylo", "povoleno", "zakázáno"));
            } else if (e.ctrlKey && e.altKey) {
              document.getElementById("repeatSnap").click();
            } else if (e.ctrlKey && e.keyCode == "32") {
              let mess = document.getElementById("mess").innerText;
              let lection = parseInt(mess.match(/\d+/));
              let sublection = parseInt(
                document.getElementById("eduSublection").value
              );
              let snap;
              lection > 9
                ? (snap = parseInt(mess.replace(/[^0-9]/g, "")[2]))
                : (snap = parseInt(mess.replace(/[^0-9]/g, "")[1]));
              sendSnap(
                eduProfile.userName,
                lection,
                sublection,
                snap,
                null,
                null
              );
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
        if (settings.autoNext && sentence.includes("Počet chyb:")) {
          document.getElementById("nextSnap").click();
        } else {
          paper = document.getElementById("caret").innerText;
          correct = "ANO";
          if (paper == "") {
            position = -1;
            errorsTemp = 0;
          }
          index++;
          position++;
          if (
            (sentence[position] == "¶" && e.key == "Enter") ||
            (sentence[position] == "—" && e.key == "-") ||
            e.key == "F5" ||
            e.key == "F12"
          )
            return true;
          if (sentence[position] != e.key) {
            index--;
            position--;
            if (settings.correctType) {
              if (settings.correctTypeErrors <= 0) correctTypeErrors = 1;
              let rand;
              settings.correctTypeErrorsEnabled
                ? (rand = Math.trunc(
                    Math.random() * settings.correctTypeErrors
                  ))
                : (rand = 1);
              if (rand > 0) {
                e.preventDefault();
                return false;
              }
            }
            correct = "NE";
          }
          correct == "NE"
            ? (positionTemp = position + 1)
            : (positionTemp = position);
        }
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
    document
      .getElementById("eduLection")
      .addEventListener("change", function () {
        newSnap("lekci");
      });
    document
      .getElementById("eduSublection")
      .addEventListener("change", function () {
        newSnap("část lekce");
      });
    document.getElementById("fileSnap").addEventListener("click", function () {
      newSnap("text ze souboru");
    });
    document
      .getElementById("repeatSnap")
      .addEventListener("click", function () {
        resetPage();
        consoleOut("Snímek byl obnoven");
      });
    document
      .getElementById("reverseSnap")
      .addEventListener("click", function () {
        newSnap("snímek pozpátku");
      });
    document.getElementById("errorSnap").addEventListener("click", function () {
      newSnap("snímek s chybnými slovy");
    });
    document.getElementById("corrMode").addEventListener("click", function () {
      resetPage();
      consoleOut("");
    })
  } else if (catUrl == "grp") {
    document
      .getElementById("forwardText")
      .addEventListener("click", function () {
        resetPage();
        consoleOut("Text byl natažen");
      });
    document
      .getElementById("repeatText")
      .addEventListener("click", function () {
        resetPage();
        consoleOut("Text byl obnoven");
      });
  }
} else {
  consoleOut(
    'KeySniper funguje pouze na stránkách "Výuka CS Qwertz" a "Skupiny"'
  );
}
function checkUpdates() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "update") {
        consoleOut("Je k dispozici nová verze KeySniperu, stáhnout jí můžete zde: https://github.com/vojtektomascz/keysniper");
      } else if (this.responseText == "ok") {
        consoleOut("Používáte nejnovější verzi KeySniperu");
      } else {
        consoleOut("Nepodařilo se připojit k aktualizačnímu serveru, tudíž nemohly být ověřeny nové aktualizace.");
      }
    }
  }
  xhttp.open("GET", core.updateServer + "?project=keysniper&version=" + core.version, true);
  xhttp.send();
}
checkUpdates();
consoleOut("KeySniper byl úspěšně načten!");