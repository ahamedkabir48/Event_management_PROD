// src/pages/EventRegistrationPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api'; // axios.create({ baseURL: 'http://localhost:5000/api' })
import './EventRegistrationPage.css';

export default function EventRegistrationPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // may contain state.event from EventsPage
  const [event, setEvent] = useState(state?.event || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Load event if not passed via state
  useEffect(() => {
    const load = async () => {
      if (event) return;
      try {
        // Prefer a GET /events/:id if available; otherwise fetch all and find
        const res = await api.get('/events/getAll');
        const found = (res.data || []).find((e) => e._id === eventId);
        setEvent(found || null);
      } catch {
        setError('Failed to load event details');
      }
    };
    load();
  }, [event, eventId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/registrations', { eventId });
      navigate('/events', { replace: true, state: { flash: 'Registration completed' } });
    } catch (err) {
      const msg =
        err?.response?.status === 409
          ? 'Already registered'
          : 'Registration failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="ereg">
      <div className="ereg-card">
        <h1>Event registration</h1>

        {!event && !error && <p className="muted">Loading event…</p>}
        {error && <div className="error" role="alert">{error}</div>}

        {event && (
          <form className="ereg-form" onSubmit={onSubmit}>
            <div className="summary">
              <h3>{event.title}</h3>
              <p className="muted">
                {event.location} • {new Date(event.date).toLocaleDateString()} • {event.time}
              </p>
              <p>{event.description}</p>
            </div>

            {/* If you need additional attendee fields, add them here */}

            <button className="submit" type="submit" disabled={busy}>
              {busy ? 'Registering…' : 'Confirm registration'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
