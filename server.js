const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Сховище для збереження статусів платежів
const payments = new Map();

// Обробник вебхука від Monobank
app.post('/monobank-webhook', (req, res) => {
    const { invoiceId, status } = req.body;

    // Зберігаємо статус платежу
    payments.set(invoiceId, status);
    console.log(`Отримано статус для ${invoiceId}: ${status}`);

    res.sendStatus(200);
});

// Ендпоінт для перевірки статусу
app.get('/payment-status/:invoiceId', (req, res) => {
    const status = payments.get(req.params.invoiceId) || 'pending';
    res.json({ status });
});

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));
