import {
  Texture,
  TextureDataType,
  TextureFilter,
  WebGLMultipleRenderTargets,
  WebGLRenderTargetOptions,
  Wrapping,
} from "three";

export interface WebGLDefferdRenderTargetsOptions
  extends WebGLRenderTargetOptions {
  name: string;
}
export interface TextureWithName extends Texture {
  name: string;
}
export class WebGLDefferdRenderTargets extends WebGLMultipleRenderTargets {
  texture: TextureWithName[];
  constructor(
    width: number,
    height: number,
    options: WebGLDefferdRenderTargetsOptions[]
  ) {
    const count = options.length;
    super(width, height, count);
    for (let i = 0; i < count; i = i + 1) {
      this.texture[i].name = options[i].name;
      if (options[i].generateMipmaps !== undefined) {
        this.texture[i].generateMipmaps = options[i].generateMipmaps as boolean;
      }
      if (options[i].wrapS !== undefined) {
        this.texture[i].wrapS = options[i].wrapS as Wrapping;
      }
      if (options[i].wrapT !== undefined) {
        this.texture[i].wrapT = options[i].wrapT as Wrapping;
      }
      if (options[i].magFilter !== undefined) {
        this.texture[i].magFilter = options[i].magFilter as TextureFilter;
      }
      if (options[i].minFilter !== undefined) {
        this.texture[i].minFilter = options[i].minFilter as TextureFilter;
      }
      if (options[i].format !== undefined) {
        this.texture[i].format = options[i].format as number;
      }
      if (options[i].type !== undefined) {
        this.texture[i].type = options[i].type as TextureDataType;
      }
      if (options[i].anisotropy !== undefined) {
        this.texture[i].anisotropy = options[i].anisotropy as number;
      }
    }
  }
}
