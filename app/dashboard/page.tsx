"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login"); // если не залогинен
        return;
      }

      const { data, error } = await supabase
        .from("Profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        router.push("/profile");
        return;
      }

      if (data.role !== "driver") {
        router.push("/profile"); // если не водитель → выкидываем обратно
      } else {
        setRole("driver");
      }
    }

    checkRole();
  }, [router]);

  if (role !== "driver") {
    return <p>Загрузка...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>🚖 Панель водителя</h1>
      <p>Здесь будут отображаться поездки, назначенные этому водителю.</p>
    </div>
  );
}
