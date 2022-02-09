precision highp float;
precision highp int;
in vec3 vNormal;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
layout (location = 1) out vec4 normalColor;
uniform sampler2D tex;
uniform vec3 cameraPos;

void main(){
  fragColor = texture(tex, fragCoord);
  normalColor = vec4((vNormal.xyz-cameraPos)*0.5+0.5, 1);
}
