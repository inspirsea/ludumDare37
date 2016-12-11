import { Vector, Square, PowerUpCounter, PowerUp } from '../../model';
import { TextureMapper } from '../render/textureMapper';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';
import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
	public defaultJumpSpeed: number = -10;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public repelingDarkness = false;
	private extraJumpSpeed: number = 0;
	private context: Context;
	private runningAnimation: Animate = new Animate();
	private inverse: boolean = false;
	private velocity: Vector = new Vector(0, 0);
	private drag: number = 0.4;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private lastStablePosition: Vector;
	private gravity: Gravity = new Gravity();
	private jumping: boolean = false;
	private powerUpCounters: PowerUpCounter[] = [];
	private textureMapper: TextureMapper = TextureMapper.getInstance();

	constructor(position: Vector, context: Context, spriteSizeX: number, spriteSizeY: number) {
		this.position = position;
		this.lastStablePosition = new Vector(this.position.x, this.position.y);
		this.context = context;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		//this.animate.frames.push(new Point(1, 282));
		this.runningAnimation.frames.push(this.textureMapper.mapTexture(50));
		this.runningAnimation.frames.push(this.textureMapper.mapTexture(50));
		this.runningAnimation.frames.push(this.textureMapper.mapTexture(50));

	}

	public createRenderCall() {

		var call = new RenderCall();
		var x: number = this.position.x;
		var x1: number;
		var x2: number;

		if(this.inverse) {
			x2 = x - (this.spriteSizeX / 2);
			x1 = x + (this.spriteSizeX / 2);
		} else {
			x2 = x + (this.spriteSizeX / 2);
			x1 = x - (this.spriteSizeX / 2);
		}

  		var y1 = this.position.y - (this.spriteSizeY / 2);
  		var y2 = this.position.y + (this.spriteSizeY / 2);

		call.context = this.context;

		call.vertecies = [
			x1, y1,
     		x2, y2,
     		x2, y1,
     		x1, y1,
     		x2, y2,
     		x1, y2
		];

		var x1 = this.runningAnimation.getCurrentFrame().x/512;
		var y1 = this.runningAnimation.getCurrentFrame().y/512;
		var x2 = (this.runningAnimation.getCurrentFrame().x + this.runningAnimation.getCurrentFrame().width)/512;
		var y2 = (this.runningAnimation.getCurrentFrame().y + this.runningAnimation.getCurrentFrame().height)/512;


		call.textureCoords = [
				x1,  y1,
		    x2,  y2,
		    x2,  y1,
		    x1,  y1,
		    x2,  y2,
		    x1,  y2,
		];
		call.indecies = [0, 1, 2, 3, 4, 5];

		return call;

	}

	public update() {
		this.checkPowerUps();
		this.position.add(this.velocity);
		if(this.velocity.x != 0) {
			this.runningAnimation.next();
		}
		if(!this.moving) {
			if(this.velocity.x > 0) {
				this.velocity.x -= this.drag;
				if(this.velocity.x < this.drag) {
					this.velocity.x = 0;
				}
			} else if(this.velocity.x < 0) {
				this.velocity.x += this.drag;
				if(this.velocity.x > this.drag) {
					this.velocity.x = 0;
				}
			}
		}

		this.moving = false;
	}

	public moveRight() {
		if(this.velocity.x < 3) {
			this.velocity.x += 0.5;
		}
		this.inverse = false;
		this.moving = true;
	}

	public moveLeft() {

		if(this.velocity.x > -3) {
			this.velocity.x -= 0.5;
		}
		this.inverse = true;
		this.moving = true;
	}

	public getCollisionArea() {
		var collision = new Square(this.position.x, this.position.y, this.spriteSizeX, this.spriteSizeY);

		return collision;
	}

	public wallCollision() {
		this.position.x -= this.velocity.x;
		this.velocity.x = 0;
	}

	public fall() {
		this.gravity.apply(this.velocity);
	}

	public groundCollision() {
		let groundCollision = this.velocity.y > 0;

		this.position.y -= this.velocity.y;
		this.velocity.y = 0;

		return groundCollision;
	}

	public getNextCollisionArea(row: boolean) {
		if(row) {
			this.position.x += this.velocity.x;
		} else {
			this.position.y += this.velocity.y;
		}

		return this.getCollisionArea();
	}

	public jump() {
		if(!this.jumping) {
			this.velocity.y = (this.jumpSpeed - this.extraJumpSpeed);
			this.jumping = true;
		}
	}

	public resetJump() {
		this.jumping = false;
	}

	public addPowerUp(powerUp: PowerUp) {
		this.powerUpCounters.push(new PowerUpCounter(powerUp.type))
	}

	private checkPowerUps() {
		this.extraJumpSpeed = 0;
		this.repelingDarkness = false;
		for(let i = 0; i < this.powerUpCounters.length; i++) {
			if(this.powerUpCounters[i].type == 1) {
				this.extraJumpSpeed = 4;
			} else if(this.powerUpCounters[i].type == 15) {
				this.repelingDarkness = true;
			}
			this.powerUpCounters[i].count--;
			if(this.powerUpCounters[i].count <= 0) {
				this.powerUpCounters.splice(i, 1);
			}
		}
	}

}
