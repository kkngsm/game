precision highp float;
precision highp int;
in vec2 fragCoord;
in vec3 vNormal;
layout (location = 0) out vec4 fragColor;
layout (location = 1) out vec4 normalColor;
uniform vec3 cameraPos;
uniform sampler2D tex;
void main(){
    vec2 uv = normalize( vNormal ).xy * 0.5 + 0.5;
    uv = (uv-0.5)*2. +0.5;
    fragColor = texture( tex, uv );
    normalColor = vec4((vNormal.xyz-cameraPos)*0.5+0.5, 1);
}