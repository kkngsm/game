precision highp float;
precision highp int;
in vec2 fragCoord;
in vec3 vNormal;
layout (location = 0) out vec4 fragColor;
layout (location = 1) out vec4 normalColor;
uniform vec3 cameraPos;
uniform vec3 color;
void main(){
    fragColor = vec4(color.xyz, 1);
    normalColor = vec4((vNormal.xyz-cameraPos)*0.5+0.5, 1);
}