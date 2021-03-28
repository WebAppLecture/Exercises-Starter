export class GameTemplate {

    constructor(mode) {
        this.fillStyle = "#6bd26b";
        if(mode) {
            this.applyMode(mode);
        }
        this.start();
        this.gameOver = false;
    }

    get inputBinding() {}

    get gameOverText() {
        return ["GAME OVER", "Restart: E"];
    }

    applyMode(mode) {
        Object.keys(this.constructor.MODES[mode]).forEach(key => {
            this[key] = this.constructor.MODES[mode][key];
        });
    }

    start() {}

    end() {
        this.gameOver = true;
    }

    tick(ctx) {
        if(this.gameOver) {
            this.gameOverScreen(ctx);
            return;
        }
        this.update(ctx);
        this.draw(ctx);
    }

    update() {}

    draw() {}

    gameOverScreen(ctx) {
        let fontSize = 30;
        ctx.fillStyle = this.fillStyle;
        ctx.font = fontSize + "x monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";

        let startY = ctx.canvas.height/2 - this.gameOverText.length/2 * fontSize;
        this.gameOverText.forEach((line, i) => {
            ctx.fillText(line, ctx.canvas.width/2, startY + i * fontSize);
        }); 
    }

    input(type, active) {
        if(this.gameOver && type === "primary") {
            this.start();
        }
        if(this.inputBinding.hasOwnProperty(type)) {
            this.inputBinding[type](active);
        }
    }

    static get MODES() {
        return [];
    }

}