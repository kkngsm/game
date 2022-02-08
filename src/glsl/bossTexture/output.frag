precision highp float;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
uniform sampler2D resultTex;
void main() {
    fragColor = texture(resultTex, fragCoord);
}