import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  
  const navigate = useNavigate();  // Usamos el hook useNavigate para la navegación

  // Leer el token de localStorage cuando el componente se monta
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Llamar al backend si es necesario para validar el token o cargar la info del usuario
      axios
        .get('http://127.0.0.1:8000/usuarios', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((err) => {
          console.error('Error al validar el token', err);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
        username,
        password,
      });

      if (response.data.accesoOk) {
        const token = response.data.token;
        setToken(token);
        setUserData(response.data.usuario);

        // Guardar el token en localStorage
        localStorage.setItem('token', token);

        // Redirigir al usuario a otra página (por ejemplo, el componente 'Dashboard')
        navigate('/dashboard');  // Aquí rediriges a la página de 'Dashboard'
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al realizar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
    // Limpiar el estado de token y userData
    setToken('');
    setUserData(null);
    // Redirigir al login después de cerrar sesión
    navigate('/');
  };

  return (
    <div className='login'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!token ? (
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="username"></label>
            <input
              className="login-input"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password"></label>
            <input
              className="login-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      ) : (
        <div className="logged-in">
          <h3 className="welcome-message">Bienvenido, {userData?.username}</h3>
          <button onClick={handleLogout} className="login-button">Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default Login;
