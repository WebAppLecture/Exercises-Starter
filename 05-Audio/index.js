import { KeyBoard, Note } from "./src/js/Keyboard.js";

window.keyBoard = new KeyBoard(
    document.querySelector(".keys"), 
    document.querySelector("#master"),
    document.querySelector("#oscillators"),
    document.querySelector("#filter")
    );

window.Note = Note;