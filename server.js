const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Обмеження розміру тіла запиту
app.use(bodyParser.json({ limit: '10kb' }));

// Логування всіх запитів
app.use((req, res, next) => {
    console.log(`Запит: ${req.method} ${req.url}`);
    next();
});

// Обробник вебхука
app.post('/monobank-webhook', (req, res) => {
    try {
        const { invoiceId, status } = req.body;
        
        if (!invoiceId || !status) {
            console.log("Некоректний запит:", req.body);
            return res.status(400).json({ error: "Необхідні поля: invoiceId, status" });
        }

        console.log(`Отримано статус для ${invoiceId}: ${status}`);
        res.sendStatus(200);

    } catch (error) {
        console.error("Помилка обробки вебхука:", error);
        res.sendStatus(200); // Monobank вимагає 200 OK
    }
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
    console.error("Глобальна помилка:", err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
});

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Сервер працює на порті ${PORT}`));
// Ендпоінт для перевірки статусу
app.get('/payment-status/:invoiceId', (req, res) => {
    const status = payments.get(req.params.invoiceId) || 'pending';
    res.json({ status });
});

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
