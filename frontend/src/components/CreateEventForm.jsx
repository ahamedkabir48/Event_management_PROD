import React, { useState } from 'react';
import axios from 'axios';

function CreateEventForm() {
  const [form, setForm] = useState({ title: '', location: '', date: '', remind: false });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/events/add', form);
    alert('Event created!');
    setForm({ title: '', location: '', date: '', remind: false });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="remind" checked={form.remind} onChange={handleChange} />
        Remind
      </label>
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEventForm;
