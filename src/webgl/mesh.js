import vertexShader from '../shaders/vertexshader.vert';
import fragmentShader from '../shaders/fragmentshader.frag';
import effectVertexShader from '../shaders/effect-vertexshader.vert';
import effectFragmentShader from '../shaders/effect-fragmentshader.frag';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export default class Mesh {
    constructor(stage, elementOption) {

        // スクリーンサイズに下記のサイズを乗算したサイズがスクリーンに描画されるMeshのサイズとなる
        this.meshWindowSizeRatio = { x: 1.0, y: 1.0 };

        // ジオメトリー生成用のパラメータ
        this.geometryParm = {
            width: 1.0, // ジオメトリ生成後、リサイズによるmeshのサイズ変更を見越して、1で固定、サイズの変更はmeshのscaleプロパティを変更して行う
            height: 1.0, // ジオメトリ生成後、リサイズによるmeshのサイズ変更を見越して、1で固定、サイズの変更はmeshのscaleプロパティを変更して行う
            widthSegments: 32.0, // 板ポリゴン内のセルの数（X軸）
            heightSegments: 32.0 // 板ポリゴン内のセルの数（Y軸）
        };

        // マテリアル生成用のパラメータ
        this.materialParam = {
            useWireframe: false,
        };

        this.path = "https://hisamikurita.github.io/threejs-scroll-noise/dist/images/noise03.jpg";

        // マテリアル（シェーダの中）で使用するユニフォーム変数
        this.uniforms = {
            u_time: { type: "f", value: 0.0 },
            u_angle: { type: "f", value: 0.0 },
            u_mouse: { type: "v2", value: { x: 0, y: 0 } },
            u_diffmouse: { type: "v2", value: { x: 0, y: 0 } },
            u_diffscroll: { type: "f", value: 0 },
            u_texture: { type: "t", value: new THREE.VideoTexture(elementOption.$target) },
            u_noise_texture: { type: "t", value: new THREE.TextureLoader().load(this.path) },
            u_meshsize: { type: "v2", value: { x: elementOption.width, y: elementOption.height } },
            u_texturesize: { type: "v2", value: { x: 1024, y: 512 } },
            u_scale_inner: { type: "f", value: 0.0 },
            u_scale_outer: { type: "f", value: 0.0 },
        };

        this.stage = stage;

        this.mesh = null; // mesh

        // スクリーンサイズ
        this.windowWidth = 0;
        this.windowHeight = 0;

        // スクリーンサイズの半分
        this.windowWidthHalf = 0;
        this.windowHeightHalf = 0;

        // メッシュサイズの半分（今回は、たまたまスクリーンサイズと同じなので同様の値になる）
        this.meshWidthHalf = 0;
        this.meshHeightHalf = 0;

        this.elementOption = elementOption;
    }

    init() {
        this._setWindowSize();
        this._setMesh();
        this._setMeshScale();
        // this._setPostEffect();
        this._setGui();
    }

    _setWindowSize() {
        // スクリーンサイズ
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        // スクリーンサイズの半分
        this.windowWidthHalf = this.windowWidth * 0.5;
        this.windowHeightHalf = this.windowHeight * 0.5;
    }

    _setMesh() {
        // ジオメトリーを生成
        const geometry = new THREE.PlaneBufferGeometry(
            this.geometryParm.width,
            this.geometryParm.height,
            this.geometryParm.widthSegments,
            this.geometryParm.heightSegments
        );

        // マテリアルを生成
        const material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: this.materialParam.useWireframe,
            transparent: true,
            uniforms: this.uniforms
        });

        this.mesh = new THREE.Mesh(geometry, material);

        this.stage.scene.add(this.mesh);
    }

    _setPostEffect() {
        this.effectUniforms = {
            tDiffuse: { value: null },
            u_grayscale: { type: "f", value: 0.0 },
            u_diffmouse: { type: "v2", value: { x: 0, y: 0 } },
        };

        this.composer = new EffectComposer(this.stage.renderer);
        this.composer.addPass(new RenderPass(this.stage.scene, this.stage.camera));

        this.customPass = new ShaderPass({
            vertexShader: effectVertexShader,
            fragmentShader: effectFragmentShader,
            uniforms: this.effectUniforms,
        });

        this.customPass.renderToScreen = true;
        this.composer.addPass(this.customPass);
    }

    _setMeshScale() {
        this.mesh.scale.x = this.elementOption.width;
        this.mesh.scale.y = this.elementOption.height;

        this.uniforms.u_meshsize.value.x = this.mesh.scale.x;
        this.uniforms.u_meshsize.value.y = this.mesh.scale.y;

        this.meshWidthHalf = this.mesh.scale.x * 0.5;
        this.meshHeightHalf = this.mesh.scale.y * 0.5;
    }

    _setMeshPosition(scrollTop) {
        // ポジションを計算して、three.jsのobject3d classがもつpositionプロパティでメッシュの座標を変更する
        this.mesh.position.y = this.windowHeightHalf - this.meshHeightHalf - this.elementOption.offset.top + scrollTop;
        this.mesh.position.x = -this.windowWidthHalf + this.meshWidthHalf + this.elementOption.offset.left;
    }

    _setGui() {
        // const parameter = {
        //     angle: this.uniforms.u_angle.value,
        // };
        // const gui = new dat.GUI();
        // gui.add(parameter, 'angle', 0.0, 10.0, 0.1).name('angle').onChange((value) => {
        //     this.uniforms.u_angle.value = value;
        // });
    }

    onResize() {
        this._setWindowSize(); // windowのサイズをセット
        this._setMeshScale(); // meshのサイズをセット
    }

    onMouseEnter() {
        // gsap.to( this.customPass.material.uniforms.u_grayscale,{
        //     duration: 1.0,
        //     value: 1.0,
        //     ease: "cubic.out"
        // } );

        gsap.to(this.uniforms.u_scale_inner, {
            duration: 0.50,
            ease: "cubic.out",
            value: 1,
        });

        gsap.to(this.uniforms.u_scale_outer, {
            duration: 0.50,
            value: 1,
            ease: "cubic.out"
        });
    }

    onMouseLeave() {
        // gsap.to( this.customPass.material.uniforms.u_grayscale,{
        //     duration: 1.0,
        //     value: 0.0,
        //     ease: "cubic.out"
        // } );

        gsap.to(this.uniforms.u_scale_inner, {
            duration: 0.50,
            ease: "cubic.inOut",
            value: 0
        });

        gsap.to(this.uniforms.u_scale_outer, {
            duration: 0.50,
            ease: "cubic.inOut",
            value: 0
        });
    }

    _render() {
        this.uniforms.u_time.value += 0.005;
        // this.composer.render();
    }

    onRaf(scrollTop, scrollTopDiff) {
        if (this.mesh) {
            this._setMeshPosition(scrollTop);
        }
        this.uniforms.u_diffscroll.value = scrollTopDiff;
        this._render();
    }
}