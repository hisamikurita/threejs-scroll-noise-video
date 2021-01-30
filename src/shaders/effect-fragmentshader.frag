precision mediump float;
uniform sampler2D tDiffuse;
uniform float u_grayscale;
uniform vec3 color;
uniform vec2 u_diffmouse;
varying vec2 vUv;

void main(){
    vec4 sampleColor = texture2D(tDiffuse, vUv);
    float gray = (sampleColor.r +  sampleColor.g + sampleColor.b) / 3.0;
    vec3 finalColor = mix(vec3(gray), sampleColor.rgb, u_grayscale);
    gl_FragColor = vec4(finalColor, 1.0);
}