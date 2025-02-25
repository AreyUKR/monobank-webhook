const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Сховище для платежів: { invoiceId: { amount, status } }
const payments = new Map();

// Обробник вебхука від Monobank
app.post('/monobank-webhook', (req, res) => {
    try {
        const { invoiceId, status, amount } = req.body;
        payments.set(invoiceId, { amount, status });
        console.log(`Отримано платіж: ${invoiceId}, ${amount} копійок, статус: ${status}`);
        res.sendStatus(200);
    } catch (error) {
        console.error("Помилка обробки вебхука:", error);
        res.sendStatus(200);
    }
});

// Ендпоінт для отримання одного платежу та його видалення
app.get('/payment', (req, res) => {
    if (payments.size === 0) {
        return res.status(404).json({ message: 'Немає нових платежів' });
    }

    const [invoiceId, data] = payments.entries().next().value;
    payments.delete(invoiceId);

    res.json({
        invoiceId,
        amount: data.amount,
        status: data.status
    });
});

// Health check
app.get('/health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порті ${PORT}`));

