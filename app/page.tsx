"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

type Trip = {
  id: number;
  driver: string;
  route: string;
  start: Date;
  end: Date;
  status: "Запланировано" | "В пути" | "Завершено" | "Отменено";
};

export default function Page() {
  const [Trips, setTrips] = useState<Trip[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [form, setForm] = useState({
    driver: "",
    route: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Запланировано" as Trip["status"],
  });

  // Загружаем поездки
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("Trips")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Supabase select error:", error.message);
        return;
      }

      const normalized =
        (data ?? []).map((t: any) => ({
          ...t,
          start: new Date(t.start_time),
          end: new Date(t.end_time),
        })) as Trip[];

      setTrips(normalized);
    };

    load();
  }, []);

  // Сохранить поездку
  const saveTrip = async () => {
    const { driver, route, startDate, startTime, endDate, endTime, status } = form;

    if (!driver || !route || !startDate || !startTime || !endDate || !endTime) {
      alert("Заполни все поля");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (editingTrip) {
      // обновление
      const { data, error } = await supabase
        .from("Trips")
        .update({
          driver,
          route,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          status,
        })
        .eq("id", editingTrip.id)
        .select()
        .single();

      if (error) {
        console.error("Ошибка обновления:", error.message);
        alert("Не удалось обновить поездку");
        return;
      }

      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === editingTrip.id
            ? { ...data, start: new Date(data.start_time), end: new Date(data.end_time) }
            : trip
        )
      );
    } else {
      // новая поездка
      const { data, error } = await supabase
        .from("Trips")
        .insert([
          {
            driver,
            route,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            status,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Ошибка сохранения:", error.message);
        alert("Не удалось сохранить поездку");
        return;
      }

      setTrips((prev) => [
        ...prev,
        { ...data, start: new Date(data.start_time), end: new Date(data.end_time) },
      ]);
    }

    closeModal();
  };

  // Удалить поездку
  const deleteTrip = async (id: number) => {
    if (!confirm("Удалить поездку?")) return;

    const { error } = await supabase.from("Trips").delete().eq("id", id);

    if (error) {
      console.error("Ошибка удаления:", error.message);
      alert("Не удалось удалить поездку");
      return;
    }

    setTrips((prev) => prev.filter((trip) => trip.id !== id));
    closeModal();
  };

  // Открыть модалку
  const editTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setForm({
      driver: trip.driver,
      route: trip.route,
      startDate: moment(trip.start).format("YYYY-MM-DD"),
      startTime: moment(trip.start).format("HH:mm"),
      endDate: moment(trip.end).format("YYYY-MM-DD"),
      endTime: moment(trip.end).format("HH:mm"),
      status: trip.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingTrip(null);
    setModalOpen(false);
    setForm({
      driver: "",
      route: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      status: "Запланировано",
    });
  };

  // Цвета
  const eventStyleGetter = (event: Trip) => {
    let style = {
      borderRadius: "10px",
      padding: "4px",
      color: "white",
      border: "none",
    };
    if (event.status === "Запланировано") style.backgroundColor = "#3B82F6";
    if (event.status === "В пути") style.backgroundColor = "#F59E0B";
    if (event.status === "Завершено") style.backgroundColor = "#10B981";
    if (event.status === "Отменено") style.backgroundColor = "#EF4444";
    return { style };
  };

  // Цветной бейдж статуса
  const StatusBadge = ({ status }: { status: Trip["status"] }) => {
    const colors: Record<Trip["status"], string> = {
      Запланировано: "bg-blue-500",
      "В пути": "bg-orange-500",
      Завершено: "bg-green-500",
      Отменено: "bg-red-500",
    };
    return (
      <span className={`text-white text-xs px-2 py-1 rounded ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🚚 Планировщик поездок</h1>

      {/* Кнопка добавить */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-xl shadow hover:scale-105 transition"
        >
          ➕ Добавить поездку
        </button>
      </div>

      {/* Календарь */}
      <Calendar
        localizer={localizer}
        events={Trips}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, borderRadius: "12px", backgroundColor: "white" }}
        views={["month", "week", "day", "agenda"]}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => editTrip(event)}
        components={{
          event: ({ event }) => (
            <div className="flex items-center gap-1">
              <div className="font-bold text-sm">{event.driver}</div>
              <div className="text-xs">{event.route}</div>
            </div>
          ),
        }}
      />

      {/* 📱 Список поездок для мобильного */}
      <div className="mt-6 grid gap-3 md:hidden">
        {Trips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-xl p-3 shadow flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{trip.driver}</div>
              <div className="text-sm text-gray-600">{trip.route}</div>
              <div className="text-xs text-gray-500">
                {moment(trip.start).format("DD.MM HH:mm")} →{" "}
                {moment(trip.end).format("DD.MM HH:mm")}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={trip.status} />
              <button
                onClick={() => editTrip(trip)}
                className="text-blue-500 text-xs hover:underline"
              >
                ✏️ Редактировать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              ✏️ {editingTrip ? "Редактировать поездку" : "Добавить поездку"}
            </h2>

            <div className="grid gap-2 mb-4">
              <input
                className="border rounded p-2"
                placeholder="Водитель"
                value={form.driver}
                onChange={(e) => setForm({ ...form, driver: e.target.value })}
              />
              <input
                className="border rounded p-2"
                placeholder="Маршрут"
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="border rounded p-2"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded p-2"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  className="border rounded p-2"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
                <input
                  type="time"
                  className="border rounded p-2"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>

              <select
                className="border rounded p-2"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Trip["status"] })
                }
              >
                <option>Запланировано</option>
                <option>В пути</option>
                <option>Завершено</option>
                <option>Отменено</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={saveTrip}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl shadow hover:scale-105 transition"
              >
                {editingTrip ? "💾 Сохранить изменения" : "🚀 Добавить"}
              </button>
              {editingTrip && (
                <button
                  onClick={() => deleteTrip(editingTrip.id)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-xl shadow hover:scale-105 transition"
                >
                  🗑 Удалить
                </button>
              )}
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white py-2 px-4 rounded-xl hover:bg-gray-500"
              >
                ❌ Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
