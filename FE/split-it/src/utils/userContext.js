import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext(undefined);

// Create the provider component
export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{userId, setUserId}}>
            { children }
        </UserContext.Provider>
    );
};