"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Surprise = {
  id: string;
  occasion: string;
  recipient_name: string;
  sender_name: string | null;
  message: string | null;
  music_url: string | null;
  theme: string | null;
  background_image_url: string | null;
};

const balloons = [
  { left: "4%", delay: "0s" },
  { left: "13%", delay: "0.2s" },
  { left: "23%", delay: "0.5s" },
  { left: "33%", delay: "0.1s" },
  { left: "43%", delay: "0.7s" },
  { left: "53%", delay: "0.3s" },
  { left: "63%", delay: "0.8s" },
  { left: "73%", delay: "0.4s" },
  { left: "83%", delay: "0.1s" },
  { left: "93%", delay: "0.6s" },
];

const sparkles = [
  { left: "8%", delay: "0.2s", symbol: "✦" },
  { left: "20%", delay: "0.5s", symbol: "♡" },
  { left: "32%", delay: "0.8s", symbol: "♥" },
  { left: "45%", delay: "0.3s", symbol: "✦" },
  { left: "57%", delay: "0.7s", symbol: "♡" },
  { left: "69%", delay: "0.4s", symbol: "♥" },
  { left: "81%", delay: "0.9s", symbol: "✦" },
  { left: "92%", delay: "0.2s", symbol: "♡" },
];

export default function SurprisePage() {
  const params = useParams();
  const id = params.id as string;

  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [opened, setOpened] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSurprise() {
      if (!id) return;

      const { data, error } = await supabase
        .from("surprises")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Surprise loading error:", error);
        setError("This surprise could not be found.");
        setLoading(false);
        return;
      }

      setSurprise(data);
      setLoading(false);
    }

    loadSurprise();
  }, [id]);

  function openSurprise() {
    if (celebrating || opened) return;

    setCelebrating(true);

    setTimeout(() => {
      setOpened(true);
    }, 1800);

    setTimeout(() => {
      setCelebrating(false);
    }, 3500);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#4a0d1b] text-white">
        <p className="text-lg">Loading your surprise...</p>
      </main>
    );
  }

  if (error || !surprise) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#4a0d1b] px-6 text-center text-white">
        <div>
          <h1 className="text-3xl font-semibold">Surprise not found</h1>

          <p className="mt-3 text-white/70">
            This surprise may no longer exist.
          </p>
        </div>
      </main>
    );
  }

  const recipientName = surprise.recipient_name || "there";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#4a0d1b] text-white">
      {/* Background photo */}
      {surprise.background_image_url && (
        <img
          src={surprise.background_image_url}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[5000ms] ${
            celebrating || opened ? "scale-110" : "scale-100"
          }`}
        />
      )}

      {/* Dark wine-red overlay */}
      <div
        className={`absolute inset-0 bg-[#3b0815] transition-opacity duration-[2000ms] ${
          celebrating
            ? "opacity-85"
            : opened
              ? "opacity-70"
              : "opacity-75"
        }`}
      />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(20,0,8,0.85)_100%)]" />

      {/* Celebration darkening */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-1000 ${
          celebrating ? "opacity-25" : "opacity-0"
        }`}
      />

      {/* Falling balloons and sparkles */}
      {celebrating && (
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
          {balloons.map((balloon, index) => (
            <span
              key={index}
              className="absolute -top-20 text-5xl animate-[balloonFall_3.5s_ease-in_forwards]"
              style={{
                left: balloon.left,
                animationDelay: balloon.delay,
              }}
            >
              🎈
            </span>
          ))}

          {sparkles.map((item, index) => (
            <span
              key={index}
              className="absolute -top-10 text-2xl text-white animate-[sparkleFall_3s_ease-in_forwards]"
              style={{
                left: item.left,
                animationDelay: item.delay,
              }}
            >
              {item.symbol}
            </span>
          ))}
        </div>
      )}

      {/* Decorative hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[8%] top-[14%] text-2xl text-white opacity-30">
          ♡
        </span>

        <span className="absolute right-[12%] top-[18%] text-3xl text-white opacity-25">
          ♥
        </span>

        <span className="absolute bottom-[22%] left-[18%] text-xl text-white opacity-25">
          ♥
        </span>

        <span className="absolute bottom-[28%] right-[8%] text-2xl text-white opacity-30">
          ♡
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        {/* Opening screen */}
        {!opened && (
          <div
            className={`w-full max-w-3xl text-center transition-all duration-1000 ${
              celebrating
                ? "translate-y-[-30px] scale-90 opacity-0 blur-sm"
                : "scale-100 opacity-100"
            }`}
          >
            {/* Decorative line */}
            <div className="mx-auto mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-white/30" />

              <span className="text-lg text-white/60">♡</span>

              <span className="h-px w-12 bg-white/30" />
            </div>

            {/* Recipient name */}
            <h1
              className="mb-3 text-5xl font-normal tracking-wide text-white md:text-7xl"
              style={{
                fontFamily:
                  "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",
              }}
            >
              Hello {recipientName}
            </h1>

            {/* Birthday greeting */}
            <h2 className="mt-4 text-4xl font-light tracking-wide md:text-6xl">
              Happy Birthday!
            </h2>

            {/* Open button */}
            <button
              type="button"
              onClick={openSurprise}
              disabled={celebrating}
              className="mt-10 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm tracking-[0.25em] text-white backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-white/20 disabled:cursor-not-allowed"
            >
              {celebrating
                ? "YOUR SURPRISE IS OPENING..."
                : "OPEN YOUR SURPRISE"}
            </button>

            {/* Bottom decoration */}
            <div className="mx-auto mt-10 flex items-center justify-center gap-3 text-white/40">
              <span>♡</span>

              <span className="h-px w-8 bg-white/20" />

              <span>♡</span>

              <span className="h-px w-8 bg-white/20" />

              <span>♡</span>
            </div>
          </div>
        )}

        {/* Message screen */}
        {opened && (
          <div className="w-full max-w-2xl animate-[messageReveal_2s_ease-out_forwards]">
            <div className="rounded-3xl border border-white/15 bg-black/25 p-8 text-center shadow-2xl backdrop-blur-md md:p-12">
          {/* Message heading */}
<h1 className="text-5xl font-normal tracking-wide text-white md:text-7xl">
  Message for you
</h1>

              {/* Divider */}
              <div className="mx-auto my-7 h-px w-20 bg-white/30" />

              {/* Personal message */}
              {surprise.message ? (
                <p className="whitespace-pre-line text-base leading-8 text-white/90 md:text-lg">
                  {surprise.message}
                </p>
              ) : (
                <p className="text-white/60">
                  A special message was created just for you.
                </p>
              )}

              {/* Sender */}
              {surprise.sender_name && (
                <p className="mt-8 text-sm text-white/60">
                  With love, {surprise.sender_name} ♡
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes balloonFall {
          0% {
            transform: translateY(-120px) rotate(-10deg);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          45% {
            transform: translateY(45vh) rotate(10deg);
            opacity: 1;
          }

          75% {
            transform: translateY(75vh) rotate(-8deg);
            opacity: 0.9;
          }

          100% {
            transform: translateY(115vh) rotate(8deg);
            opacity: 0;
          }
        }

        @keyframes sparkleFall {
          0% {
            transform: translateY(-80px) rotate(0deg);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          50% {
            transform: translateY(50vh) rotate(180deg);
            opacity: 1;
          }

          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes messageReveal {
          0% {
            opacity: 0;
            transform: scale(0.88) translateY(50px);
            filter: blur(15px);
          }

          50% {
            opacity: 0.5;
            transform: scale(0.96) translateY(20px);
            filter: blur(6px);
          }

          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </main>
  );
}