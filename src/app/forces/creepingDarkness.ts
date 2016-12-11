import { Context } from '../context';
import { Tile } from '../../model/tile';

export class CreepingDarkness {
  private tiles: Tile[][];
  public creepingDarkness: Tile[] = [];

  constructior() {
  }

  public init(context: Context, tiles: Tile[][]) {
    this.tiles = tiles;
  }

  public update(repel: boolean) {

    if(repel) {
      let possibleTiles = this.getPossibleDarkness(0);
      if(possibleTiles.length > 0) {
        let i = Math.floor(Math.random() * possibleTiles.length);
        possibleTiles[i].tileTextureType = 0;
      }
    } else {
      let possibleTiles = this.getPossibleDarkness(2);
      if(possibleTiles.length > 0) {
        let i = Math.floor(Math.random() * possibleTiles.length);
        possibleTiles[i].tileTextureType = 2;
      }
    }

  }

  public repelDarkness() {

  }

  private getPossibleDarkness(type: number) {
    let possibleTiles: Tile[] = [];
    let iInvert = this.tiles.length - 1;
    let row = 0;
    let rowInvert = this.tiles[0].length - 1;
    let rightColumn: Tile[];
    let leftColumn: Tile[];
    let topRow: Tile[];
    let bottomRow: Tile[];

    for(let i = 0; i < this.tiles.length; i++) {
      topRow = this.row(this.tiles, row, type);
      bottomRow = this.row(this.tiles, rowInvert, type);
      rightColumn = this.column(this.tiles[iInvert], type);
      leftColumn = this.column(this.tiles[i], type);

      iInvert--;
      row = row < this.tiles[i].length - 1 ? row + 1 : row;
      rowInvert = rowInvert > 0 ? rowInvert - 1 : rowInvert;

      if(leftColumn.length > 0 || rightColumn.length > 0 || topRow.length > 0 || bottomRow.length > 0) {
        break;
      }
		}

    leftColumn.push.apply(leftColumn, rightColumn);
    leftColumn.push.apply(leftColumn, topRow);
    leftColumn.push.apply(leftColumn, bottomRow);

    return leftColumn;
  }

  private row(tiles: Tile[][], iRow: number, type: number) {
    let row : Tile[] = [];

    for(let i = 0; i < tiles.length; i++) {
      if(tiles[i][iRow].tileTextureType != type) {
          row.push(tiles[i][iRow]);
      }
    }

    return row;
  }

  private column(tiles: Tile[], type: number) {
    let column: Tile[] = [];
    for(let i = 0; i < tiles.length; i++) {
      if(tiles[i].tileTextureType != type) {
        column.push(tiles[i]);
      }
    }

    return column;
  }

}
