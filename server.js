const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Тимчасове сховище в пам'яті
const payments = new Map();

app.post('/monobank-webhook', (req, res) => {
    try {
        const { invoiceId, status, amount, ccy } = req.body;
        
        if (!invoiceId || !status) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        payments.set(invoiceId, { status, amount, ccy, timestamp: new Date() });
        console.log(`Payment updated: ${invoiceId} - ${status}`);
        
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/payment-status/:invoiceId', (req, res) => {
    const payment = payments.get(req.params.invoiceId);
    res.json(payment || { error: 'Not found' });
});

app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));