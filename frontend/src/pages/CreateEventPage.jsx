// src/pages/CreateEventPage.jsx
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './CreateEventPage.css';

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/events', form); // ✅ token auto-attached
      navigate('/events');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Event creation failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="create-event">
      <div className="event-card">
        <h1>Create Event</h1>

        {error && <div className="error">{error}</div>}

        <form className="event-form" onSubmit={onSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
          <input name="date" type="date" value={form.date} onChange={onChange} required />
          <input name="time" type="time" value={form.time} onChange={onChange} required />
          <input name="location" placeholder="Location" value={form.location} onChange={onChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} />
          <button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Create'}
          </button>
        </form>
      </div>
    </main>
  );
}
