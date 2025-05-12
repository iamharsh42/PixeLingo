import { createContext, useState } from "react";

export const AppContext = createContext()

const AppContextProvider=(props)=>{
      const [user, setUser] = useState(null);//for login in log out, true so that the right side disappears

      const value = {
        user,setUser
      }
      return(
        <AppContext.Provider value={value}>
        {props.children}
    

    </AppContext.Provider>
      )
}

export default AppContextProvider