"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Создаём пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Ошибка: ${error.message}`);
      return;
    }

    // 2. Добавляем запись в таблицу Profiles
    if (data.user) {
      await supabase.from("Profiles").insert([
        {
          id: data.user.id,
          email: email,
          role: "driver",
        },
      ]);
      setMessage("🚖 Водитель успешно зарегистрирован!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>🚖 Регистрация водителя</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          Зарегистрировать
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
