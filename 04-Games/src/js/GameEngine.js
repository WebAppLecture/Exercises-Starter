import { Menu } from "./Menu.js";
import { INPUTS } from "./inputs.js";

export class GameEngine {

    constructor(controls, screen, menu, games) {
        this.controls = Array.from(controls);
        this.screen = screen;
        this.menu = new Menu(menu);
        this.games = games;

        this.renderContext = this.screen.getContext('2d');
        this.setKeyMapping();
        this.setupControlListeners();
        this.showGameSelect();
    }
    
    setKeyMapping() {
        this.keyMapping = new Map();
        this.controls.forEach(element => {
            element.dataset.keybind.split(" ").forEach(keyCode => 
                this.keyMapping.set(keyCode, element.id)
            );
        });
        return;
    }

    setupControlListeners() {
        window.addEventListener("keydown", event => event.repeat || this.input(this.keyMapping.get(event.code), true));
        window.addEventListener("keyup", event => this.input(this.keyMapping.get(event.code), false));
        this.controls.forEach(control => {
            control.addEventListener("mousedown", () => this.input(control.id, true));
            control.addEventListener("mouseup", () => this.input(control.id, false));
        });
    }

    input(type, active) {
        if(active && type === INPUTS.RESET) {
            this.reset();
        } 
        if(this.game) {
            this.game.input(type, active);  
        } else if(active) {
            this.menuInput(type);
        }
    }

    showGameSelect() {
        this.menu.load(Object.keys(this.games), this.modeSelect.bind(this));
    }

    loadGame(game, mode) {
        if(game) {
            this.game = new game(mode);
            this.gameLoop();
        }
    }

    loadGameWithMode(game, mode) {
        this.menu.hide();
        this.loadGame(game, mode);
    }

    modeSelect(name) {
        let game = this.games[name],
            modes = game.MODES;
        if(modes.length === 0 ) {
            this.menu.hide();
            this.loadGame(game);
        } else {
            this.menu.load(Object.keys(modes), this.loadGameWithMode.bind(this, game))
        }
    }

    reset() {
        delete this.game;
        this.renderContext.clearRect(0,0,this.screen.width, this.screen.height);
        this.showGameSelect();
    }

    gameLoop() {  
        if(this.game) {
            requestAnimationFrame(this.gameLoop.bind(this));  
            this.renderContext.clearRect(0,0,this.screen.width, this.screen.height);
            this.game.tick(this.renderContext);
        }
    }

    menuInput(type) {
        switch(type) {
            case INPUTS.PRIMARY:
                this.menu.select();
                break;
            case INPUTS.UP:
                this.menu.changeActiveItem(1);
                break;
            case INPUTS.DOWN:
                this.menu.changeActiveItem(-1);
                break;
        }
    }
}
