attribute vec3 position;
attribute vec2 uv;
uniform float u_scale_outer;
uniform float u_diffscroll;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
varying float v_u_diffscroll;

const float PI = 3.1415926535897932384626433832795;

void main() {
    vUv = uv;
    v_u_diffscroll = u_diffscroll;

    vec3 pos = position;
    vec2 uvCurve = uv;

    float x = 0.0;
    float y = sin( uvCurve.x * PI )  * u_diffscroll;
    float z = 0.0;

    if(u_diffscroll > 0.0){
        z = cos( uvCurve.y )  * u_diffscroll * -30.0;
    }
    else{
        z = cos( uvCurve.y - 1.0)  * u_diffscroll * 30.0;
    }

    vec3 curve = vec3(
        x,
        y,
        z
    );
    pos += curve * 0.003;

    pos /= 1. + u_scale_outer * 0.075;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}