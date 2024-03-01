import { createContext, useState } from "react";
import Auth from "./auth/Auth";
import Admin from "./admin/Admin";
import Keeper from "./keeper/Keeper";

const Datas = createContext(null);

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <div className="App">
      <Datas.Provider value={{ isLogin, setIsLogin, role, setRole }}>
        {isLogin ? (
          <div>{role === "admin" ? <Admin /> : <Keeper />}</div>
        ) : (
          <Auth />
        )}
      </Datas.Provider>
    </div>
  );
}

export { Datas };

export default App;
