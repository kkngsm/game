uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
in vec2 uv;
in vec3 position;
in vec3 normal;
out vec2 fragCoord;
out vec3 oNormal;
void main()
{
    fragCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    oNormal = normal;
}