import {
  BufferGeometry,
  Float32BufferAttribute,
  GLSL3,
  LinearFilter,
  OrthographicCamera,
  Points,
  RepeatWrapping,
  RGBAFormat,
  Scene as TScene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import renderParticleVs from "../../../glsl/bossTexture/renderParticle.vert";
import renderParticleFs from "../../../glsl/bossTexture/renderParticle.frag";
import config from "../../config";
export class Drawer {
  camera: OrthographicCamera;
  scene: TScene;
  result: WebGLRenderTarget;
  uniforms: {
    [uniform: string]: {
      type: string;
      value: any;
    };
  };
  constructor() {
    const { particleNumSqrt } = config.enemy;
    const particleNum = particleNumSqrt * particleNumSqrt;
    this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);
    this.camera.position.z = 100;
    this.result = new WebGLRenderTarget(512, 512, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      format: RGBAFormat,
    });

    // パーティクルの設定
    const particlesPos = new Float32Array(particleNum * 3);
    const particlesIndices = new Float32Array(particleNum).map((_, i) => i);
    const particles = new BufferGeometry();
    particles.setAttribute(
      "position",
      new Float32BufferAttribute(particlesPos, 3)
    );
    particles.setAttribute(
      "index",
      new Float32BufferAttribute(particlesIndices, 1)
    );

    this.uniforms = {
      resolution: { type: "f", value: particleNumSqrt },
      screenWidth: { type: "f", value: undefined },
      screenHeight: { type: "f", value: undefined },
      time: { type: "f", value: 0 },
      mouse: { type: "v2", value: new Vector2(0.5, 0.5) },

      dataTex: { type: "t", value: undefined },
      drawTex: { type: "t", value: undefined },

      // spm(瞳孔括約筋, sphincter pupillae muscles) におけるパラメータ
      spmTheta: { type: "f", value: 0.1 },
      spmDist: { type: "f", value: 5 },
      spmSpeed: { type: "f", value: 1 },

      // dpm(瞳孔散大筋, dilator pupillae muscles) におけるパラメータ
      dpmTheta: { type: "f", value: 0.1 },
      dpmDist: { type: "f", value: 5 },
      dpmSpeed: { type: "f", value: 1.5 },

      pupilRadius: { type: "f", value: 0.1 },
      dpmRadius: { type: "f", value: 0.4 },

      inwardForce: { type: "f", value: 0.5 },
    };
    const mat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: renderParticleVs,
      fragmentShader: renderParticleFs,
      glslVersion: GLSL3,
      transparent: true,
    });

    const points = new Points(particles, mat);
    this.scene = new TScene();
    this.scene.add(points);
  }
  render(renderer: WebGLRenderer, moved: Texture): Texture {
    this.uniforms.dataTex.value = moved;
    renderer.setRenderTarget(this.result);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    return this.result.texture;
  }
}
