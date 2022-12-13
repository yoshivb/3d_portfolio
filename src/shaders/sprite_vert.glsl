#include <uv_pars_vertex>

void main() 
{
	#include <uv_vertex>
    gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)  + vec4(position.x, position.y, 0.0, 0.0));
}