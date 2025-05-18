"use client";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Map<Date, boolean>>(new Map());
  const user_id = 34;

  function isSlotBooked(slot: Date): boolean {
    return slots.get(slot) === true;
  }

  function getNextDayDate(targetDay: number): void {
    const today = new Date();
    const todayDay = today.getDay();
    const daysUntilNext = (targetDay - todayDay + 7) % 7 || 7;

    const nextDate = new Date(today);
    if (today.getDay() !== targetDay) {
      nextDate.setDate(today.getDate() + daysUntilNext);
    }

    setCurrentDate(nextDate);
  }

  // Build 15-min slots for the given date
  function generateDailySlots(date: Date): Map<Date, boolean> {
    const newMap = new Map<Date, boolean>();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    for (let hour = 7; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slot = new Date(year, month, day, hour, minute);
        newMap.set(slot, false); // not booked yet
      }
    }

    return newMap;
  }

  // Fetch bookings for the selected day
  useEffect(() => {
    const dateStr = currentDate.toISOString().split("T")[0];

    async function fetchAndMarkBookedSlots() {
      const baseSlots = generateDailySlots(currentDate);
      setSlots(baseSlots); // set first to render unbooked

      try {
        const response = await fetch(
          `http://localhost:4000/calendar/user-events?user_id=${user_id}&date=${dateStr}`
        );

        if (!response.ok) {
          console.error("Failed to fetch events");
          return;
        }

        const events = await response.json();
        const updatedSlots = new Map(baseSlots);

        for (const event of events) {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);

          for (const [slotStart] of updatedSlots) {
            const slotEnd = new Date(slotStart.getTime() + 15 * 60 * 1000);
            if (slotStart < eventEnd && slotEnd > eventStart) {
              updatedSlots.set(slotStart, true); // Mark as booked
            }
          }
        }

        setSlots(updatedSlots);
      } catch (err) {
        console.error("Error fetching user events:", err);
      }
    }

    fetchAndMarkBookedSlots();
  }, [currentDate]);

  const slotArray = Array.from(slots.keys()).sort(
    (a, b) => a.getTime() - b.getTime()
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Available times</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => getNextDayDate(0)}>Sunday</button>
        <button onClick={() => getNextDayDate(1)}>Monday</button>
        <button onClick={() => getNextDayDate(2)}>Tuesday</button>
        <button onClick={() => getNextDayDate(3)}>Wednesday</button>
        <button onClick={() => getNextDayDate(4)}>Thursday</button>
        <button onClick={() => getNextDayDate(5)}>Friday</button>
        <button onClick={() => getNextDayDate(6)}>Saturday</button>
      </div>

      <h2>{currentDate.toDateString()}</h2>

      {slotArray.length === 0 ? (
        <p>Loading slots...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          {slotArray.map((slotTime) => {
            const booked = isSlotBooked(slotTime);
            return (
              <div
                key={slotTime.toISOString()}
                style={{
                  padding: "0.25rem",
                  borderRadius: "4px",
                  textAlign: "center",
                  background: booked ? "#fca5a5" : "#bbf7d0",
                  textDecoration: booked ? "line-through" : "none",
                }}
              >
                {slotTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
