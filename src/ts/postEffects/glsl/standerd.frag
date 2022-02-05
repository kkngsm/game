precision highp float;
precision highp int;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
uniform sampler2D color;
void main(){
    vec4 col = texture(color, fragCoord.xy);
    fragColor = vec4(col.xyz, 1);
}