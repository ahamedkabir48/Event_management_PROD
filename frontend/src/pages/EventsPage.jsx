import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  // Handle flash messages
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await api.get('/events/getAll');
        setEvents(res.data || []);
      } catch {
        setFlash('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Register for event
  const handleRegister = async (eventId) => {
    try {
      await api.post('/registrations', { eventId });
      setFlash('✅ Registered successfully!');
    } catch (err) {
      if (err.response?.status === 409) {
        setFlash('⚠️ Already registered for this event.');
      } else {
        setFlash('❌ Failed to register.');
      }
    }
  };

  // Fetch registrations for creator
  const handleViewRegistrations = async (event) => {
    try {
      setSelectedEvent(event);
      const res = await api.get(`/registrations/${event._id}`);
      setRegistrations(res.data.users || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      alert('Failed to load registrations');
    }
  };

  return (
    <main className="events-page">
      <header className="events-head">
        <h1>Upcoming Events</h1>
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
                <p >
                  <strong>Description: </strong>{ev.description} 
                  </p>
                  <p>
                  <strong>Location: </strong> {ev.location} 
                  </p>
                  <p>
                  <strong>Date & Time: </strong> {new Date(ev.date).toLocaleDateString()} • {ev.time}
                </p>
                  <strong>Created By:</strong> {ev.createdBy?.username || 'Unknown'}
                </p>
                <p><strong>Total Registrations Count:</strong> {ev.registrationCount || 0}</p>
              </div>

              {ev.createdBy?.username === username ? (
                <button
                  className="btn primary"
                  onClick={() => handleViewRegistrations(ev)}
                >
                  View Participants
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => handleRegister(ev._id)}
                >
                  Register
                </button>
              )}
            </div>
          ))}

          {events.length === 0 && <p className="muted">No events yet.</p>}
        </div>
      )}

      {/* Modal for showing registrations */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent?.title} — Registrations</h2>
            <p>Total: {registrations.length}</p>

            <ul>
              {registrations.map((u) => (
                <li key={u.email}>
                  <strong>{u.username}</strong> — {u.email}
                </li>
              ))}
            </ul>

            <button
              className="btn close"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
