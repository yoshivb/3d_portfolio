#include <common>
#include <uv_pars_fragment>

void main() {
	vec3 diffuseColor = vec3( 1.0, 0.0, 0.0 );

	vec2 centerUv = (vUv - vec2(0.5)) * vec2(2.0);

	float value = length(centerUv);

	float finalValue = value < 0.7 ? 0.9 : 0.0;
	diffuseColor = vec3(finalValue);

	gl_FragColor = vec4( diffuseColor, value <= 1.0 ? 1.0 : 0.0);
}   