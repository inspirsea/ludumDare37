import { Vector, Square } from '../../model';

export class TextureMapper {

	private static instance: TextureMapper = new TextureMapper();

  constrcuctor() {
		if(TextureMapper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		TextureMapper.instance = this;
	}

	public static getInstance() {
		return TextureMapper.instance;
	}

	public mapTexture(textureType: number) {
		switch(textureType) {
			case 1: return new Square(0, 0, 64, 64);
			case 2: return new Square(64, 0, 64, 64);
			case 3: return new Square(0, 320, 64, 64);
			case 15: return new Square(64, 320, 64, 64);
			case 16: return new Square(0, 320, 64, 64);
			case 50: return new Square(0, 448, 64, 64);
			case 100: return new Square(192, 192, 128, 128);
		}
	}

}
