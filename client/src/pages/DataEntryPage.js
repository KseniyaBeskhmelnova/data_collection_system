import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import '../styles.css';

const DataEntryPage = () => {
    const [apartment, setApartment] = useState('');
    const [waterReading, setWaterReading] = useState('');
    const [electricityDayRate, setElectricityDayRate] = useState('');
    const [electricityNightRate, setElectricityNightRate] = useState('');
    const [gasReading, setGasReading] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useUser();
    const handleDataSubmit = async () => {
        if (!user) {
            setError('Пользователь не авторизован');
            return;
        }
        if (!apartment) {
            setError('Введите номер квартиры');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/data-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    apartment,
                    waterReading: parseFloat(waterReading),
                    electricityDayRate: parseFloat(electricityDayRate),
                    electricityNightRate: parseFloat(electricityNightRate),
                    gasReading: parseFloat(gasReading),
                }),
            });
            if (response.ok) {
                navigate('/data-view');
            } else {
                const responseData = await response.json();
                setError(responseData.message);
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            setError('Ошибка сервера');
        }
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2 className="blue-header">Введите показания счётчиков</h2>
                {/* Номер квартиры */}
                <div className="input-group">
                    <label className="input-label category-title">Номер квартиры:</label>
                    <input
                        type="text"
                        className="input-field narrow-input"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                    />
                </div>
                {/* Вода */}
                <div className="input-group">
                    <label className="input-label category-title">Вода</label>
                    <div className="input-border">
                        <p className="input-title">Показания счётчика</p>
                        <input
                            type="number"
                            className="input-field narrow-input"
                            value={waterReading}
                            onChange={(e) => setWaterReading(e.target.value)}
                        />
                    </div>
                </div>
                {/* Электричество */}
                <div className="input-group">
                    <label className="input-label category-title">Электричество</label>
                    <div className="input-row">
                        <div className="input-border">
                            <p className="input-title">Тариф дневной</p>
                            <input
                                type="number"
                                className="input-field narrow-input"
                                value={electricityDayRate}
                                onChange={(e) => setElectricityDayRate(e.target.value)}
                            />
                        </div>
                        <div className="input-border">
                            <p className="input-title">Тариф ночной</p>
                            <input
                                type="number"
                                className="input-field narrow-input"
                                value={electricityNightRate}
                                onChange={(e) => setElectricityNightRate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {/* Газ */}
                <div className="input-group">
                    <label className="input-label category-title">Газ</label>
                    <div className="input-border">
                        <p className="input-title">Показания счётчика</p>
                        <input
                            type="number"
                            className="input-field narrow-input"
                            value={gasReading}
                            onChange={(e) => setGasReading(e.target.value)}
                        />
                    </div>
                </div>
                {/* Сообщение об ошибке */}
                {error && <p className="error-message">{error}</p>}
                {/* Кнопка отправки */}
                <button className="submit-button" onClick={handleDataSubmit}>
                    Отправить данные
                </button>
            </div>
        </div>
    );
};

export default DataEntryPage;

