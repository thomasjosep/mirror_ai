import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext<any>(null)
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({ email: '', name: '' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
