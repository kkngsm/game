precision highp float;
in vec2 fragCoord;
layout (location = 0) out vec4 fragColor;
uniform vec2 resolution;
uniform sampler2D previous;

const float FXAA_SPAN_MAX = 8.0;
const float FXAA_REDUCE_MUL = 1.0 / 8.0;
const float FXAA_SUBPIX_SHIFT = 1.0 / 4.0;

vec3 FxaaPixelShader(
    sampler2D tex, // Input texture.
    vec4 posPos, // Output of FxaaVertexShader interpolated accross screen.
    vec2 rcpFrame) // Constant { 1.0 / frameWidth, 1.0 / frameHeight }
{
    #define FXAA_REDUCE_MIN (1.0 / 128.0)
    
    vec3 rgbNW = texture(tex, posPos.zw).xyz;
    vec3 rgbNE = texture(tex, posPos.zw + vec2(rcpFrame.x, 0)).xyz;
    vec3 rgbSW = texture(tex, posPos.zw + vec2(0, rcpFrame.y)).xyz;
    vec3 rgbSE = texture(tex, posPos.zw + vec2(rcpFrame.x, rcpFrame.y)).xyz;
    vec3 rgbM = texture(tex, posPos.xy).xyz;
    
    vec3 luma = vec3(0.299, 0.587, 0.114);
    
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM = dot(rgbM, luma);
    
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
    
    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));
    
    float dirReduce = max(
        (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),
        FXAA_REDUCE_MIN);
    
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
                max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                    dir * rcpDirMin)) * rcpFrame.xy;
    
    vec3 rgbA = (1.0 / 2.0) * (
        texture(tex, posPos.xy + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture(tex, posPos.xy + dir * (2.0 / 3.0 - 0.5)).xyz);
    
    vec3 rgbB = rgbA * (1.0 / 2.0) + (1.0 / 4.0) * (
        texture(tex, posPos.xy + dir * (0.0 / 3.0 - 0.5)).xyz +
        texture(tex, posPos.xy + dir * (3.0 / 3.0 - 0.5)).xyz);
    
    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
    {
        return rgbA;
    }
    else
    {
        return rgbB;
    }
}

void main() {
    vec4 c = vec4(0.0);
    vec2 rcpFrame = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec4 posPos = vec4(fragCoord, fragCoord - rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT));

    fragColor.xyz = FxaaPixelShader(previous, posPos, rcpFrame);
    fragColor.w = 1.;
}