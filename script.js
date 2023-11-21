const searchInput = document.querySelector("#searchInput");
const searchIcon = document.querySelector("#searchIcon");
const wordTag = document.querySelector("#word");
const phoneticTag = document.querySelector("#phonetic");
const playAudio = document.querySelector("#playAudio");

const changeTheme = document.querySelector("#changeTheme");
const headerMoon = document.querySelector("#headerMoon");
const showFontsBox = document.querySelector("#showFonts");
const selectFonts = document.querySelector("#selectFonts");
const sansFontSelected = document.querySelector("#sans");
const serifFontSelected = document.querySelector("#serif");
const monoFontSelected = document.querySelector("#mono");
const headerFonts = document.querySelector("#headerFonts");

const partOfSpeech = document.querySelector("#partOfSpeech");
const definitions = document.querySelector("#definitions");
const explain = document.querySelector("#explain");
const sourceLink = document.querySelector("#sourceLink");

const keywordExplain = document.querySelector("#keywordExplain");
const noResults = document.querySelector("#noResults");
const searchError = document.querySelector("#searchError");

const playAudioFile = document.querySelector("#playAudioFile");

let wordDb = [];
let theme = "light";

let root = document.querySelector(":root");
let rootStyle = getComputedStyle(root);
let light = rootStyle.getPropertyValue("--bg-color");
//console.log("light ", light, " rootstyle ", rootStyle);
//root.style.setProperty("--bg-color", "#000");

const styleSheet = document.styleSheets[0].cssRules[2].cssText;
console.log("styleSheet ", styleSheet);
//rootStyle.style.setProperty("--bg-color", "#000");
//$(":root").css("--bg-color", "#000000");
// var sheet = document.styleSheets[0];
// console.log(sheet);
// sheet.insertRule(":root{--blue:#4444FF}");

searchIcon.addEventListener("click", () => fetchWords(searchInput.value));

changeTheme.addEventListener("input", changeThemes);

showFontsBox.addEventListener("click", showFonts);

let bodyTag = document.querySelector("html");
bodyTag.addEventListener("click", function (event) {
  let target = event.target;
  if (
    bodyTag.contains(target) &&
    !showFontsBox.contains(target) &&
    selectFonts.classList.contains("header__select-fonts--display")
  ) {
    showFonts();
  }
});

sansFontSelected.addEventListener("click", () => {
  //document.documentElement.style.removeProperty("--")
  document.documentElement.style.setProperty("--font", "'Inter', sans-serif");
  headerFonts.innerText = "Sans Serif";
});
serifFontSelected.addEventListener("click", () => {
  //document.documentElement.style.removeProperty("--")
  document.documentElement.style.setProperty("--font", "'Lora', serif");
  headerFonts.innerText = "Serif";
});
monoFontSelected.addEventListener("click", () => {
  //document.documentElement.style.removeProperty("--")
  document.documentElement.style.setProperty(
    "--font",
    "'Inconsolata', monospace"
  );
  headerFonts.innerText = "Mono";
});

async function fetchWords(aaa) {
  try {
    const results = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${aaa}`
    );
    const dataDb = await results.json();
    wordDb = dataDb[0];
    displayPronounce();
    displayMeaning();
    displaySource();
    console.log(wordDb);
  } catch (error) {
    console.log("Eroare este: ", error);
    keywordExplain.style.setProperty("display", "none");
    noResults.removeAttribute("style");
    if (!searchInput.value) {
      searchError.style.setProperty("display", "block");
      noResults.setAttribute("style", "display: none");
    }
  } finally {
    console.log(keywordExplain, noResults);
  }
}
function displayPronounce() {
  noResults.setAttribute("style", "display: none");
  keywordExplain.removeAttribute("style");
  searchError.style.setProperty("display", "none");
  wordTag.innerText = wordDb.word;
  //playAudioFile.src = wordDb.phonetics[2].audio;
  //console.log(wordDb.phonetics[2].audio);
  if (wordDb.phonetics && wordDb.phonetics.length > 0) {
    const phonetic = wordDb.phonetics.find((element) => element.text).text;
    const audioSRC = wordDb.phonetics.find((element) => element.audio).audio;
    if (phonetic) {
      phoneticTag.innerText = phonetic;
    }
    if (audioSRC) {
      playAudioFile.setAttribute("src", audioSRC);
      //playAudioFile.src = "file";
      console.log(audioSRC);
    } else {
      playAudio.classList.add("pronounce__audio--inactive");
    }
  } else {
    phoneticTag.innerText = " Not available ";
  }
}
function displayMeaning() {
  let explainTag = "";
  wordDb.meanings.forEach((meaning) => {
    explainTag += `
        <div class="explain__container">
            <div class="explain__title">
                <h2 class="explain__part-of-speech">${meaning.partOfSpeech}</h2>
                <div class="explain__line"></div>
            </div>
            <div class="explain__detailed">
                <h3 class="explain__meaning">Meaning</h3>
                <ul class="explain__definitions">`;

    meaning.definitions.forEach((definition) => {
      explainTag += `<li class="explain__definition">${definition.definition}`;
      if (definition.example) {
        explainTag += `<div class="explain__example">${definition.example}</div>`;
      }
      explainTag += `</li>`;
    });
    explainTag += `</ul>`;

    if (meaning.synonyms.length > 0) {
      explainTag += `<div class="explain__synonyms">
                        <h3 class="explain__meaning">Synonyms</h3>`;
      meaning.synonyms.forEach(
        (synonym) =>
          (explainTag += `<div class="explain__synonym" onclick="searchSynonyms('${synonym}')">${synonym} </div>`)
      );
      explainTag += `</div>`;
    }
    explainTag += `</div></div>`;
    explain.innerHTML = explainTag;
  });
}
function displaySource() {
  sourceLink.innerText = wordDb.sourceUrls[0];
  sourceLink.href = wordDb.sourceUrls[0];
}

function changeThemes() {
  if (theme === "light") {
    const body = document.querySelector("body");
    body.style.setProperty("--bg-color", "#050505");
    //document.documentElement.style.setProperty("--bg-color", "#050505");
    body.style.setProperty("--font-color-h", "#FFFFFF");
    body.style.setProperty("--search-bg", "#1F1F1F");
    body.style.setProperty("--shadow-bg", "#A445ED");
    body.style.setProperty("--line-bg", "#3A3A3A");
    headerMoon.src = "./assets/images/icon-moon-dark.svg";
    theme = "dark";
  } else {
    //const html = document.querySelector("html");
    const body = document.querySelector("body");
    //html.removeAttribute("style");
    body.removeAttribute("style");
    headerMoon.src = "./assets/images/icon-moon-light.svg";
    theme = "light";
  }
}
function showFonts() {
  selectFonts.classList.toggle("header__select-fonts--display");
}

function searchSynonyms(synonyms) {
  searchInput.value = synonyms;
  console.log(synonyms);
  fetchWords(synonyms);
}
function Play() {
  //some code here
  let test = "test";
}
