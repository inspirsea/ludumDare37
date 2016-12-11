import { Tile, Vector } from '../model';
import { RenderCall } from './render/renderCall';
import { TextureMapper } from './render/textureMapper';
import { RenderHelper } from './render/renderHelper';
import { Context } from './';

export class TileMap {
	public renderCall: RenderCall = new RenderCall();
	public tiles: Tile[][] = [];
	public collidableTiles: Tile[] = [];
	private context: Context;
	private tileSizeX: number;
	private tileSizeY: number;
	private textureMapper = TextureMapper.getInstance();
	private renderHelper: RenderHelper = RenderHelper.getInstance();

	constructor() {
	}

	public create(context: Context, tileSizeX: number, tileSizeY: number) {
		this.context = context;

		this.tileSizeX = tileSizeX;
		this.tileSizeY = tileSizeY;

		var columnNumber = this.context.canvas.width / this.tileSizeX;
		var rowNumber = this.context.canvas.height / this.tileSizeY;

		for(var i = 0; i < columnNumber; i++) {
			this.tiles[i] = [];
			for(var j = 0; j < rowNumber; j++) {
				this.tiles[i][j] = new Tile((tileSizeX * i) + (tileSizeX / 2), (tileSizeY * j) + (tileSizeY / 2), tileSizeX, tileSizeY, 0);
			}
		}

		this.tiles[7][28].tileTextureType = 1;
		this.tiles[8][28].tileTextureType = 1;
		this.tiles[9][28].tileTextureType = 1;

		this.tiles[12][28].tileTextureType = 1;
		this.tiles[13][28].tileTextureType = 1;

		this.tiles[7][20].tileTextureType = 1;
		this.tiles[8][20].tileTextureType = 1;

		this.tiles[12][20].tileTextureType = 1;
		this.tiles[13][20].tileTextureType = 1;

		this.tiles[16][25].tileTextureType = 1;
		this.tiles[17][25].tileTextureType = 1;
		this.tiles[18][25].tileTextureType = 1;

		this.tiles[20][25].tileTextureType = 1;
		this.tiles[21][25].tileTextureType = 1;

		this.tiles[27][28].tileTextureType = 1;
		this.tiles[28][28].tileTextureType = 1;

		this.tiles[31][28].tileTextureType = 1;
		this.tiles[32][28].tileTextureType = 1;
		this.tiles[33][28].tileTextureType = 1;

		this.tiles[37][20].tileTextureType = 1;
		this.tiles[38][20].tileTextureType = 1;
		this.tiles[39][20].tileTextureType = 1;
		this.tiles[40][20].tileTextureType = 1;
		this.tiles[41][20].tileTextureType = 1;
		this.tiles[42][20].tileTextureType = 1;
		this.tiles[43][20].tileTextureType = 1;

		this.tiles[15][25].tileTextureType = 1;
		this.tiles[16][25].tileTextureType = 1;
		this.tiles[17][25].tileTextureType = 1;
		this.tiles[18][25].tileTextureType = 1;
		this.tiles[19][25].tileTextureType = 1;
		this.tiles[20][25].tileTextureType = 1;
		this.tiles[21][25].tileTextureType = 1;

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				if(this.tiles[i][j].tileTextureType != 0 && this.tiles[i][j].tileTextureType != 2) {
					this.collidableTiles.push(this.tiles[i][j]);
				}
			}
		}

}

	public createRenderCall() {
		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				if(this.tiles[i][j].tileTextureType != 0) {
					vertecies = this.renderHelper.getVertecies(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, vertecies);
					textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, this.tiles[i][j].tileTextureType);
					indecies = this.renderHelper.getIndecies(indecies);
				}
			}
		}

		this.renderCall.vertecies = vertecies;
		this.renderCall.textureCoords = textureCoords;
		this.renderCall.indecies = indecies;
		this.renderCall.context = this.context;

		return this.renderCall;
	}

}
