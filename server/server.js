const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Функция обертки для db.get
const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
};

// Функция для обертки db.run
const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' http://localhost:5000;");
    next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// База данных
const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Подключено к SQLite базе данных.');
    }
});

// Обслуживание статичных файлов (например, изображения, CSS и JS файлы)
app.use(express.static('public'));

//Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await getUser(username, password);
        if (existingUser) {
            return res.status(400).send({ message: 'Пользователь уже существует' });
        }
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
            if (err) {
                console.error('Ошибка добавления пользователя:', err);
                return res.status(500).send({ message: 'Ошибка сервера' });
            }
            return res.json({
                userId: this.lastID,
                username: username,
            });
        });
    } catch (err) {
        console.error('Ошибка на сервере:', err);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Вход пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUser(username, password);
        if (user) {
            console.log('User found:', user.id, user.username);
            console.log('User found:', user);
            return res.json({
                userId: user.id,
                username: user.username,
            });
        } else {
            res.status(401).send({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Ошибка на сервере:', err);
        res.status(500).send({ message: 'Server error' });
    }
});

// Обработка ввода данных
app.post('/data-entry', async (req, res) => {
    const { userId, apartment, waterReading, electricityDayRate, electricityNightRate, gasReading } = req.body;
    console.log("Received body:", req.body);
    console.log("UserId:", userId);
    if (!userId) {
        return res.status(400).send({ message: 'Отсутствует userId server' });
    }
    if (!apartment) {
        return res.status(400).send({ message: 'Отсутствует квартира server' });
    }
    try {
        const data = JSON.stringify({
            waterReading,
            electricityDayRate,
            electricityNightRate,
            gasReading,
        });
        console.log("Prepared data:", data);
        const result = await runQuery(
            'INSERT INTO entries (userId, apartment, data) VALUES (?, ?, ?)',
            [userId, apartment, data]
        );
        console.log("Data successfully inserted:", result);
        return res.status(201).send({ message: 'Данные успешно отправлены!' });
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
        res.status(500).send({ message: 'Ошибка сервера при сохранении данных' });
    }
});

// Проверка, вводил ли пользователь показания
app.get('/check-data/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        db.get('SELECT COUNT(*) AS count FROM entries WHERE userId = ?', [userId], (err, row) => {
            if (err) {
                console.error('Ошибка при проверке данных:', err.message);
                return res.status(500).send({ message: 'Ошибка сервера' });
            }
            const hasData = row.count > 0;
            res.status(200).send({ hasData });
        });
    } catch (err) {
        console.error('Ошибка сервера:', err.message);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Просмотр данных
app.get('/data-view', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).send({ message: 'Отсутствует userId' });
    }
    try {
        db.all('SELECT * FROM entries WHERE userId = ?', [userId], (err, rows) => {
            if (err) {
                console.error('Ошибка при получении данных:', err.message);
                return res.status(500).send({ message: 'Ошибка сервера' });
            }
            if (!rows || rows.length === 0) {
                return res.status(200).send([]);
            }
            const formattedRows = rows.map(row => ({
                id: row.id,
                createdAt: row.createdAt, 
                apartment: row.apartment,
                data: JSON.parse(row.data),
            }));
            res.status(200).send(formattedRows);
        });
    } catch (err) {
        console.error('Ошибка на сервере:', err.message);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
