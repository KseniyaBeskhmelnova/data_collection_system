# 💡 ЖКХ Портал: Система учёта показаний счётчиков

Веб-приложение для ввода, хранения и просмотра показаний коммунальных счётчиков (вода, электричество, газ) для многоквартирного дома.

---

## Возможности

✔️ Регистрация и авторизация пользователей  
✔️ Удобная форма ввода показаний с группировкой по категориям  
✔️ Поддержка дневного и ночного тарифов на электроэнергию  
✔️ Хранение структуры формы в `data-structure.json`  
✔️ Отправка данных на сервер и их сохранение в SQLite  
✔️ Валидация обязательных полей на сервере  
✔️ Адаптивный и стилизованный интерфейс  

---

## Стек технологий

**Frontend:**

- React
- React Router
- CSS

**Backend:**

- Node.js
- Express

**База данных:**

- SQLite (через модуль `sqlite3`)

---

## Формат JSON-конфигурации

Форма формируется динамически на основе файла data-structure.json. Структура полей включает:

```json
{
  "title": "Введите показания счётчиков",
  "groups": [
    {
      "groupLabel": "Номер квартиры",
      "fields": [
        {
          "name": "apartment",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "groupLabel": "Вода",
      "fields": [
        {
          "name": "waterReading",
          "label": "Показания счётчика",
          "type": "number",
          "required": false
        }
      ]
    },
    {
      "groupLabel": "Электричество",
      "fields": [
        {
          "name": "electricityDayRate",
          "label": "Тариф дневной",
          "type": "number",
          "required": false
        },
        {
          "name": "electricityNightRate",
          "label": "Тариф ночной",
          "type": "number",
          "required": false
        }
      ]
    },
    {
      "groupLabel": "Газ",
      "fields": [
        {
          "name": "gasReading",
          "label": "Показания счётчика",
          "type": "number",
          "required": false
        }
      ]
    }
  ]
}
```

---

## 📦 Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/KseniyaBeskhmelnova/data_collection_system.git  
cd data_collection_system  
```

### 2. Установить зависимости

**Сервер:**

```bash
cd server  
npm install
```

**Клиент:**

```bash
cd ../client  
npm install 
``` 

### 2. Запуск


**Сервер:**

```bash
cd ../server  
node server.js
```

**Клиент:**

```bash
cd ../client  
npm start  
```

