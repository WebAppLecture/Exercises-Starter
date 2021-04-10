import { MovableGameObject } from "../../GameObject.js";

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