import express from 'express';
import * as StellarService from '../services/stellar.js';

const router = express.Router();

router.post('/account/create', async (req, res) => {
  try {
    const account = await StellarService.createAccount();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/account/:publicKey', async (req, res) => {
  try {
    const balance = await StellarService.getBalance(req.params.publicKey);
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payment/send', async (req, res) => {
  try {
    const { sourceSecret, destination, amount, assetCode } = req.body;
    const result = await StellarService.sendPayment(sourceSecret, destination, amount, assetCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/exchange-rate/:from/:to', async (req, res) => {
  try {
    const rate = await StellarService.getExchangeRate(req.params.from, req.params.to);
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
