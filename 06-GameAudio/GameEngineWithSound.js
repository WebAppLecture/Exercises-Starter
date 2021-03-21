import { GameEngine } from "../04-Games/GameEngine.js";
import { BufferLoader } from "./BufferLoader.js";
import { SoundLibrary } from "./SoundLibrary.js";

export class GameEngineWithSound extends GameEngine {

    constructor(ontrols, screen, menu) {
        super(ontrols, screen, menu);
        this.setupAudio();
    }

    setupAudio() {
        this.audio = new BufferLoader();
        this.sounds = {
            "menuChange": SoundLibrary.hit5,
        };
        Object.keys(this.sounds).forEach(key => {
            this.audio.load(this.sounds[key]); 
        })
    }

    menuChangeActiveGame(indexChange) {
        super.menuChangeActiveGame(indexChange);
        this.audio.play(SoundLibrary.hit5, 0.1);
    }

    get menuInteraction() {
        return {
            "primary": () => {
                this.menu.select();
                this.audio.play(SoundLibrary.collect1, 0.1);
            },
            "up": () => {
                this.menu.changeActiveItem(1);
                this.audio.play(SoundLibrary.hit5, 0.1);
            },
            "down": () => {
                this.menu.changeActiveItem(-1);
                this.audio.play(SoundLibrary.hit5, 0.1);
            },
            "reset": () => this.showGameSelect(),
        }
    }
}
