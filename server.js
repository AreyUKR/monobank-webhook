const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Сховище для платежів: { invoiceId: { status, amount } }
const payments = new Map();

// Обробник вебхука від Monobank
app.post('/monobank-webhook', (req, res) => {
    try {
        const { invoiceId, status, amount } = req.body;

        // Зберігаємо статус та суму
        payments.set(invoiceId, { status, amount });
        console.log(`Отримано платіж: ${invoiceId}, ${amount} UAH, статус: ${status}`);

        res.sendStatus(200);
    } catch (error) {
        console.error("Помилка обробки вебхука:", error);
        res.sendStatus(200); // Monobank вимагає 200 OK
    }
});

// Ендпоінт для перевірки статусу
app.get('/payment-status/:invoiceId', (req, res) => {
    const payment = payments.get(req.params.invoiceId) || { status: 'pending' };
    res.json(payment);
});

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));

