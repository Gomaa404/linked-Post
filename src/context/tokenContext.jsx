import { createContext, useEffect, useState } from "react";
import { getLoggedUser } from "../Api/Auth/loggedUser.api";


export const tokenContext = createContext();


export default function TokenContextProvider(props) {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    
    async function getUserData() {
        try {
            const res = await getLoggedUser();
            console.log(res);
            setUserData(res.user);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUserData(null);
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Fetch user data whenever token changes
    useEffect(() => {
        if (token) {
            getUserData();
        } else {
            setUserData(null);
        }
    }, [token]);

    return <tokenContext.Provider value={{ token, setToken, userData, setUserData }}>
        {props.children}
    </tokenContext.Provider>;
}