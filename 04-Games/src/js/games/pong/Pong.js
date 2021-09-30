import { GameTemplate } from "../GameTemplate.js";
import { GameObject, Ball } from "../../GameObject.js";
import { Paddle } from './Paddle.js';

/**
 * GameBox Implementation des Klassikers "Pong".
 * https://de.wikipedia.org/wiki/Pong
 */
export class Pong extends GameTemplate{

    start() {
        this.leftPaddle = new Paddle(0, 250 - this.paddleSize/2, 10, this.paddleSize, this.paddleSpeed);
        this.rightPaddle = new Paddle(390, 250 - this.paddleSize/2, 10, this.paddleSize, this.paddleSpeed);
        this.ball = new Ball(200, 240, 20, 20, "#6bd26b", 8, 0);
        this.leftPoints = 0;
        this.rightPoints = 0;
        this.POINTS_TO_WIN = 5;
        super.start();
    }

    checkPoints() {
        if(this.leftPoints >= this.POINTS_TO_WIN || this.rightPoints >= this.POINTS_TO_WIN) { 
            this.end();
        }
    }

    get gameOverText() {
        return [
            "GAME OVER", 
            "",
            "",
            "rematch: E"];
    }

    input(type, active) {
        if(this.gameOver && active && type === "primary") {
            this.start();
        }
        switch(type) {
            case "primary":
                this.rightPaddle.up(active)
                break;
            case "secondary":
                this.rightPaddle.down(active)
                break;
            case "up":
                this.leftPaddle.up(active)
                break;
            case "down":
                this.leftPaddle.down(active)
                break;
            default:
                break;
        }
    }

    update(ctx) {
        this.leftPaddle.update(ctx);
        this.rightPaddle.update(ctx);
    
        this.ball.update(ctx);
        this.borderCollsion(this.ball.borderCollision(ctx));

        this.paddleCollision(ctx);
    }

    draw(ctx) {
        this.leftPaddle.draw(ctx);
        this.rightPaddle.draw(ctx);
        this.ball.draw(ctx);
        this.drawPoints(ctx);
    }

    drawPoints(ctx, fixed) {
        ctx.fillStyle = "#6bd26b";
        ctx.font = "30px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(this.leftPoints, 40, fixed ? 250 : this.leftPaddle.y + this.paddleSize/2);
        ctx.fillText(this.rightPoints, 360, fixed ? 250 : this.rightPaddle.y + this.paddleSize/2);
    }

    gameOverScreen(ctx) {
        this.drawPoints(ctx, true);
        super.gameOverScreen(ctx);
    }

    borderCollsion(collisions) {
        if(collisions) {
            if(collisions.includes(Ball.COLLISIONS.LEFT)) {
                this.rightPoints++;
                this.checkPoints();
            }
            if(collisions.includes(Ball.COLLISIONS.RIGHT)) {
                this.leftPoints++;
                this.checkPoints();
            }
        }
    }

    paddleCollision(ctx) {
        [this.leftPaddle, this.rightPaddle].forEach(paddle => {
            if(GameObject.rectangleCollision(this.ball, paddle)) {
                this.handleHit(ctx, paddle);
            }
        });
    }

    handleHit(ctx, paddle) {
        if( this.ball.x < ctx.canvas.width/2) { // left paddle hit
            this.ball.x = paddle.x + paddle.width;
        } else { // right paddle hit
            this.ball.x = paddle.x - this.ball.width;
        }
        this.ball.vx = -this.ball.vx;
        this.ball.vy += paddle.vy * 1.01;

        this.limitBallSpeed();   
    }

    limitBallSpeed() {
        this.ball.vx = this.limit(this.ball.vx, -this.maxBallSpeed, this.maxBallSpeed);
        this.ball.vy = this.limit(this.ball.vy, -this.maxBallSpeed, this.maxBallSpeed); 
    }

    limit(a, lower, upper) {
        if(a < lower) {
            return lower * 1.01;
        }
        if(a > upper) {
            return upper * 1.01;
        } 
        return a;
    }

    static get NAME() {
        return "Pong";
    }

    static get MODES() {
        return {
            easy: {
                maxBallSpeed: 8,
                paddleSize: 100,
                paddleSpeed: 10,
            },
            medium: {
                maxBallSpeed: 20,
                paddleSize: 80,
                paddleSpeed: 8,
            },
            hard: {
                maxBallSpeed: 30,
                paddleSize: 60,
                paddleSpeed: 12,
            },
        };
    }

}
