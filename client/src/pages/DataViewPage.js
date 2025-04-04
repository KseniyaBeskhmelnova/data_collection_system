import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../styles.css';

const ViewDataPage = () => {
    const { user } = useUser();
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError('Пользователь не авторизован');
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/data-view?userId=${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setEntries(data);
                } else {
                    setError(data.message || 'Ошибка при загрузке данных');
                }
            } catch (err) {
                console.error('Ошибка при запросе данных:', err);
                setError('Ошибка сервера');
            }
        };
        fetchData();
    }, [user]);
    if (!user) {
        return <p>Вы не авторизованы. Пожалуйста, войдите в систему.</p>;
    }
    const handleDataEntry = () => {
        navigate('/data-entry');
    };
    const handleExit = () => {
        navigate('/');
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2 className="blue-header">Ваши записи</h2>
                {/* Сообщение об ошибке */}
                {error && <p className="error-message">{error}</p>}

                {entries.length === 0 ? (
                    <div>
                        <p>Данные отсутствуют.</p>
                        <button className="blue-button" onClick={() => navigate('/data-entry')}>
                            Ввести данные
                        </button>
                        <button className="blue-button" onClick={() => navigate('/')}>
                            Выйти
                        </button>
                    </div>
                ) : (
                    <div>
                        {entries.map((entry) => (
                            <div className="data-card" key={entry.id}>
                                <div className="input-group">
                                    <label className="input-label category-title">Квартира</label>
                                    <div className="input-border">
                                        <p className="input-title">{entry.apartment}</p>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label category-title">Вода</label>
                                    <div className="input-border">
                                        <p className="input-title">Показания счётчика: {entry.data.waterReading}</p>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label category-title">Электричество</label>
                                    <div className="input-row">
                                        <div className="input-border">
                                            <p className="input-title">Тариф дневной: {entry.data.electricityDayRate}</p>
                                        </div>
                                        <div className="input-border">
                                            <p className="input-title">Тариф ночной: {entry.data.electricityNightRate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label category-title">Газ</label>
                                    <div className="input-border">
                                        <p className="input-title">Показания счётчика: {entry.data.gasReading}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewDataPage;

