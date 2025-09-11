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
      start: new Date(2025, 7, 11, 10, 0),
      end: new Date(2025, 7, 11, 14, 0),
      status: "Запланировано",
    },
  ]);

  const [newTrip, setNewTrip] = useState({
    driver: "",
    route: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "Запланировано",
  });

  const addTrip = () => {
    if (!newTrip.driver || !newTrip.route || !newTrip.date || !newTrip.startTime || !newTrip.endTime) {
      alert("Заполните все поля!");
      return;
    }

    const start = new Date(`${newTrip.date}T${newTrip.startTime}`);
    const end = new Date(`${newTrip.date}T${newTrip.endTime}`);

    setTrips([
      ...trips,
      { ...newTrip, id: trips.length + 1, start, end },
    ]);

    setNewTrip({ driver: "", route: "", date: "", startTime: "", endTime: "", status: "Запланировано" });
  };

  return (
    <div className="pb-20 p-4 max-w-4xl mx-auto">
      {/* Заголовок */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4">
        Планировщик поездок
      </h1>

      {/* Форма */}
      <form
        className="flex flex-col gap-3 bg-white shadow-md p-4 rounded-lg mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          addTrip();
        }}
      >
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
        {/* Отдельно дата + время */}
        <input
          type="date"
          value={newTrip.date}
          onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
          className="border rounded p-2"
        />
        <div className="flex gap-2">
          <input
            type="time"
            value={newTrip.startTime}
            onChange={(e) => setNewTrip({ ...newTrip, startTime: e.target.value })}
            className="border rounded p-2 flex-1"
          />
          <input
            type="time"
            value={newTrip.endTime}
            onChange={(e) => setNewTrip({ ...newTrip, endTime: e.target.value })}
            className="border rounded p-2 flex-1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition"
        >
          Добавить поездку
        </button>
      </form>

      {/* Календарь */}
      <div className="overflow-x-auto">
        <Calendar
          localizer={localizer}
          events={trips}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Нижняя панель */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around py-2">
        <button className="flex flex-col items-center text-blue-600">
          📅 <span className="text-xs">Календарь</span>
        </button>
        <button className="flex flex-col items-center text-gray-700">
          ➕ <span className="text-xs">Добавить</span>
        </button>
        <button className="flex flex-col items-center text-gray-700">
          ⚙️ <span className="text-xs">Настройки</span>
        </button>
      </nav>
    </div>
  );
}
