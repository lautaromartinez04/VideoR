import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Login from './components/Login'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Asegúrate de que 'api' esté disponible en el contexto global
    if (window.api) {
      window.api.sendData("¡Hola desde React!");
    } else {
      console.error("API no disponible");
    }
  }, []);

  return (
    <>
      <div className="App">
        <Login />
      </div>
     

    </>
  );
}

export default App;
