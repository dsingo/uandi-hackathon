import React, { useState, useMemo } from 'react';

const UserContext = React.createContext();

export default UserContext;

export const UserContextWrapper = ({ children }) => {
    const [user, setUser] = useState({
        phonenumber: '',
        nickname:'',
        profilelink:'',
        bio:'',
        questions: [
            '',
            '',
            ''
        ],
        loading: false
    });
    const contextValue = useMemo(() => {
        return { user, setUser }
    }, [user, setUser]);

    return (
        <UserContext.Provider value={contextValue} >
            { children }
        </UserContext.Provider>
    )
};