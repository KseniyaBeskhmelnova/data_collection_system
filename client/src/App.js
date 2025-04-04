import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './pages/UserContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DataEntryPage from './pages/DataEntryPage';
import DataViewPage from './pages/DataViewPage';
import ChoosePage from './pages/choosePage';

function App () {
    return (
        <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<ChoosePage />} />  {/* Первая страница */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/data-entry" element={<DataEntryPage />} />
                <Route path="/data-view" element={<DataViewPage />} />
            </Routes>
            </Router>
            </UserProvider>
    );
};

export default App;
