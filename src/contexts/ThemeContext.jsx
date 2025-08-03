import {createContext,useState} from "react";

//createContextはReactの関数でグローバルな状態の共有を目的として新しい「コンテキスト（情報の入れ物）」を作るために使う
export const ThemeContext = createContext();

//ThemeProviderは、themeとtoggleThemeをグローバルに提供するコンポーネント
//グローバルに提供するとは：「どのコンポーネントからでも使えるように、上の階層で値を渡しておくこと」
//childrenは、ThemeProviderの中に入れたコンポーネントが渡される
export const ThemeProvider = ({children}) => {
    //テーマの初期値をlightに設定
    const [theme,setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark":"light"))
    }

    // returnの意味：「そのコンポーネントが最終的に画面に描画するもの」
    //外側の {}：JSXの中でJavaScriptの式を書くときの記法
    //内側の {}：オブジェクトリテラル
    // return の中＝JSX内
    //childrenに含まれるすべてのコンポーネントに対して、{theme, toggleTheme} という情報をReactのContextを通じて「提供している」
    return (
        // { theme, toggleTheme } ってオブジェクトのキーと値を渡している
        //value={{ theme: theme, toggleTheme: toggleTheme }} って書いても同じ(これの省略記法)
        //<ThemeContext.Provider> は、createContext() を使って作られた Contextオブジェクト の中に入っている「Provider」という特別な構成要素
        //Providerで囲まれたすべての子（children）は、Reactのフック useContext(ThemeContext) を使うことでこの情報にアクセスできる
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;


/*
Provider は・・・
Reactに「これから子どもたちにこの値を渡すよ」と宣言するもの
普通のprops渡し（手渡し）とは違い、階層が深くても一気に共有できる
React内部がこの構文を見て、内部的に「Contextツリー」を構築してくれる

もっと言うと・・・
📌 <ThemeContext.Provider> は createContext() によって作られた特別なReact要素
📌 value={{theme, toggleTheme}} に渡した値を、下の階層すべてのコンポーネントに共有できる
📌 通常の <div> や MyComponent とは異なり、ReactのContext機能に直結した仕組み
📌 useContext(ThemeContext) でこの値を取り出すことができる（受け取り専用）
*/