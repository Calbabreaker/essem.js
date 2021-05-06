#version 300 es

in vec2 a_position;
in vec2 a_texCoord;
in float a_texIndex;
in vec4 a_color;

uniform mat3 u_viewProjection;

out vec2 v_texCoord;
out float v_texIndex;
out vec4 v_color;

void main() 
{
    v_texCoord = a_texCoord;
    v_texIndex = a_texIndex;
    v_color = a_color;

    gl_Position = vec4(u_viewProjection * vec3(a_position, 1.0), 1.0);
}
