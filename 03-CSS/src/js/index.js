import { SkinChanger } from "./SkinChanger.js";

let skinStyle = document.querySelector("#skin"),
    skins = ["gold","peach","basic","win95","mech","scifi","gamble","industrial","bones","moiree","comic","depth"];

skins.push("wood");
skins.push("glass");
skins.push("psybones");
skins.push("greatful");

window.skinChanger = new SkinChanger(skinStyle, skins, "./src/css/");

document.querySelector(".next").addEventListener("click", () => skinChanger.next());
document.querySelector(".previous").addEventListener("click", () => skinChanger.previous());

skinChanger.activeSkin = "depth";
