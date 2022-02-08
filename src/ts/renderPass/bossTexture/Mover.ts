import {
  DataTexture,
  FloatType,
  GLSL3,
  Material,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RawShaderMaterial,
  RepeatWrapping,
  RGBAFormat,
  Scene as TScene,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import config from "../../config";
import standerdVs from "../../../glsl/standerd.vert";
import moveParticleFs from "../../../glsl/bossTexture/moveParticle.frag";
export class Mover {
  camera: OrthographicCamera;
  scene: TScene;
  data: WebGLRenderTarget[];
  dataIndex: number;
  uniforms: {
    [uniform: string]: {
      type: string;
      value: any;
    };
  };
  mesh: Mesh;
  constructor() {
    this.camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);

    const { particleNumSqrt } = config.enemy;
    const particleNum = particleNumSqrt * particleNumSqrt;
    const data = [...Array(particleNum)]
      .map(() => {
        const radius = Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        return [
          Math.sin(angle) * radius + 0.5,
          Math.cos(angle) * radius + 0.5,
          Math.random(),
          0,
        ];
      })
      .flat();
    const dataTex = new DataTexture(
      Float32Array.from(data),
      particleNumSqrt,
      particleNumSqrt,
      RGBAFormat,
      FloatType
    );
    dataTex.needsUpdate = true;

    this.uniforms = {
      particleNum: { type: "f", value: particleNumSqrt },
      resolution: { type: "f", value: 1024 },
      time: { type: "f", value: 0 },
      dataTex: { type: "t", value: dataTex },
      drawTex: { type: "t", value: undefined },
    };
    const plane = new PlaneGeometry(1.0, 1.0);
    const mat = new RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: standerdVs,
      fragmentShader: moveParticleFs,
      glslVersion: GLSL3,
    });
    this.mesh = new Mesh(plane, mat);

    this.scene = new TScene();
    this.scene.add(this.mesh);

    // データを保存するテクスチャの設定
    this.data = [];
    this.data.push(
      new WebGLRenderTarget(particleNumSqrt, particleNumSqrt, {
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        wrapS: RepeatWrapping,
        wrapT: RepeatWrapping,
        format: RGBAFormat,
        type: FloatType,
      })
    );
    this.data.push(this.data[0].clone());
    this.dataIndex = 0;
  }
  render(renderer: WebGLRenderer, drew: Texture) {
    this.uniforms.drawTex.value = drew;

    this.dataIndex = (this.dataIndex + 1) % 2;
    renderer.setRenderTarget(this.data[this.dataIndex]);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    this.uniforms.dataTex.value = this.data[this.dataIndex].texture;
    return this.data[this.dataIndex].texture;
  }
}
