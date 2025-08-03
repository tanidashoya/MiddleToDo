import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Memo from './pages/Memo.jsx'
import Header from './components/Header.jsx'
import './App.css'
import {useContext} from 'react'
import {ThemeContext} from './contexts/ThemeContext.jsx'
import {ThemeProvider} from './contexts/ThemeContext.jsx'


//AppWrapper は、ThemeProvider の中に入れたコンポーネント
//AppWrapper は useContext(ThemeContext) を使うために追加しただけのラッパー。
// AppWrapper の外側で ThemeProvider を使ってるので、内部で theme を参照可能。
// AppWrapper の中に <div className={app ${theme}}> を置けば、全体にクラスが適用され、lightかdarkでCSSの適用を切り替えることができる。
function AppWrapper() {
  //<div className={`app ${theme}`}>でthemeの値に応じてappクラスにlightかdarkが付与される機能を使うために、useContextを使ってthemeを参照している
  const {theme} = useContext(ThemeContext)
  
//returnの中はbodyの中に入る
//ThemeContext はルーティング（ページ遷移）とは無関係に、アプリ全体に共有したい状態なので、BrowserRouter の外に配置する。
  return (
    <div className={`app ${theme}`}>
      <BrowserRouter>
      {/* どのページでもヘッダーを表示 */}
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/memo" element={<Memo/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    )
}

//ThemeProvider が AppWrapper をラップしている構造になっているので、AppWrapper の中で useContext(ThemeContext) を使うことができる
// ThemeProvider の中で ThemeContext.Provider value={{ theme, toggleTheme }} を使って theme を提供している
// この value は、AppWrapper の中で useContext(ThemeContext) を使うことで取得できる
function App() {
  return (
    <ThemeProvider >
      <AppWrapper/>
    </ThemeProvider>
  )
}


export default App


/*
📌 Reactのコンポーネントは、定義の順番ではなく、呼び出されるツリー構造で判断される
📌 ThemeProvider に包まれていれば、その中のどのコンポーネントでも useContext(ThemeContext) は使える
📌 AppWrapper が上に定義されていても、App の中で <ThemeProvider> に包まれていればOK
📌 "Providerの中にあるかどうか" がすべての鍵
*/