require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // your React dev URL
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/bookings', async (req, res) => {
  const body = req.body;

  // 1. Save to DB
  const { error } = await supabase.from('bookings').insert([body]);
  if (error) return res.status(500).json({ error: error.message });

  // 2. Confirmation email to customer
  await resend.emails.send({
    from: 'Vedic Saar <bookings@vediksaar.com>',
    to: body.email,
    subject: '✦ Your Consultation is Confirmed',
    html: `<p>Dear ${body.name}, your ${body.service} on ${body.preferred_date} at ${body.time_slot} is confirmed. We'll reach out within 24 hours.</p>`,
  });

  // 3. Alert email to owner
  await resend.emails.send({
    from: 'Bookings <bookings@vediksaar.com>',
    to: process.env.OWNER_EMAIL,
    subject: `New Booking: ${body.service} — ${body.name}`,
    html: `<p>${body.name} | ${body.phone} | ${body.service} | ${body.preferred_date} at ${body.time_slot}</p>`,
  });

  res.json({ success: true });
});

app.listen(4000, () => console.log('Backend running on port 4000'));