import Utility from './utility/utility';
import Stage from './webgl/stage';
import Mesh from './webgl/mesh';
import GlElements from './webgl/glElements';
import MomentumScroll from './momentum-scroll';

(() => {
    let scrollTop = 0;
    let scrollTopPrev = 0;
    let scrollTopDiff = 0;

    window.addEventListener('load',()=>{
        new MomentumScroll('#container');
    });

    const stage = new Stage();
    stage.init();

    const meshArray = [];

    const glElements = new GlElements();
    glElements.init();

    glElements.optionList.forEach((item, i) => {
        meshArray[i] = new Mesh(stage, item);
        meshArray[i].init();
    });

    for (let i = 0; i < glElements.optionList.length; i++) {
        glElements.optionList[i].$target.addEventListener('mouseenter', () => {
            meshArray[i].onMouseEnter();
        });
    }

    for (let i = 0; i < glElements.optionList.length; i++) {
        glElements.optionList[i].$target.addEventListener('mouseleave', () => {
            meshArray[i].onMouseLeave();
        });
    }

    window.addEventListener('resize', () => {
        stage.onResize();
        glElements.onResize();
        for (let i = 0; i < glElements.optionList.length; i++) {
            meshArray[i].onResize();
        }
    });

    const _raf = () => {
        window.requestAnimationFrame(() => {
            stage.onRaf();

            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            scrollTopDiff = Utility.lerp(scrollTopDiff, (scrollTop - scrollTopPrev), 0.1);

            for (let i = 0; i < glElements.optionList.length; i++) {
                meshArray[i].onRaf(scrollTop, scrollTopDiff);
            }

            scrollTopPrev = scrollTop;

            _raf();
        });
    }

    _raf();
})();
