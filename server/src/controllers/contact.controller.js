import { Resend } from 'resend';
import { Message } from '../models/message.models.js';
import asyncHandler from '../utils/asyncHandler.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const clean = (value) => (typeof value === 'string' ? value.trim() : '');
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
const logSkipped = (step) => (err) => {
  console.warn(`[contact] ${step} skipped: ${err.message}`);
  return null;
};

const validate = ({ name, email, message }) => {
  const errors = {};
  if (name.length < 2 || name.length > 80 || CONTROL_CHARS.test(name)) {
    errors.name = 'Name must be 2–80 characters.';
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (message.length < 10 || message.length > 2000) {
    errors.message = 'Message must be 10–2000 characters.';
  }
  return errors;
};

const buildEmail = ({ name, email, message }) => ({
  from: process.env.CONTACT_FROM_EMAIL,
  to: process.env.CONTACT_TO_EMAIL,
  replyTo: email,
  subject: `Portfolio contact from ${name}`,
  text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
});

export const sendContact = asyncHandler(async (req, res) => {
  const body = req.body ?? {};

  if (clean(body.company)) {
    return res.status(200).json({ ok: true });
  }

  const input = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    message: clean(body.message),
  };

  const errors = validate(input);
  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }

  const record = await Message.create(input).catch(logSkipped('Save'));

  const { error } = await resend.emails.send(buildEmail(input));

  if (record) {
    await Message.updateOne({ _id: record._id }, { status: error ? 'failed' : 'sent' }).catch(
      logSkipped('Status update'),
    );
  }

  if (error) {
    console.error('[contact] Resend error:', error);
    throw Object.assign(new Error('Email delivery failed. Please try again later.'), {
      statusCode: 502,
      expose: true,
    });
  }

  return res.status(200).json({ ok: true });
});
