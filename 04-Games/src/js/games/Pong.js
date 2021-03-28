import { GameTemplate } from "./GameTemplate.js";
import { GameObject, MovableGameObject, Ball } from "../GameObject.js";
import { Inputs } from "../Inputs.js";

export class Pong extends GameTemplate{

    start() {
        this.leftPaddle = new Paddle(0, 250 - this.paddleSize/2, 10, this.paddleSize, this.paddleSpeed);
        this.rightPaddle = new Paddle(390, 250 - this.paddleSize/2, 10, this.paddleSize, this.paddleSpeed);
        this.ball = new Ball(200, 240, 20, 20, "#6bd26b", 8, 0);
        this.leftPoints = 0;
        this.rightPoints = 0;
        this.pointsToWin = 5;
    }

    checkPoints() {
        if(this.leftPoints >= this.pointsToWin || this.rightPoints >= this.pointsToWin) { 
            this.end();
        }
    }

    get inputBinding() {
        return {
            "up": active => this.leftPaddle.up(active), 
            "down": active => this.leftPaddle.down(active),  
            "primary": active => this.rightPaddle.up(active),
            "secondary": active => this.rightPaddle.down(active),
        };
    }

    get gameOverText() {
        return [
            "GAME OVER", 
            "",
            "",
            "rematch: E"];
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

    get MODES() {
        return Pong.MODES;
    }

    static get MODES() {
        return {
            easy: {
                "maxBallSpeed": 8,
                "paddleSize": 100,
                "paddleSpeed": 8,
            },
            medium: {
                "maxBallSpeed": 20,
                "paddleSize": 80,
                "paddleSpeed": 8,
            },
            hard: {
                "maxBallSpeed": 30,
                "paddleSize": 60,
                "paddleSpeed": 12,
            },
        };
    }

}

export class Paddle extends MovableGameObject {
    
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, "#6bd26b", 0, 0);
        this.speed = speed;
    }

    up(bool) {    
        this.vy = bool * -this.speed; 
    }

    down(bool) {
        this.vy = bool * this.speed;
    }

    left(bool) {    
        this.vx = bool * -this.speed; 
    }

    right(bool) {
        this.vx = bool * this.speed;
    }

    update(ctx) {

        if(this.vy === 0 && this.vx === 0) {
            return;
        }
        if(this.y < 0) { // Top border
            this.y = 0;
        } 
        if(this.y + this.height > ctx.canvas.height) { // bottom border
            this.y = ctx.canvas.height - this.height;
        }
        if(this.x < 0) { // left border
            this.x = 0;
        } 
        if(this.x + this.width > ctx.canvas.width) { // right border
            this.x = ctx.canvas.width - this.width;
        }
        super.update();
    }

}