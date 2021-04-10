import { GameTemplate } from "./GameTemplate.js";
import { Ball, StrokedObject } from "../GameObject.js";

export class TestGame extends GameTemplate {

    start() {
        this.ball = new Ball(200, 250, 20, 20, "#6bd26b", 0, 0);
        this.centerMarker = new StrokedObject(195, 245, 30, 30, "#6bd26b", 2);
        this.centerX = 200;
        this.centerY = 250;
        this.deltaV = 15;
        this.gravityAccelleration = .5;
        this.gravity = false;
        this.centering = false;
        super.start();
    }
    
    input(type, active) {
        if(active) {
            switch(type) {
                case "up":
                    this.ball.vy += -this.deltaV;
                    break;
                case "down":
                    this.ball.vy += this.deltaV;
                    break;
                case "left":
                    this.ball.vx += -this.deltaV;
                    break;
                case "right":
                    this.ball.vx += this.deltaV;
                    break;
                case "primary":
                    this.centering = !this.centering;
                    break;
                case "secondary":
                    this.gravity = !this.gravity;
                    break;
            }
        }
    }

    calculateCentering() {
        let deltaX = this.ball.x - this.centerX,
            deltaY = this.ball.y - this.centerY;

        this.ball.vx -= (deltaX / 30);
        this.ball.vy -= (deltaY / 30);

        this.ball.vx *= .95;
        this.ball.vy *= .95;
    }

    update(ctx) {
        if(this.gravity) {
            this.ball.vy += this.gravityAccelleration;
            this.ball.vy *= .99;
            this.ball.vx *= .99;
        }
        if(this.centering) {
            this.calculateCentering();
        }
        this.ball.update(ctx);
        this.ball.borderCollision(ctx);
    }

    draw(ctx) {
        this.drawBoundingBox(ctx);
        this.ball.draw(ctx);
    }

    drawBoundingBox(ctx) {
        ctx.strokeStyle = "#6bd26b";
        ctx.lineWidth = 5;
        ctx.strokeRect(1, 1, ctx.canvas.width - 2, ctx.canvas.height - 2);

        this.centerMarker.draw(ctx);

        ctx.fillStyle = "#6bd26b";
        ctx.font = "30px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("Q: toggle physics", 200, 50);
        ctx.fillText("E: toggle centering", 200, 80);
    }

    static get NAME() {
        return "TestGame";
    }
}
