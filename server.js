const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/health', (req, res) => res.sendStatus(200));

// Тимчасове сховище в пам'яті
const payments = new Map();

// Приклад коду для Node.js (server.js)
app.post('/monobank-webhook', (req, res) => {
    const { invoiceId, status } = req.body;

    if (status === "success") {
        let signal = "";
        switch (invoiceId) {
            case "bja-Qj0Koc37":
                signal = "O";
                break;
            case "jxL_0qImuiJu":
                signal = "D";
                break;
            case "ntiiXsomKr-U":
                signal = "T";
                break;
            default:
                console.log("Невідомий invoiceId:", invoiceId);
        }

        if (signal) {
            console.log(`[Лог] Сигнал ${signal} для invoiceId: ${invoiceId}`);
        }
    }

    res.sendStatus(200);
});

app.get('/payment-status/:invoiceId', (req, res) => {
    const payment = payments.get(req.params.invoiceId);
    res.json(payment || { error: 'Not found' });
});

app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
