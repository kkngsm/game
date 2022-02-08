import { GLSL3, RawShaderMaterial, SphereGeometry, WebGLRenderer } from "three";
import config from "../../config";
import standerdVs from "../../../glsl/standerd.vert";
import texFs from "../../../glsl/tex.frag";

import createStanderdMaterial from "../../materials/StanderdMaterial";
import { BossTexture } from "../../renderPass/bossTexture/BossTexture";
import GameObject from "../GameObject";

export default class Enemy extends GameObject {
  radius: number;
  texture: BossTexture;
  uniforms: any;
  constructor() {
    const uniforms = { tex: { type: "t", value: undefined } };
    const tex = new BossTexture();
    const box = new SphereGeometry(config.enemy.radius, 32, 16);
    const mat = new RawShaderMaterial({
      uniforms: uniforms,
      vertexShader: standerdVs,
      fragmentShader: texFs,
      glslVersion: GLSL3,
    });
    super(box, mat);
    this.texture = tex;
    this.uniforms = uniforms;
    this.radius = config.enemy.radius;
    this.mesh.position.set(20, 0, 0);
  }
  update(time: number) {
    this.mesh.position.set(20, Math.sin(time * 0.001) * 10, 0);
  }
  render(renderer: WebGLRenderer) {
    this.uniforms.tex.value = this.texture.render(renderer);
  }
}
