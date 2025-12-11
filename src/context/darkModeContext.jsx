import { createContext, useEffect, useState } from "react";

export const darkModeContext = createContext();

export default function DarkModeContextProvider(props) {
    const [darkMode, setDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem("darkMode");
            if (saved !== null) {
                return JSON.parse(saved) === true;
            }
        } catch (error) {
            console.error("Error reading darkMode from localStorage:", error);
        }
        return false;
    });
    useEffect(() => {
        const root = document.documentElement;

        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        try {
            localStorage.setItem("darkMode", JSON.stringify(darkMode));
        } catch (error) {
            console.error("Error saving darkMode to localStorage:", error);
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            console.log("Toggling dark mode to:", newValue);
            return newValue;
        });
    };

    return (
        <darkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
            {props.children}
        </darkModeContext.Provider>
    );
}

