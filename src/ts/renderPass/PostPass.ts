import {
  GLSL3,
  LinearFilter,
  Material,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  RGBAFormat,
  Uniform,
  UnsignedByteType,
  WebGLRenderTarget,
} from "three";
import RenderPass from "./RenderPass";
import vs from "../../glsl/postEffects/postpass.vert";
import toonfs from "../../glsl/postEffects/toon.frag";
import bloomfs from "../../glsl/postEffects/bloom.frag";
import fxaafs from "../../glsl/postEffects/fxaa.frag";
import {
  renderInfo,
  WebGLDefferdRenderTargets,
} from "../WebGLDefferdRenderTargets";
import { GameProps, RenderProps } from "../../types/type";

/**
 * ポストエフェクトクラス
 * albedo,normalを受け取り、toon,bloomをかける。
 */
export class PostPass extends RenderPass {
  private uniforms: {
    [uniform in "cameraPos" | "resolution" | renderInfo]: Uniform;
  };
  private tempRenderTarget: WebGLRenderTarget[];
  private materials: Material[];
  private mesh: Mesh;
  /**
   * @param windowSize 画面サイズ
   * @param prevRenderTargets 前処理でのレンダリング結果
   */
  constructor(
    gps: GameProps,
    rps: RenderProps,
    private prevRenderTargets: WebGLDefferdRenderTargets
  ) {
    super(rps);
    this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);
    this.camera.position.z = 100;

    const wrt = new WebGLRenderTarget(gps.windowSize.x, gps.windowSize.y, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
    });
    this.tempRenderTarget = [wrt, wrt.clone()];

    this.uniforms = {
      cameraPos: new Uniform(this.camera.position),
      resolution: new Uniform(gps.windowSize),
      albedo: new Uniform(prevRenderTargets.texture[0]),
      normal: new Uniform(prevRenderTargets.texture[1]),
    };

    this.materials = [
      /*toon */
      new RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: toonfs,
        glslVersion: GLSL3,
      }),
      /*bloom */
      new RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: bloomfs,
        glslVersion: GLSL3,
      }),
      /*fxaa */
      new RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vs,
        fragmentShader: fxaafs,
        glslVersion: GLSL3,
      }),
    ];
    const plane = new PlaneGeometry(1.0, 1.0);
    this.mesh = new Mesh(plane, this.materials[0]);
    this.scene.add(this.mesh, this.camera);
  }
  /**
   * レンダリングをする。
   * @param renderer WebGLRenderer
   */
  render(): void {
    const { renderer } = this.rps;
    this.uniforms.albedo.value = this.prevRenderTargets.texture[0];
    const maxIndex = this.materials.length - 1;
    for (let i = 0; i < maxIndex; i++) {
      this.mesh.material = this.materials[0];
      const renderTarget = this.tempRenderTarget[i % 2];
      renderer.setRenderTarget(renderTarget);
      renderer.render(this.scene, this.camera);
      this.uniforms.albedo.value = renderTarget.texture;
    }

    this.mesh.material = this.materials[maxIndex];
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }
}
