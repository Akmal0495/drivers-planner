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
      start: new Date(2025, 8, 11, 10, 0), // сентябрь (месяцы в JS с 0)
      end: new Date(2025, 8, 11, 14, 0),
      status: "Запланировано",
    },
  ]);

  const [newTrip, setNewTrip] = useState({
    driver: "",
    route: "",
    startDate: "",
    startTime: "",
    endTime: "",
    status: "Запланировано",
  });

  const addTrip = () => {
    if (!newTrip.driver || !newTrip.route || !newTrip.startDate || !newTrip.startTime || !newTrip.endTime) {
      alert("Заполни все поля!");
      return;
    }

    const start = new Date(`${newTrip.startDate}T${newTrip.startTime}`);
    const end = new Date(`${newTrip.startDate}T${newTrip.endTime}`);

    setTrips([
      ...trips,
      {
        id: trips.length + 1,
        driver: newTrip.driver,
        route: newTrip.route,
        start,
        end,
        status: newTrip.status,
      },
    ]);

    setNewTrip({
      driver: "",
      route: "",
      startDate: "",
      startTime: "",
      endTime: "",
      status: "Запланировано",
    });
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3174ad"; // по умолчанию
    if (event.status === "В пути") backgroundColor = "orange";
    if (event.status === "Завершено") backgroundColor = "green";
    if (event.status === "Отменено") backgroundColor = "red";
    return { style: { backgroundColor } };
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Планировщик поездок</h1>

      {/* форма */}
      <div className="grid gap-2 mb-4">
        <input
          type="text"
          placeholder="Водитель"
          value={newTrip.driver}
          onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Маршрут"
          value={newTrip.route}
          onChange={(e) => setNewTrip({ ...newTrip, route: e.target.value })}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={newTrip.startDate}
          onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
          className="border rounded p-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            value={newTrip.startTime}
            onChange={(e) => setNewTrip({ ...newTrip, startTime: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="time"
            value={newTrip.endTime}
            onChange={(e) => setNewTrip({ ...newTrip, endTime: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={addTrip}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Добавить поездку
        </button>
      </div>

      {/* календарь */}
      <Calendar
        localizer={localizer}
        events={trips}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day"]}
      />
    </div>
  );
}
