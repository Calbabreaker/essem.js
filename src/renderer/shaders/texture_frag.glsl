#version 300 es

precision mediump float;

layout(location = 0) out vec4 color;

//in vec2 v_texCoord;
//in vec4 v_color;
//in float v_texIndex;
//in float v_tilingFactor;

//uniform sampler2D u_textures[32];

void main() 
{
    //color = texture(u_textures[int(v_texIndex)], v_texCoord * v_tilingFactor) * v_color;
    color = vec4(0.0, 1.0, 1.0, 1.0);
}
