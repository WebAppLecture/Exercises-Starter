import { GameEngine } from "./GameEngine.js";
import { SkinChanger } from "../../../03-CSS/src/js/SkinChanger.js";
import { Pong } from "./games/Pong.js";
import { Snake } from "./games/Snake.js";
import { TestGame } from "./games/TestGame.js";
import { FallingStones } from "./games/FallingStones.js";

const GAMES = {
    "Pong": Pong,
    "Snake": Snake,
    "TestGame": TestGame,
    "FallingStones": FallingStones,
};

window.gameEngine = new GameEngine(
    document.querySelector(".controls").children, 
    document.querySelector(".screen"),
    document.querySelector(".menu"),
    GAMES);

let skinStyle = document.querySelector("#skin"),
    skins = ["gold","peach","basic","win95", "mech","depth"];

window.skinChanger = new SkinChanger(skinStyle, skins, "../03-CSS/src/css/");

document.querySelector(".next").addEventListener("click", () => skinChanger.next());
document.querySelector(".previous").addEventListener("click", () => skinChanger.previous());

skinChanger.activeSkin = "basic";