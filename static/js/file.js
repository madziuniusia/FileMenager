import { settings, themes } from "/js/load.js";

const count = document.getElementById("line-count");
const area = document.getElementById("area");

const changeSize = (value) => {
  settings.fontSize += value;

  if (settings.fontSize < 5) {
    settings.fontSize = 5;
  }
  area.style.fontSize = settings.fontSize + "px";
  count.style.fontSize = settings.fontSize + "px";
};

const loadTheme = () => {
  const theme = themes.find((x) => x.name == settings.theme);

  area.style.backgroundColor = theme.background;
  area.style.color = theme.fontColor;
};

let themeIndex = themes.findIndex((x) => x.name == settings.theme);

changeSize(0);
loadTheme();

area.addEventListener("keydown", (e) => {
  let { value, selectionStart, selectionEnd } = area;
  if (e.keyCode === 9) {
    e.preventDefault();
    area.value =
      value.slice(0, selectionStart) + "\t" + value.slice(selectionEnd);
    area.setSelectionRange(selectionStart + 2, selectionStart + 2);
  }
});
let lineCountCache = 0;

function LCount() {
  let lineCount = area.value.split("\n").length;
  let outarr = new Array();
  if (lineCountCache != lineCount) {
    for (let x = 0; x < lineCount; x++) {
      outarr[x] = x + 1 + ".";
    }
    count.value = outarr.join("\n");
  }
  lineCountCache = lineCount;
}
LCount();
area.addEventListener("input", () => {
  LCount();
});

document.getElementById("fontPlus").addEventListener("click", () => {
  changeSize(2);
});
document.getElementById("fontMinus").addEventListener("click", () => {
  changeSize(-2);
});

document.getElementById("color").addEventListener("click", () => {
  themeIndex += 1;
  if (themeIndex >= themes.length) {
    themeIndex = 0;
  }
  settings.theme = themes[themeIndex].name;
  loadTheme();
});

document.getElementById("savefile").addEventListener("click", () => {
  fetch("/JsonFile", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  }).then(() => {
    alert("SAVED");
  });
});

document.getElementById("changeName").addEventListener("click", () => {
  document.getElementById("dialog4").showModal();
});
document.getElementById("cancelName").addEventListener("click", () => {
  document.getElementById("dialog4").close();
});
