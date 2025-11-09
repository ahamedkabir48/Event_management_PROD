import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import './CreateEventPage.css';

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setBusy(true);
    try {
      const payload = {
        title: form.title,
        date: form.date,           
        time: form.time,           
        location: form.location,
        description: form.description
      };
      await api.post('/events', payload);
      navigate('/events', { replace: true, state: { flash: 'Event created successfully' } });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to create event';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="ce">
      <div className="ce-card">
        <h1>Create event</h1>

        {error && <div className="error" role="alert">{error}</div>}

        <form className="ce-form" onSubmit={onSubmit}>
          <div className="row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </div>

          <div className="grid-2">
            <div className="row">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={onChange}
                required
              />
            </div>
            <div className="row">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={onChange}
              required
            />
          </div>

          <div className="row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={form.description}
              onChange={onChange}
              placeholder="Add details about the event"
            />
          </div>

          <button className="submit" type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Create event'}
          </button>
        </form>
      </div>
    </main>
  );
}
