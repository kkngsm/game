precision highp float;
precision highp int;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
uniform sampler2D drawTex;
#define SIZE 10
uniform float weight[SIZE];
uniform bool horizontal;
uniform float resolution;
void main(){
  vec2 texel = 1./vec2(resolution);
  vec2 shift;
  if(horizontal){
    shift = vec2(texel.x, 0);
  }else{
    shift = vec2(0, texel.y);
  }

  vec3 col = vec3(0);
  for(int i = 0; i < SIZE; i++){
    vec2 shifts = shift*float(i);
    col += texture(drawTex, fragCoord.xy+shifts).xyz*weight[i];
    col += texture(drawTex, fragCoord.xy-shifts).xyz*weight[i];
  }
  fragColor.xyz = col;
  fragColor.w = 1.;
}