// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function Page() {
  const [trips, setTrips] = useState([
    {
      id: 1,
      driver: "Иванов",
      route: "Душанбе → Хорог",
      start: new Date(2025, 8, 11, 10, 0),
      end: new Date(2025, 8, 11, 14, 0),
      status: "Запланировано",
    },
  ]);

  const [newTrip, setNewTrip] = useState({
    driver: "",
    route: "",
    start: "",
    end: "",
    status: "Запланировано",
  });

  const addTrip = () => {
    if (!newTrip.driver || !newTrip.route || !newTrip.start || !newTrip.end) {
      alert("Заполни все поля!");
      return;
    }
    const trip = {
      ...newTrip,
      id: trips.length + 1,
      start: new Date(newTrip.start),
      end: new Date(newTrip.end),
    };
    setTrips([...trips, trip]);
    setNewTrip({ driver: "", route: "", start: "", end: "", status: "Запланировано" });
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    if (event.status === "В пути") backgroundColor = "orange";
    if (event.status === "Завершено") backgroundColor = "green";
    if (event.status === "Отменено") backgroundColor = "red";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px",
      },
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Планировщик поездок</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Водитель"
          value={newTrip.driver}
          onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
        />
        <input
          type="text"
          placeholder="Маршрут"
          value={newTrip.route}
          onChange={(e) => setNewTrip({ ...newTrip, route: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newTrip.start}
          onChange={(e) => setNewTrip({ ...newTrip, start: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newTrip.end}
          onChange={(e) => setNewTrip({ ...newTrip, end: e.target.value })}
        />
        <button onClick={addTrip}>Добавить поездку</button>
      </div>

      <Calendar
        localizer={localizer}
        events={trips}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          const newStatus = prompt(
            `Выберите новый статус для поездки:\n1 - Запланировано\n2 - В пути\n3 - Завершено\n4 - Отменено`,
            event.status
          );
          if (newStatus) {
            let status = event.status;
            if (newStatus === "1") status = "Запланировано";
            if (newStatus === "2") status = "В пути";
            if (newStatus === "3") status = "Завершено";
            if (newStatus === "4") status = "Отменено";
            setTrips(
              trips.map((t) =>
                t.id === event.id ? { ...t, status } : t
              )
            );
          }
        }}
      />
    </div>
  );
}
