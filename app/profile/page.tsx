"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  // Загружаем данные о пользователе
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // если не залогинен → на страницу логина
        return;
      }

      setUser(user);

      // Загружаем роль из таблицы Profiles
      const { data, error } = await supabase
        .from("Profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Ошибка загрузки роли:", error.message);
      } else {
        setRole(data.role);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!user) {
    return <p>Загрузка...</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>Профиль</h2>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Роль:</b> {role}</p>

      {role === "admin" ? (
        <p style={{ color: "green" }}>✅ У вас права администратора</p>
      ) : (
        <p style={{ color: "blue" }}>👤 Вы вошли как водитель</p>
      )}

      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
}
