#include <common>
#include <uv_pars_vertex>

void main() 
{
	#include <uv_vertex>

	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

    gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)  + vec4(position.x * scale.x, position.y * scale.y, 0.0, 0.0));
}