// src/pages/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api'; // axios.create({ baseURL: 'http://localhost:5000/api' })
import './EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Load any flash coming from redirects (e.g., after registration)
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      // Clear flash in history so it doesn't persist on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Fetch events on mount
  useEffect(() => {
    let ignore = false; // avoids setting state after unmount
    const load = async () => {
      try {
        const res = await api.get('/events/getAll');
        if (!ignore) setEvents(res.data || []);
      } catch {
        if (!ignore) setFlash('Failed to load events');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  const goRegister = (ev) => {
    // Navigate to event registration page; pass event in state for instant render
    navigate(`/events/${ev._id}/register`, { state: { event: ev } });
  };

  return (
    <main className="events-page">
      <header className="events-head">
        <h1> Upcoming  events</h1>
      </header>

      {flash && <div className="flash">{flash}</div>}

      {loading ? (
        <p className="muted">Loading events…</p>
      ) : (
        <div className="events-grid">
          {events.map((ev) => (
            <div key={ev._id} className="event-card">
              <div className="event-info">
                <h3>{ev.title}</h3>
                <p className="muted">
                  {ev.location} • {new Date(ev.date).toLocaleDateString()} • {ev.time} 
                </p>
              </div>
              <button
                className="btn primary"
                onClick={() => goRegister(ev)}
              >
                Register
              </button>
            </div>
          ))}
          {events.length === 0 && <p className="muted">No events yet.</p>}
        </div>
      )}
    </main>
  );
}
