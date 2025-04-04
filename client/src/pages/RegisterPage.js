import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../styles.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login({ id: data.userId, username });
                navigate('/data-entry');
            } else {
                setError(data.message || 'Ошибка регистрации');
            }
        } catch {
            setError('Ошибка сервера');
        }
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2 className="blue-header">Регистрация</h2>
                <form onSubmit={handleRegister} className="form">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field narrow-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field narrow-input"
                        required
                    />
                    <button className="blue-button" type="submit">
                        Зарегистрироваться
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterPage;


