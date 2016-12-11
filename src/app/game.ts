import { Context, TileMap, Render } from './';
import { Collidables } from './collidables';
import { RenderCall } from './render/renderCall';
import { Player } from './player/player';
import { Vector } from '../model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { CreepingDarkness } from './forces/creepingDarkness';


export class Game
{
	private fps = 60;
	private context: Context = new Context();
	private collidables: Collidables;
	private tileMap: TileMap = new TileMap();
	private creepingDarkness =  new CreepingDarkness();
	private render: Render;
	private renderCalls: RenderCall[] = [];
	private collision: CollisionDetection = new CollisionDetection();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private tileSizeX: number = 25;
	private tileSizeY: number = 25;
	private started: boolean = false;

	constructor() {
		var doneLoading = this.context.doneListener();

		doneLoading.subscribe(() => {
			this.render = new Render();
			this.start();
		});

		this.context.init(1200, 800);
		this.collidables = new Collidables(this.context);
		this.tileMap.create(this.context, this.tileSizeX, this.tileSizeY);
		this.creepingDarkness.init(this.context, this.tileMap.tiles);
		this.player = new Player(new Vector(200, 600), this.context, 42, 50);
	}

	private start() {
		this.initKeyBindings();
		setInterval(this.run(), (1000/this.fps));
	}

	private run() {
		var loops = 0, skipTicks = 1000 / this.fps,
      	maxFrameSkip = 10,
      	nextGameTick = (new Date).getTime();

  		return () => {
	    	loops = 0;

	    	while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
	      		//Todo gamelogic update
	      		this.renderCalls = [];
						this.collidables.update(this.tileMap.collidableTiles);
						this.creepingDarkness.update(this.player.repelingDarkness);
	      		this.collision.checkCollidables(this.player, this.collidables);
	      		this.checkKeys();
	      		this.collision.checkIfWallCollision(this.player, this.tileMap, this.tileSizeX);
	      		this.player.update();
		      	this.checkSolid();

	      		nextGameTick += skipTicks;
	      		loops++;
	    	}

	    	if(loops) {
					this.renderCalls.push(this.collidables.createRenderCall());
					this.renderCalls.push(this.tileMap.createRenderCall());
					this.renderCalls.push(this.player.createRenderCall());
					this.render.render(this.renderCalls);
	    	}
  		};
	}

	private checkKeys() {
		if(this.leftKeyPress) {
			this.player.moveLeft();
		}

		if(this.rightKeyPress) {
			this.player.moveRight();
		}

		if(this.jumpKeyPress) {
			this.player.jump();
		}
	}

	private checkSolid() {
		var tilesToCheck = this.collision.detectPossibleCollisions(this.player.position, this.tileMap.tiles, this.tileSizeX);
		let groundCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea());

		if(!groundCollision) {
			this.player.fall();
		} else {
			groundCollision = this.player.groundCollision();
		}

		let wallCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea());

		if(wallCollision) {
			this.player.wallCollision();
		}

		if(groundCollision && !wallCollision) {
			this.player.resetJump();
		}
	}

	private initKeyBindings() {

		document.body.addEventListener("keydown", (event: KeyboardEvent) => {

		    var keyCode = event.keyCode;

		    switch (keyCode) {
		    	case 65:
		    		this.leftKeyPress = true;
		    		break;
		    	case 68:
		    		this.rightKeyPress = true;
		    		break;
		    	case 87:
		    		this.jumpKeyPress = true;
		    }

		});

		document.body.addEventListener("keyup", (event: KeyboardEvent) => {

		    var keyCode = event.keyCode;

		    switch (keyCode) {
		    	case 65:
		    		this.leftKeyPress = false;
		    		break;
		    	case 68:
		    		this.rightKeyPress = false;
		    		break;
		    	case 87:
		    		this.jumpKeyPress = false;
		    		break;
		    }

		});

		document.getElementById("start").addEventListener("click", (event: MouseEvent) => {
			this.started = true;
		});

	}
}
