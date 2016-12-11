import { PowerUp, Tile } from '../model';
import { RenderCall } from './render/renderCall';
import { RenderHelper } from './render/renderHelper';
import { Context } from './context';

export class Collidables {

  public powerUps: PowerUp[] = [];
  private renderHelper: RenderHelper = RenderHelper.getInstance();
  private context: Context;
  private updateCount: number = 0;
  private powerUpOffset: number = 30;

  constructor(context: Context) {
    this.context = context;
  }

  public createRenderCall() {
    var renderCall: RenderCall = new RenderCall();
    var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

    for(let powerUp of this.powerUps) {
      vertecies = this.renderHelper.getVertecies(powerUp.box.x, powerUp.box.y, powerUp.box.width, powerUp.box.height, vertecies);
      textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, powerUp.type);
      indecies = this.renderHelper.getIndecies(indecies);
    }

    renderCall.vertecies = vertecies;
    renderCall.textureCoords = textureCoords;
    renderCall.indecies = indecies;
    renderCall.context = this.context;

    return renderCall;
  }

  public update(tiles: Tile[]) {
    this.updateCount++;
    if(this.updateCount > 120) {
        let type = Math.floor(Math.random() * 2) + 15;

        let i = this.getUnocupiedPosition(tiles);

        if(i >= 0) {
          if(type == 15) {
            this.powerUps.push(new PowerUp(tiles[i].x, tiles[i].y - this.powerUpOffset, 25, 25, type));
          } else {
            this.powerUps.push(new PowerUp(tiles[i].x, tiles[i].y - this.powerUpOffset, 25, 25, type));
          }
        }

        this.updateCount = 0;
    }
  }

  private getUnocupiedPosition(tiles: Tile[]) {

    let index = -1;

    for(var j = 0; j < 10; j++) {
      let i = Math.floor(Math.random() * tiles.length);
      let ocupied = false;

      for(let powerUp of this.powerUps) {
          if(tiles[i].x == powerUp.box.x && (tiles[i].y - this.powerUpOffset) == powerUp.box.y) {
              ocupied = true;
          }
      }

      if(!ocupied) {
        index = i;
        break;
      }
    }

    return index;
  }
}
