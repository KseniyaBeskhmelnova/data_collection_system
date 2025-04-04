import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useUser();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const responseData = await response.json(); 
            console.log('Response JSON:', responseData);
            if (response.ok) {
                const userData = responseData;
                if (!userData.userId) {
                    setError('Ошибка: userId отсутствует');
                    return;
                }
                login({ id: userData.userId, username });
                const dataCheckResponse = await fetch(`http://localhost:5000/check-data/${userData.userId}`);
                const dataCheckResult = await dataCheckResponse.json();
                if (dataCheckResponse.ok) {
                    if (dataCheckResult.hasData) {
                        navigate('/data-view');
                    } else {
                        navigate('/data-entry');
                    }
                } else {
                    setError('Ошибка проверки данных');
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Ошибка авторизации');
            }
        } catch (err) {
            console.error('Ошибка при логине:', err);
            setError('Ошибка соединения с сервером');
        }
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2 className="blue-header">Вход</h2>
                <form onSubmit={handleLogin} className="form">
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
                        Войти
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;

