"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { supabase } from "../lib/supabaseClient";

const localizer = momentLocalizer(moment);

type Trip = {
  id: number;
  driver: string;
  route: string;
  start: string | Date;
  end: string | Date;
  status: "Запланировано" | "В пути" | "Завершено" | "Отменено";
};

export default function Page() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const [newTrip, setNewTrip] = useState({
    driver: "",
    route: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Запланировано" as Trip["status"],
  });

  // 1) читаем из БД при загрузке
  useEffect(() => {
    const loadTrips = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("start", { ascending: true });

      if (error) {
        console.error("❌ Supabase select error:", error.message);
        return;
      }

      // Supabase возвращает строки в ISO; приводим к Date для календаря
      const normalized =
        data?.map((t) => ({
          ...t,
          start: new Date(t.start),
          end: new Date(t.end),
        })) ?? [];

      setTrips(normalized as Trip[]);
    };

    loadTrips();
  }, []);

  // 2) добавляем поездку в БД
  const addTrip = async () => {
    const { driver, route, startDate, startTime, endDate, endTime, status } = newTrip;

    if (!driver || !route || !startDate || !startTime || !endDate || !endTime) {
      alert("Заполни все поля (включая обе даты и время)!");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const { data, error } = await supabase
      .from("trips")
      .insert([
        {
          driver,
          route,
          start: start.toISOString(),
          end: end.toISOString(),
          status,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      alert("Не удалось добавить поездку");
      return;
    }

    // добавляем в локальный стейт, чтобы сразу увидеть в UI
    setTrips((prev) => [
      ...prev,
      { ...(data as any), start, end } as Trip,
    ]);

    // очистить форму
    setNewTrip({
      driver: "",
      route: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      status: "Запланировано",
    });
  };

  const eventStyleGetter = (event: Trip) => {
    let backgroundColor = "#3174ad";
    if (event.status === "В пути") backgroundColor = "orange";
    if (event.status === "Завершено") backgroundColor = "green";
    if (event.status === "Отменено") backgroundColor = "red";
    return { style: { backgroundColor } };
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Планировщик поездок</h1>

      {/* Форма */}
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

        {/* Дата/время отправления */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={newTrip.startDate}
            onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="time"
            value={newTrip.startTime}
            onChange={(e) => setNewTrip({ ...newTrip, startTime: e.target.value })}
            className="border rounded p-2"
          />
        </div>

        {/* Дата/время прибытия */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={newTrip.endDate}
            onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="time"
            value={newTrip.endTime}
            onChange={(e) => setNewTrip({ ...newTrip, endTime: e.target.value })}
            className="border rounded p-2"
          />
        </div>

        <select
          value={newTrip.status}
          onChange={(e) =>
            setNewTrip({ ...newTrip, status: e.target.value as Trip["status"] })
          }
          className="border rounded p-2"
        >
          <option>Запланировано</option>
          <option>В пути</option>
          <option>Завершено</option>
          <option>Отменено</option>
        </select>

        <button
          onClick={addTrip}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Добавить поездку
        </button>
      </div>

      {/* Календарь */}
      <Calendar
        localizer={localizer}
        events={trips}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 520 }}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day", "agenda"]}
      />
    </div>
  );
}
