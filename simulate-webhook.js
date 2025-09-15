const crypto = require('crypto');
const axios = require('axios');

const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_test_secret';

// Fake Razorpay event
const payload = JSON.stringify({
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_test123',
        amount: 50000,
        currency: 'INR',
      },
    },
  },
});

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

// Send to your backend
axios
  .post('http://localhost:3000/payments/webhook', payload, {
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
    },
  })
  .then((res) => console.log(res.data))
  .catch((err) => {
  if (err.response) {
    console.error("Error response:", err.response.data);
  } else {
    console.error("Error:", err.message);
  }
});
