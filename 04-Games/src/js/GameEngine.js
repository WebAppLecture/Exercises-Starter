import { Menu } from "./Menu.js";

export class GameEngine {

    constructor(controls, screen, menu, games) {
        this.controls = Array.from(controls);
        this.screen = screen;
        this.menu = new Menu(menu);
        this.games = games;

        this.setupCanvas();
        this.setKeyMapping();
        this.setupControlListeners();
        this.showGameSelect();
    }

    setupCanvas() {
        this.renderContext = this.screen.getContext('2d');
        this.screen.classList.add("on");
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
        if(this.game && type !== "reset") {
            this.game.input(type, active);  
        } else if(active && this.menuInteraction.hasOwnProperty(type)) {
            this.menuInteraction[type]();
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

    get menuInteraction() {
        return {
            "primary": () => this.menu.select(),
            "up": () => this.menu.changeActiveItem(1),
            "down": () => this.menu.changeActiveItem(-1),
            "reset": () => this.reset(),
        }
    }

    getGameByName(name) {
        return this.games.find(game => game.NAME.toLowerCase() === name.toLowerCase());
    }

    static getModeByName(game, modeName) {
        return game.MODES.find(mode => mode.NAME.toLowerCase() === modeName.toLowerCase());
    }
}
