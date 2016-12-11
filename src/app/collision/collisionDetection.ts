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
		tilesToCheck.push(tiles[column-1][row + 1]);
		tilesToCheck.push(tiles[column][row + 1]);
		tilesToCheck.push(tiles[column+1][row + 1]);
		tilesToCheck.push(tiles[column-1][row]);
		tilesToCheck.push(tiles[column][row]);
		tilesToCheck.push(tiles[column+1][row]);
		tilesToCheck.push(tiles[column-1][row - 1]);
		tilesToCheck.push(tiles[column][row - 1]);
		tilesToCheck.push(tiles[column+1][row - 1]);

		return tilesToCheck;
	}

	public checkCollision(tiles: Tile[], rect: Square) {
		var collision = false;
			for(let tile of tiles) {
				if(tile.tileTextureType != 0) {
					if (tile.x - tile.width/2 < rect.x + rect.width/2 &&
	   				tile.x + tile.width/2 > rect.x - rect.width/2 &&
	   				tile.y - tile.height/2 < rect.y + rect.height/2 &&
	   				tile.y + tile.height/2 > rect.y - rect.height/2) {

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
			wallCollision = this.checkCollision(tilesToCheck, player.getNextCollisionArea(true));
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
