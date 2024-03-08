import { createContext, useState } from "react";
import Admin from "./admin/Admin";
import Keeper from "./keeper/Keeper";
import Signin from "./auth/SIgnin";

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
          <Signin />
        )}
      </Datas.Provider>
    </div>
  );
}

export { Datas };

export default App;
