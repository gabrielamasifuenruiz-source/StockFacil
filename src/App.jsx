import { useState } from "react";
import Login from "./pages/Login";
import Layout from "./pages/Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <Layout />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;