import {
  GLSL3,
  LinearFilter,
  Material,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  RGBAFormat,
  Texture,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import RenderPass from "./RenderPass";
import vs from "../../glsl/postpass.vert";
import toonfs from "../../glsl/toon.frag";
import bloomfs from "../../glsl/bloom.frag";
import fxaafs from "../../glsl/fxaa.frag";
import {
  renderInfo,
  WebGLDefferdRenderTargets,
} from "../WebGLDefferdRenderTargets";

/**
 * ポストエフェクトクラス
 * albedo,normalを受け取り、toon,bloomをかける。
 */
export class PostPass extends RenderPass {
  private uniforms: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [uniform in "cameraPos" | "resolution" | renderInfo]: {
      type: string;
      value: Texture | Vector2 | Vector3;
    };
  };
  private tempRenderTarget: WebGLRenderTarget[];
  private materials: Material[];
  private mesh: Mesh;
  /**
   * @param windowSize 画面サイズ
   * @param prevRenderTargets 前処理でのレンダリング結果
   */
  constructor(
    windowSize: Vector2,
    private prevRenderTargets: WebGLDefferdRenderTargets
  ) {
    super(new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000));
    this.camera.position.z = 100;
    const wrt = new WebGLRenderTarget(windowSize.x, windowSize.y, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
    });
    this.tempRenderTarget = [wrt, wrt.clone()];

    this.uniforms = {
      cameraPos: { type: "v3", value: this.camera.position },
      resolution: {
        type: "v2",
        value: new Vector2(windowSize.x, windowSize.y),
      },
      albedo: { type: "t", value: prevRenderTargets.texture[0] },
      normal: { type: "t", value: prevRenderTargets.texture[1] },
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
  render(renderer: WebGLRenderer) {
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
