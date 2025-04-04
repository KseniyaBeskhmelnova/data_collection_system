import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const ChoosePage = () => {
    const navigate = useNavigate();
    const handleAccountChoice = (choice) => {
        if (choice === 'existing') {
            navigate('/login'); 
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2 className="blue-header">У вас уже есть аккаунт?</h2>
                <div className="button-group">
                    <button className="blue-button" onClick={() => handleAccountChoice('existing')}>Да, есть</button>
                    <button className="blue-button" onClick={() => handleAccountChoice('new')}>Нет, нужно зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
};

export default ChoosePage;

