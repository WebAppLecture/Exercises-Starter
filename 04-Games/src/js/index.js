import { GameEngine } from "./GameEngine.js";
import { SkinChanger } from "../../../03-CSS/src/js/SkinChanger.js";
import { Pong } from "./games/pong/Pong.js";
import { Snake } from "./games/snake/Snake.js";
import { TestGame } from "./games/TestGame.js";
import { FallingStones } from "./games/FallingStones.js";

const GAMES = {
    "Pong": Pong,
    "Snake": Snake,
    "TestGame": TestGame,
    "FallingStones": FallingStones,
};

window.gameEngine = new GameEngine(
    document.querySelectorAll(".control"), 
    document.querySelector(".screen"),
    document.querySelector(".menu ul"),
    GAMES);

let skinStyle = document.querySelector("#skin"),
    skins = ["gold","peach","basic","win95","mech","scifi","gamble","industrial","bones","moiree","comic","depth"];

window.skinChanger = new SkinChanger(skinStyle, skins, "../03-CSS/src/css/");

document.querySelector(".next").addEventListener("click", () => skinChanger.next());
document.querySelector(".previous").addEventListener("click", () => skinChanger.previous());

skinChanger.activeSkin = "basic";