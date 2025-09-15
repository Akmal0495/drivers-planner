"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔹 Функция логина
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/profile");
    }
  }

  // 🔹 Функция регистрации
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    // 1. Регистрируем пользователя
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2. Добавляем запись в таблицу Profiles
    if (data.user) {
      const { error: insertError } = await supabase
        .from("Profiles")
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: "driver", // по умолчанию водитель
          },
        ]);

      if (insertError) {
        console.error("Ошибка добавления профиля:", insertError);
      }
    }

    alert("Регистрация успешна! Проверь почту для подтверждения.");
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" required />
        <br />
        <input name="password" type="password" placeholder="Пароль" required />
        <br />
        <button type="submit" disabled={loading}>
          Войти
        </button>
      </form>

      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input name="email" type="email" placeholder="Email" required />
        <br />
        <input name="password" type="password" placeholder="Пароль" required />
        <br />
        <button type="submit" disabled={loading}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
