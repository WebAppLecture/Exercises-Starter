import { GameTemplate } from "../GameTemplate.js";
import { GameObject, StrokedObject } from "../../GameObject.js";
import { FpsControl } from "./FpsControl.js";

export class Snake extends GameTemplate{

    start() {
        this.fpsControl = new FpsControl();
        this.fpsControl.fps = this.speed;

        this.startLength = 10;
        this.headOrientation = Snake.orientations.UP;
        this.nextMove = this.headOrientation;
        this.segments = [];
        this.initSnake(this.startLength);
        super.start();
    }

    input(type, active) {
        if(this.inputBinding.hasOwnProperty(type)) {
            this.inputBinding[type](active);
        }
        if(this.gameOver && active && type === "primary") {
            console.log("start");
            this.start();
        }
    }

    get inputBinding() {
        return {
            up: active => this.changeDirection(Snake.orientations.UP, active), 
            down: active => this.changeDirection(Snake.orientations.DOWN, active),  
            left: active => this.changeDirection(Snake.orientations.LEFT, active),
            right: active => this.changeDirection(Snake.orientations.RIGHT, active),
        };
    }

    get gameOverText() {
        return [
            "GAME OVER", 
            "Score: " + (this.segments.length - this.startLength) ,
            "Restart: E"];
    }

    initSnake(size) {
        for(let i = size; i--;) {
            this.segments.push(new GameObject(200, 400, 25, 25, "#6bd26b"));
        }
    }

    changeDirection(orientation, keyDown) {
        if(keyDown && orientation.x + this.headOrientation.x !== 0) {
            this.nextMove = orientation;
        };
    }

    update(ctx) {
        if(this.fpsControl.frameLock) {
            return;
        }
        
        this.moveSegments();

        if(this.borderCollsion(ctx) || this.selfCollision()) {
            this.end();
        }

        this.foodCollision();

        if(!this.food) {
            this.spawnFood(ctx);
        }
    }

    moveSegments() {
        for(let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i].x = this.segments[i - 1].x;
            this.segments[i].y = this.segments[i - 1].y;
        }

        this.segments[0].x += this.nextMove.x * this.segments[0].width;
        this.segments[0].y += this.nextMove.y * this.segments[0].height;

        this.headOrientation = this.nextMove;
    }

    draw(ctx) {
        this.drawBoundingBox(ctx);
        this.segments.forEach(segment => segment.draw(ctx));
        this.food?.draw(ctx);
    }

    drawBoundingBox(ctx) {
        ctx.strokeStyle = "#6bd26b";
        ctx.lineWidth = 5;
        ctx.strokeRect(1, 1, ctx.canvas.width - 2, ctx.canvas.height - 2);
    }

    borderCollsion(ctx) {
        let head = this.segments[0];
        return !(
            head.x >= 0 &&
            head.y >= 0 &&
            head.x + head.width <= ctx.canvas.width &&
            head.y + head.height <= ctx.canvas.height
        );
    }

    selfCollision() {
        let head = this.segments[0];

        for(let i=this.segments.length - 1; i >= 4; i--) { 
            if( this.segments[i].x === head.x && this.segments[i].y === head.y ) {
                return true;
            }
        }
        return false;
    }

    foodCollision() {
        let head = this.segments[0];

        if(this.food && this.food.x === head.x && this.food.y === head.y) {
            this.segments.push(new GameObject(
                this.food.x,
                this.food.y,
                25, 25, "#6bd26b"
            ));
            delete this.food;
        }
    }

    spawnFood(ctx) {
        let size = 25,
            x,
            y,
            legalCoordinates = false;
    
        while(!legalCoordinates) {
            x = Math.floor(Math.random() * ctx.canvas.width/size) * size;
            y = Math.floor(Math.random() * ctx.canvas.height/size) * size;
            legalCoordinates = !this.segments.some(segment => segment.x === x && segment.y === y);
        }

        this.food = new StrokedObject(x, y, 25, 25, "#6bd26b", 5);
    }

    static get orientations() {
        return {
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 },
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
        };
    }

    static get MODES() {
        return {
            slow: {
                speed: 2
            },
            medium: {
                speed: 5
            },
            fast: {
                speed: 10
            }
        }
    }

}
