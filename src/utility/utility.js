export default class Utility {
    // パスを引数にリソースを取得して値を返すメソッド
    static loadResource(　srcPath　) {
        return new Promise( ( resolve, reject ) => {
            fetch( srcPath )
                .then( ( res ) => {
                    return res.text();
                } )
                .then( ( text ) => {
                    // 成功
                    resolve( text );
                } )
                .catch( ( err ) => {
                    // 失敗
                    reject( err );
                } );
        } );
    }

    // lerpの計算結果を返す。
    // lerpはstartとendを線形補間（Linear Interpolatep）すること。結果はstartからendへイージングを伴う動きを作りたいときに使う。
    static lerp( start, end, multiplier ) {
        return (1 - multiplier) * start + multiplier * end;
    }

    // 引数のhtmlエレメントのオフセット値を返す
    static offset( $target ){
        const rect = $target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft
        }
    }
}