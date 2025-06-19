import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface UserContextType {
  profilePhoto: string;
  setProfilePhoto: Dispatch<SetStateAction<string>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("profilePhoto") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  return (
    <UserContext.Provider value={{ profilePhoto, setProfilePhoto, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
