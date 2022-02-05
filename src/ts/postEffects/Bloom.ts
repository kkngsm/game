import {
  GLSL3,
  IUniform,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  WebGLRenderer,
} from "three";
import RenderPath from "../renderPath/RenderPath";
import { Size } from "../scenes/Scene";
import vs from "../../glsl/standerd.vert";
import fs from "../../glsl/bloom.frag";
import { WebGLDefferdRenderTargets } from "../renderPath/WebGLDefferdRenderer";

export class BloomEffect extends RenderPath {
  /**レンダリング先のメッシュ */
  mesh: Mesh;
  /**一時的にレンダリング結果を保存するバッファー */
  tempRenderTargets: WebGLDefferdRenderTargets;
  /**任意の輝度以上を抽出するマテリアル */
  extract: RawShaderMaterial;
  /**
   * Bloomのポストエフェクトをかけるパス
   * @param size 画面サイズ
   * @param prevRenderTarget 直前のレンダリング結果
   */
  constructor(size: Size, prevRenderTarget: WebGLDefferdRenderTargets) {
    super(new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000));
    this.camera.position.z = 100;

    if (prevRenderTarget.texture[0].name !== "albedo") {
      throw new Error("renderInfo error");
    }
    this.extract = new RawShaderMaterial({
      uniforms: {
        width: { type: "f", value: size.width },
        height: { type: "f", value: size.height },
        albedo: { type: "t", value: prevRenderTarget.texture[0] },
      } as { [uniform: string]: IUniform },
      vertexShader: vs,
      fragmentShader: fs,
      glslVersion: GLSL3,
    });
    const plane = new PlaneGeometry(1.0, 1.0);
    this.mesh = new Mesh(plane, this.extract);
    this.scene.add(this.mesh, this.camera);
  }
  render(renderer: WebGLRenderer) {
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
}
