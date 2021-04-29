#version 300 es

precision mediump float;

layout(location = 0) out vec4 color;

in vec2 v_texCoord;
in float v_texIndex;
in vec4 v_color;

uniform sampler2D u_textures[32];

void main() 
{
    vec4 texColor = v_color;
    vec2 coordinate = v_texCoord;

    // have to use switch because WebGL doesn't support dynamic sampler indexing
    switch(int(v_texIndex))
	{
		case 0: texColor *= texture(u_textures[0], coordinate); break;
		case 1: texColor *= texture(u_textures[1], coordinate); break;
		case 2: texColor *= texture(u_textures[2], coordinate); break;
		case 3: texColor *= texture(u_textures[3], coordinate); break;
		case 4: texColor *= texture(u_textures[4], coordinate); break;
		case 5: texColor *= texture(u_textures[5], coordinate); break;
		case 6: texColor *= texture(u_textures[6], coordinate); break;
		case 7: texColor *= texture(u_textures[7], coordinate); break;
		case 8: texColor *= texture(u_textures[8], coordinate); break;
		case 9: texColor *= texture(u_textures[9], coordinate); break;
		case 10: texColor *= texture(u_textures[10], coordinate); break;
		case 11: texColor *= texture(u_textures[11], coordinate); break;
		case 12: texColor *= texture(u_textures[12], coordinate); break;
		case 13: texColor *= texture(u_textures[13], coordinate); break;
		case 14: texColor *= texture(u_textures[14], coordinate); break;
		case 15: texColor *= texture(u_textures[15], coordinate); break;
		case 16: texColor *= texture(u_textures[16], coordinate); break;
		case 17: texColor *= texture(u_textures[17], coordinate); break;
		case 18: texColor *= texture(u_textures[18], coordinate); break;
		case 19: texColor *= texture(u_textures[19], coordinate); break;
		case 20: texColor *= texture(u_textures[20], coordinate); break;
		case 21: texColor *= texture(u_textures[21], coordinate); break;
		case 22: texColor *= texture(u_textures[22], coordinate); break;
		case 23: texColor *= texture(u_textures[23], coordinate); break;
		case 24: texColor *= texture(u_textures[24], coordinate); break;
		case 25: texColor *= texture(u_textures[25], coordinate); break;
		case 26: texColor *= texture(u_textures[26], coordinate); break;
		case 27: texColor *= texture(u_textures[27], coordinate); break;
		case 28: texColor *= texture(u_textures[28], coordinate); break;
		case 29: texColor *= texture(u_textures[29], coordinate); break;
		case 30: texColor *= texture(u_textures[30], coordinate); break;
		case 31: texColor *= texture(u_textures[31], coordinate); break;
	}

    color = texColor;
}
