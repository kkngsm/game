import {
  GLSL3,
  LinearFilter,
  Material,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  RGBAFormat,
  UnsignedByteType,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import RenderPass from "./RenderPass";
import { Size } from "../scenes/Scene";
import vs from "../../glsl/postpass.vert";
import toonfs from "../../glsl/toon.frag";
import bloomfs from "../../glsl/bloom.frag";
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
    [uniform in "cameraPos" | "width" | "height" | renderInfo]: {
      type: string;
      value: any;
    };
  };
  private tempRenderTarget: WebGLRenderTarget;
  private materials: Material[];
  private mesh: Mesh;
  /**
   * @param size 画面サイズ
   * @param prevRenderTargets 前処理でのレンダリング結果
   */
  constructor(
    size: Size,
    private prevRenderTargets: WebGLDefferdRenderTargets
  ) {
    super(new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000));
    this.camera.position.z = 100;
    this.tempRenderTarget = new WebGLRenderTarget(size.width, size.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
    });

    this.uniforms = {
      cameraPos: { type: "v3", value: this.camera.position },
      width: { type: "f", value: size.width },
      height: { type: "f", value: size.height },
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
    const maxIndex = this.materials.length - 1;
    for (let i = 0; i < maxIndex; i++) {
      this.mesh.material = this.materials[i];
      renderer.setRenderTarget(this.tempRenderTarget);
      renderer.render(this.scene, this.camera);
      [this.uniforms.albedo.value, this.tempRenderTarget.texture] = [
        this.tempRenderTarget.texture,
        this.uniforms.albedo.value,
      ];
    }

    this.mesh.material = this.materials[maxIndex];
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);

    [this.uniforms.albedo.value, this.tempRenderTarget.texture] = [
      this.tempRenderTarget.texture,
      this.uniforms.albedo.value,
    ];
  }
}
