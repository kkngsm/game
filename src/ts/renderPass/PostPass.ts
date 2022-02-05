import {
  GLSL3,
  Material,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import RenderPass from "./RenderPass";
import { Size } from "../scenes/Scene";
import vs from "../../glsl/standerd.vert";
import bloomfs from "../../glsl/bloom.frag";
import {
  renderInfo,
  WebGLDefferdRenderTargets,
} from "../WebGLDefferdRenderTargets";

export class PostPass extends RenderPass {
  private uniforms: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [uniform in "width" | "height" | renderInfo]: { type: string; value: any };
  };
  private tempRenderTarget: WebGLRenderTarget;
  private materials: Material[];
  private mesh: Mesh;
  constructor(
    size: Size,
    private prevRenderTargets: WebGLDefferdRenderTargets
  ) {
    super(new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000));
    this.camera.position.z = 100;
    this.tempRenderTarget = new WebGLRenderTarget(size.width, size.height);

    this.uniforms = {
      width: { type: "f", value: size.width },
      height: { type: "f", value: size.height },
      albedo: { type: "t", value: prevRenderTargets.texture[0] },
      normal: { type: "t", value: prevRenderTargets.texture[1] },
    };

    this.materials = [
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
  render(renderer: WebGLRenderer) {
    const maxIndex = this.materials.length - 1;
    for (let i = 0; i < maxIndex; i++) {
      this.mesh.material = this.materials[i];
      renderer.setRenderTarget(this.tempRenderTarget);
      renderer.clear();
      renderer.render(this.scene, this.camera);
      [this.uniforms.albedo.value, this.tempRenderTarget.texture] = [
        this.tempRenderTarget.texture,
        this.uniforms.albedo.value,
      ];
    }
    this.mesh.material = this.materials[maxIndex];
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
}
