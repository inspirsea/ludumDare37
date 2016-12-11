import { Vector, Tile, Square, PowerUp } from '../../model';
import { Collision } from './';
import { Collidables } from '../collidables';
import { Player } from '../player/player';
import { TileMap } from '../tileMap';

export class CollisionDetection {

	constructor() {
	}

	public detectPossibleCollisions(position: Vector, tiles: Tile[][], tileSize: number) {
		var column = Math.floor(position.x/tileSize);
		var row = Math.floor(position.y/tileSize);

		var tilesToCheck: Tile[] = [];

		this.pushNull(tiles[column-1][row + 1], tilesToCheck);

		this.pushNull(tiles[column-1][row + 1], tilesToCheck);
		this.pushNull(tiles[column][row + 1], tilesToCheck);
		this.pushNull(tiles[column+1][row + 1], tilesToCheck);
		this.pushNull(tiles[column-1][row], tilesToCheck);
		this.pushNull(tiles[column][row], tilesToCheck);
		this.pushNull(tiles[column+1][row], tilesToCheck);
		this.pushNull(tiles[column-1][row - 1], tilesToCheck);
		this.pushNull(tiles[column][row - 1], tilesToCheck);
		this.pushNull(tiles[column+1][row - 1], tilesToCheck);

		return tilesToCheck;
	}

	private pushNull(tile: Tile, tilesToCheck: Tile[]) {
		if(tile != null) {
			tilesToCheck.push(tile);
		}
	}

	public checkCollision(tiles: Tile[], rect: Square, player: Player) {
		var collision = false;
			for(let tile of tiles) {
				if(tile.tileTextureType != 0) {
					if (tile.x - tile.width/2 < rect.x + rect.width/2 &&
	   				tile.x + tile.width/2 > rect.x - rect.width/2 &&
	   				tile.y - tile.height/2 < rect.y + rect.height/2 &&
	   				tile.y + tile.height/2 > rect.y - rect.height/2) {

						if(tile.tileTextureType == 2) {
							player.dead = true;
						}

						collision = true;
						break;
					}
				}
			}

		return collision;
	}

	public checkIfWallCollision(player: Player, tileMap: TileMap, tileSize: number) {

		var wallCollision = true;
		var i = 0;
		while(wallCollision && i < 10) {
			i++;
			var tilesToCheck = this.detectPossibleCollisions(player.position, tileMap.tiles, tileSize);

			if(tilesToCheck.length <= 0) {
				player.dead = true;
			}

			wallCollision = this.checkCollision(tilesToCheck, player.getNextCollisionArea(true), player);
			if(wallCollision) {
				player.wallCollision();
			}
		}

		return wallCollision;
	}

	public checkCollidables(player: Player, collidables: Collidables) {
		var collision = false;
		var rect = player.getCollisionArea();
			for(let i = 0; i < collidables.powerUps.length; i++) {
				if (collidables.powerUps[i].box.x - collidables.powerUps[i].box.width/2 < rect.x + rect.width/2 &&
					collidables.powerUps[i].box.x + collidables.powerUps[i].box.width/2 > rect.x - rect.width/2 &&
					collidables.powerUps[i].box.y - collidables.powerUps[i].box.height/2 < rect.y + rect.height/2 &&
					collidables.powerUps[i].box.y + collidables.powerUps[i].box.height/2 > rect.y - rect.height/2) {

					player.addPowerUp(collidables.powerUps[i]);

					collidables.powerUps.splice(i, 1);
				}
			}

		return collision;
	}
}
