import Utility from '../utility/utility';

export default class GlElements {
    constructor( targetName ) {
        this.targetName =  targetName || '.js-scroll-el';
        this.optionList = [];
    }

    /**
     * 初期化メソッド
     */
    init() {
        this._initOptionList();
    }

    /**
     * 初期化時のセットメソッド
     */
    _initOptionList(){
        // 対象の要素を取得
        const $targetAll = document.querySelectorAll( this.targetName );

        // 要素のもつ情報を配列に代入
        for( let i = 0; i < $targetAll.length; i ++ ){
            this.optionList[i] = {};
            this.optionList[i].$target = $targetAll[i];
            this.optionList[i].width = $targetAll[i].getBoundingClientRect().width;
            this.optionList[i].height = $targetAll[i].getBoundingClientRect().height;
            this.optionList[i].color = getComputedStyle ($targetAll[i] ).getPropertyValue( "background-color" );
            this.optionList[i].offset = Utility.offset( $targetAll[i] );

            this.optionList[i].$target.style.opacity = 0;
        }
    }

    /**
     * 初期化時、リサイズ時のセットメソッド
     */
    _setOptionList(){
        this.optionList.forEach( item => {
            item.width = item.$target.getBoundingClientRect().width;
            item.height = item.$target.getBoundingClientRect().height;
            item.offset = Utility.offset( item.$target );
        } );
    }

    /**
     * リサイズの度に呼び出すメソッド
     */
    onResize(){
        this._setOptionList();
    }
}