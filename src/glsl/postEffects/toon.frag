precision highp float;
precision highp int;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
uniform sampler2D albedo;
uniform sampler2D normal;

vec3 getNormal(){
    vec4 n = texture(normal, fragCoord.xy);
    return normalize((n.xyz*2.-1.)*n.w) ;
}
float ranp(
        float x,
        float values[3], float edges[2]
    ){
    float edge_width = 0.1;
    float result = values[0];
    for(int i = 0; i<3; i++){
        result = mix(result, values[i+1], smoothstep(edges[i], edges[i]+0.1, x));
    }
    return result;
}

void main(){
    vec3 lightPos = vec3(1);
    vec3 n = getNormal();
    vec3 col = texture(albedo, fragCoord.xy).xyz;
    float f = dot(n, lightPos);
    f = ranp(f, 
        float[](0.5, 0.8, 1.),
        float[](-0.2,0.9));
    fragColor = vec4(vec3(f*col), 1);
}