"use client";
import { useState, useEffect } from "react";

export default function AddEventPage() {
  const [eventDate, setEventDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  // Sync the date portion of start/end time when eventDate changes
  useEffect(() => {
    const [year, month, day] = eventDate.split("-").map(Number);

    const syncDate = (d: Date) => {
      const copy = new Date(d);
      copy.setFullYear(year);
      copy.setMonth(month - 1);
      copy.setDate(day);
      return copy;
    };

    setStartTime(syncDate(startTime));
    setEndTime(syncDate(endTime));
  }, [eventDate]);

  const handleSubmit = async () => {
    const now = new Date();

    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Validate: event date cannot be in the past
    if (eventDateObj < today) {
      return alert(" Event date cannot be in the past.");
    }

    // ✅ Validate: start time cannot be in the past (if today)
    if (eventDateObj.getTime() === today.getTime() && startTime < now) {
      return alert(" Start time cannot be in the past.");
    }

    // ✅ Validate: end time must be after start time
    if (endTime <= startTime) {
      return alert("❌ End time must be after start time.");
    }

    const event_id = 50;
    const user_id = 34;

    const response = await fetch("http://localhost:4000/calendar/addEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id,
        user_id,
        event_date: eventDate,
        start_time: startTime.toTimeString().slice(0, 5), // "HH:MM"
        end_time: endTime.toTimeString().slice(0, 5),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Event submitted!");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Add Event</h1>

      <label>
        Event Date:
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </label>

      <label>
        Start Time:
        <input
          type="time"
          value={startTime.toTimeString().slice(0, 5)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const updated = new Date(startTime);
            updated.setHours(hours);
            updated.setMinutes(minutes);
            setStartTime(updated);
          }}
          required
        />
      </label>

      <label>
        End Time:
        <input
          type="time"
          value={endTime.toTimeString().slice(0, 5)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const updated = new Date(endTime);
            updated.setHours(hours);
            updated.setMinutes(minutes);
            setEndTime(updated);
          }}
          required
        />
      </label>

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </main>
  );
}
