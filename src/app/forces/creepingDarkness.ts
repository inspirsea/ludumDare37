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
      let possibleTiles = this.getPossibleDarkness(2, repel);
      if(possibleTiles.length > 0) {
        let i = Math.floor(Math.random() * possibleTiles.length);
        possibleTiles[i].tileTextureType = 0;
      }
    } else {
      let possibleTiles = this.getPossibleDarkness(2, repel);
      if(possibleTiles.length > 0) {
        let i = Math.floor(Math.random() * possibleTiles.length);
        possibleTiles[i].tileTextureType = 2;
      }
    }

  }

  public repelDarkness() {

  }


  private getPossibleDarkness(type: number, repel: boolean) {

    let possibleTiles: Tile[] = [];
    let iInvert = this.tiles.length - 1;
    let row = 0;
    let rowInvert = this.tiles[0].length - 1;
    let rightColumn: Tile[];
    let leftColumn: Tile[];
    let topRow: Tile[];
    let bottomRow: Tile[];
    let i = 0;
    let j = 0;

    if(repel) {
      row = this.tiles[0].length/2;
      rowInvert = this.tiles[0].length/2 - 1;
      i = this.tiles.length/2;
      iInvert = this.tiles.length/2 - 1;
    }

    for(; i < this.tiles.length; i++) {
      topRow = this.row(this.tiles, row, type, j, repel);
      bottomRow = this.row(this.tiles, rowInvert, type, j, repel);
      rightColumn = this.column(this.tiles[iInvert], type, j, repel);
      leftColumn = this.column(this.tiles[i], type, j, repel);

      iInvert--;
      row = row < this.tiles[i].length - 1 ? row + 1 : row;
      rowInvert = rowInvert > 0 ? rowInvert - 1 : rowInvert;
      j++;

      if(leftColumn.length > 0 || rightColumn.length > 0 || topRow.length > 0 || bottomRow.length > 0) {
        break;
      }
		}

    leftColumn.push.apply(leftColumn, rightColumn);
    leftColumn.push.apply(leftColumn, topRow);
    leftColumn.push.apply(leftColumn, bottomRow);

    return leftColumn;
  }

  private row(tiles: Tile[][], iRow: number, type: number, size:number, repel: boolean) {
    let row : Tile[] = [];
    let i = 0;
    let end = tiles.length;

    if(repel) {
      i = (tiles.length/2) - (size + 1);
      end = (tiles.length/2) + (size + 1);
    }

    for(; i < end; i++) {
      if(repel) {
        if(tiles[i][iRow].tileTextureType == type) {
          row.push(tiles[i][iRow]);
        }
      } else {
        if(tiles[i][iRow].tileTextureType != type) {
            row.push(tiles[i][iRow]);
        }
      }
    }

    return row;
  }

  private column(tiles: Tile[], type: number, size:number, repel: boolean) {
    let column: Tile[] = [];
    let i = 0;
    let end = tiles.length;

    if(repel) {
      i = (tiles.length/2) - size;
      end = (tiles.length/2) + size;
      i = i < 0 ? 0 : i;
      if(end > tiles.length-1) {
        end = tiles.length-1;
      }
    }

    for(; i < end; i++) {
      if(repel) {
        if(tiles[i].tileTextureType == type) {
          column.push(tiles[i]);
        }
      } else {
        if(tiles[i].tileTextureType != type) {
          column.push(tiles[i]);
        }
      }

    }

    return column;
  }

}
