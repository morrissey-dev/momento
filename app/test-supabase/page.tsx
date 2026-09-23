"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("surprises")
        .select("id")
        .limit(1);

      if (error) {
        setStatus(`Connection error: ${error.message}`);
        return;
      }

      setStatus("Supabase connection successful! 🎉");
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-[#2d211c]">
          Momento Supabase Test
        </h1>

        <p className="text-[#6f625b]">
          {status}
        </p>
      </div>
    </main>
  );
}