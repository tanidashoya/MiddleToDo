import {useContext} from "react";
import ThemeContext from "../contexts/ThemeContext";
import styles from "./ThemeToggleButton.module.css";


// アロー関数でコンポーネントを定義
const ThemeToggleButton = () => {
    const {theme,toggleTheme} = useContext(ThemeContext);

    return(
        <button onClick={toggleTheme} className={`${styles.themeToggleButton} ${theme === "light" ? styles.light : styles.dark}`}>
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    )
}

export default ThemeToggleButton;