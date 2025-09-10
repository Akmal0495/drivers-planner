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

    setTrips([
      ...trips,
      {
        ...newTrip,
        id: trips.length + 1,
        start: new Date(newTrip.start),
        end: new Date(newTrip.end),
      },
    ]);

    setNewTrip({ driver: "", route: "", start: "", end: "", status: "Запланировано" });
  };

  // 🎨 Цвета для статусов
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#888"; // по умолчанию серый
    if (event.status === "В пути") backgroundColor = "#0070f3";
    if (event.status === "Завершено") backgroundColor = "#21ba45";
    if (event.status === "Отменено") backgroundColor = "#db2828";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "white",
        padding: "2px 5px",
      },
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>🚗 Планировщик поездок водителей</h1>

      {/* Календарь */}
      <Calendar
  localizer={localizer}
  events={trips.map((trip) => ({
    ...trip,
    title: `${trip.driver} — ${trip.route} [${trip.status}]`,
  }))}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, marginTop: 20 }}
  defaultView="week"
  views={["month", "week", "day"]}
  eventPropGetter={eventStyleGetter}
  onSelectEvent={(event) => {
    const newStatus = prompt(
      `Выберите новый статус для поездки:\n1 - Запланировано\n2 - В пути\n3 - Завершено\n4 - Отменено`,
      event.status
    );

    if (newStatus) {
      let statusText = event.status;
      if (newStatus === "1") statusText = "Запланировано";
      if (newStatus === "2") statusText = "В пути";
      if (newStatus === "3") statusText = "Завершено";
      if (newStatus === "4") statusText = "Отменено";

      setTrips(
        trips.map((trip) =>
          trip.id === event.id ? { ...trip, status: statusText } : trip
        )
      );
    }
  }}
/>


      {/* Форма ввода */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 10,
          maxWidth: 400,
        }}
      >
        <h2>Добавить поездку</h2>
        <input
          type="text"
          placeholder="Имя водителя"
          value={newTrip.driver}
          onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Маршрут (откуда → куда)"
          value={newTrip.route}
          onChange={(e) => setNewTrip({ ...newTrip, route: e.target.value })}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="datetime-local"
          value={newTrip.start}
          onChange={(e) => setNewTrip({ ...newTrip, start: e.target.value })}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="datetime-local"
          value={newTrip.end}
          onChange={(e) => setNewTrip({ ...newTrip, end: e.target.value })}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <select
          value={newTrip.status}
          onChange={(e) => setNewTrip({ ...newTrip, status: e.target.value })}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        >
          <option>Запланировано</option>
          <option>В пути</option>
          <option>Завершено</option>
          <option>Отменено</option>
        </select>
        <button
          onClick={addTrip}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 5,
          }}
        >
          Сохранить поездку
        </button>
      </div>
    </div>
  );
}
