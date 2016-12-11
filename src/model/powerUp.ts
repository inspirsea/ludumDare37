import { Square } from './'

export class PowerUp {

  public box: Square;
  public type: number;

  constructor(private x: number, private y: number, private width: number, private height: number, type: number) {
    this.box =  new Square(x, y, width, height);
    this.type = type;
  }
}
