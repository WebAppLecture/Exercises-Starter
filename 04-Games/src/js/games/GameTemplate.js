import { INPUTS } from "../inputs.js";

/**
 * 'Abstrakte' Klasse die alle Interfaces definiert die nötig sind um GameBox Spiel auszuführen.
 */
export class GameTemplate {

    /**
     * Konstruktor, erstellt die Instanzen der Klasse.
     * Extern aufgerufen durch 'new GameTemplate(mode)'.
     * @param {*} mode String der auf den gewählten Modus (definiert in MODES) zeigt
     */
    constructor(mode) {
        this.applyMode(mode);
        this.start();
    }

    /**
     * Definiert den am Ende des Spiels angezeigten Text.
     */
    get gameOverText() {
        return ["GAME OVER"];
    }

    /**
     * Setzt die in MODE definierten Werte.
     * 
     * 'this.constructor' erlaubt uns auch in erbenden Klassen auf statische Methoden/Variablen zuzugreifen.
     * Entspricht hier GameTemplate.MODES; vererbt korrekt zu Pong.MODES bei Pong.
     * 
     * Object.assign(a, b) fügt alle Eigenschaften von Object b zu Object a hinzu.
     * In diesem Fall alle im jeweiligen MODE definierten Variablenwerte zu this.
     * @param {*} mode String der auf den gewählten Modus (definiert in MODES) zeigt
     */
    applyMode(mode) {
        if(mode && this.constructor.MODES.hasOwnProperty(mode)) {
            Object.assign(this, this.constructor.MODES[mode]);
        }   
    }

    /**
     * Alle Änderungen die beim Start des Spiels gemacht werden müssen.
     * z.B. gameOver deaktivieren, Spieler erstellen, Zählvariablen zurücksetzen, usw.
     */
    start() {
        this.gameOver = false;
    }

    /**
     * Alle Änderungen die bei Ende des Spiels ausgeführt werden sollen.
     * z.B. setzen der gameOver Variable, löschen von Objekten, usw.
     */
    end() {
        this.gameOver = true;
    }

    /**
     * Wird von GameEngine.gameLoop() einmal pro Frame aufgerufen.
     * D.h. 60 mal pro Sekunde bei üblichen Bildschirmen.
     * @param {*} ctx rendering Kontext der Canvas
     */
    tick(ctx) {
        if(this.gameOver) {
            this.gameOverScreen(ctx);
            return;
        }
        this.update(ctx);
        this.draw(ctx);
    }

    /**
     * Updatemethode
     * Beinhaltet jegliche regelmäßige Berechnung des Spiels.
     * z.B. Bewegung, Kollisionsabfragen, Spawnverhalten, usw.
     * @param {*} ctx rendering Kontext der Canvas
     */
    update(ctx) {}

    /**
     * Zeichenmethode
     * Beinhaltet die draw() Aufrufe aller zu zeichnenden Objekte in der Szene.
     * @param {*} ctx rendering Kontext der Canvas
     */
    draw(ctx) {}

    /**
     * Zeichnet den Textinhalt von this.gameOverText in die Szene.
     * Wird in jedem tick() aufgerufen, erlaubt also auch Animation.
     * @param {*} ctx rendering Kontext der Canvas
     */
    gameOverScreen(ctx) {
        let fontSize = 30;
        ctx.fillStyle = "#6bd26b";
        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";

        let startY = ctx.canvas.height/2 - this.gameOverText.length/2 * fontSize;
        this.gameOverText.forEach((line, i) => {
            ctx.fillText(line, ctx.canvas.width/2, startY + i * fontSize);
        }); 
    }

    /**
     * Schnittstelle für Nutzereingaben.
     * Wird von GameEngine.input() aufgerufen
     * @param {*} type Typ des Eingabe Events
     * @param {*} active true falls mouse/key-down, false falls mouse/key-up
     */
    input(type, active) {
        switch(type) {
            case INPUTS.PRIMARY:
                break;
            case INPUTS.SECONDARY:
                break;
            case INPUTS.UP:
                break;
            case INPUTS.RIGHT:
                break;
            case INPUTS.DOWN:
                break;
            case INPUTS.LEFT:
                break;
            default:
                break;
        }
    }

    /**
     * Definiert verfügbare Modi für das Spiel.
     */
    static get MODES() {
        return [];
    }

}