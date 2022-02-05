import { Color, ColorRepresentation, GLSL3, RawShaderMaterial } from "three";
import fragmentShader from "../../glsl/standerd.frag";
import vertexShader from "../../glsl/standerd.vert";
const createStanderdMaterial = (color: ColorRepresentation) => {
  const uniforms = {
    color: { type: "v3", value: new Color(color) },
  };
  return new RawShaderMaterial({
    uniforms,
    fragmentShader,
    vertexShader,
    glslVersion: GLSL3,
  });
};
export default createStanderdMaterial;
