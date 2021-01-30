precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_diffmouse;
uniform vec2 u_meshsize;
uniform vec2 u_texturesize;
uniform float u_textureswitch;
uniform float u_scale_inner;
uniform sampler2D u_texture;
uniform sampler2D u_noise_texture;
varying vec2 vUv;
varying float v_u_diffscroll;

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    vec2 uv = vUv;

    // メッシュとテクスチャ(画像)の解像度を比較して縦横の辺どちらを余らせることでメッシュにフィットするようになるのかを計算する
    vec2 ratio = vec2(
        min((u_meshsize.x / u_meshsize.y) / (u_texturesize.x / u_texturesize.y), 1.0),
        min((u_meshsize.y / u_meshsize.x) / (u_texturesize.y / u_texturesize.x), 1.0)
    );

    uv -= 0.5;
    uv *= ratio;

    uv /= 1. + ( u_scale_inner * 0.125 );
    uv += 0.5;

    vec4 noise_texture = texture2D(u_noise_texture, uv);
    vec2 calcPosition = uv + rotate2d(PI / 1.34) * vec2(noise_texture.r, noise_texture.g) * v_u_diffscroll * 0.014;

    vec4 cDist = texture2D(u_texture, calcPosition);

    gl_FragColor = vec4(cDist);
}