import {
  GLSL3,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
} from "three";
import RenderPath from "../renderPath/RenderPath";
import { Size } from "../scenes/Scene";
import vs from "../../glsl/standerd.vert";
import fs from "../../glsl/standerd.frag";
import { TextureWithName } from "../renderPath/WebGLDefferdRenderer";
export class PostEffect extends RenderPath {
  uniforms: { [uniform: string]: { type: string; value: any } };
  constructor(size: Size, textures: TextureWithName[]) {
    super(new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000));
    this.camera.position.z = 100;

    this.uniforms = {
      width: { type: "f", value: size.width },
      height: { type: "f", value: size.height },
    };
    for (const tex of textures) {
      this.uniforms[tex.name] = { type: "t", value: tex };
    }
    const mat = new RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      glslVersion: GLSL3,
    });
    const plane = new PlaneGeometry(1.0, 1.0);
    const mesh = new Mesh(plane, mat);
    this.scene.add(mesh, this.camera);
  }
}
