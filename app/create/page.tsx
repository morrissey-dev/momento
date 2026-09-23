"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Memory = {
id: string;
file: File;
preview: string;
caption: string;
};

const occasions = [
{ emoji: "🎂", title: "Birthday" },
{ emoji: "🎓", title: "Graduation" },
{ emoji: "🏆", title: "Achievement" },
{ emoji: "💐", title: "Appreciation" },
{ emoji: "❤️", title: "Friendship" },
{ emoji: "👋", title: "Farewell" },
{ emoji: "🎉", title: "Congratulations" },
{ emoji: "✨", title: "Just Because" },
];

const themes = [
{
id: "rose",
name: "Rose",
description: "Warm, soft and heartfelt",
preview: "bg-rose-100",
accent: "bg-rose-500",
},
{
id: "sunset",
name: "Sunset",
description: "Bright, warm and joyful",
preview: "bg-orange-100",
accent: "bg-orange-500",
},
{
id: "lavender",
name: "Lavender",
description: "Calm, dreamy and elegant",
preview: "bg-purple-100",
accent: "bg-purple-500",
},
{
id: "midnight",
name: "Midnight",
description: "Elegant, deep and cinematic",
preview: "bg-slate-200",
accent: "bg-slate-800",
},
{
id: "golden",
name: "Golden",
description: "Celebratory and timeless",
preview: "bg-yellow-100",
accent: "bg-yellow-500",
},
];

export default function CreatePage() {
const [step, setStep] = useState(1);
const [occasion, setOccasion] = useState("");
const [recipientName, setRecipientName] = useState("");
const [senderName, setSenderName] = useState("");
const [message, setMessage] = useState("");
const [memories, setMemories] = useState<Memory[]>([]);
const [backgroundMemoryId, setBackgroundMemoryId] = useState("");
const [musicUrl, setMusicUrl] = useState("");
const [theme, setTheme] = useState("rose");
const [created, setCreated] = useState(false);
const [shareLink, setShareLink] = useState("");

const selectedTheme =
themes.find((item) => item.id === theme) || themes[0];

const selectedBackground = memories.find(
(memory) => memory.id === backgroundMemoryId
);

function handlePhotoUpload(
event: React.ChangeEvent<HTMLInputElement>
) {
const files = Array.from(event.target.files || []);


if (memories.length + files.length > 10) {
  alert("You can upload a maximum of 10 photos.");
  return;
}

const validFiles = files.filter((file) => {
  const validType = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ].includes(file.type);

  const validSize = file.size <= 5 * 1024 * 1024;

  if (!validType) {
    alert(`${file.name} is not a supported image type.`);
    return false;
  }

  if (!validSize) {
    alert(`${file.name} is larger than 5MB.`);
    return false;
  }

  return true;
});

const newMemories: Memory[] = validFiles.map((file) => ({
  id: crypto.randomUUID(),
  file,
  preview: URL.createObjectURL(file),
  caption: "",
}));

setMemories((current) => [...current, ...newMemories]);

event.target.value = "";


}

function updateCaption(id: string, caption: string) {
setMemories((current) =>
current.map((memory) =>
memory.id === id ? { ...memory, caption } : memory
)
);
}

function removeMemory(id: string) {
setMemories((current) => {
const memory = current.find((item) => item.id === id);


  if (memory) {
    URL.revokeObjectURL(memory.preview);
  }

  return current.filter((item) => item.id !== id);
});

if (backgroundMemoryId === id) {
  setBackgroundMemoryId("");
}
}

async function createSurprise() {
try {
const randomId = crypto.randomUUID();
let backgroundImageUrl = "";

  if (selectedBackground) {
    const file = selectedBackground.file;
    const fileExtension = file.name.split(".").pop() || "jpg";
    const filePath = `backgrounds/${randomId}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("surprise-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Background upload error:", uploadError);
      alert("There was a problem uploading the background photo.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("surprise-photos")
      .getPublicUrl(filePath);

    backgroundImageUrl = publicUrlData.publicUrl;
  }

  const { error: surpriseError } = await supabase
    .from("surprises")
    .insert({
      id: randomId,
      occasion,
      recipient_name: recipientName,
      sender_name: senderName || null,
      message,
      music_url: musicUrl || null,
      theme,
      background_image_url: backgroundImageUrl || null,
    });

  if (surpriseError) {
  console.error("Surprise save error:", {
    message: surpriseError.message,
    details: surpriseError.details,
    hint: surpriseError.hint,
    code: surpriseError.code,
  });

  alert(
    `There was a problem creating your surprise.\n\n${
      surpriseError.message || "Unknown Supabase error"
    }`
  );

  return;
}
  for (const memory of memories) {
    const file = memory.file;
    const fileExtension = file.name.split(".").pop() || "jpg";
    const filePath = `memories/${randomId}/${memory.id}.${fileExtension}`;

    const { error: memoryUploadError } = await supabase.storage
      .from("surprise-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (memoryUploadError) {
      console.error("Memory upload error:", memoryUploadError);
      continue;
    }

    const { data: memoryUrlData } = supabase.storage
      .from("surprise-photos")
      .getPublicUrl(filePath);

    const { error: memorySaveError } = await supabase
      .from("memories")
      .insert({
        surprise_id: randomId,
        image_url: memoryUrlData.publicUrl,
        caption: memory.caption || null,
      });

    if (memorySaveError) {
      console.error("Memory save error:", memorySaveError);
    }
  }

  const link = `${window.location.origin}/surprise/${randomId}`;

  setShareLink(link);
  setCreated(true);
} catch (error) {
  console.error("Unexpected error:", error);
  alert("Something went wrong while creating your surprise.");
}


}

function resetCreation() {
memories.forEach((memory) => {
URL.revokeObjectURL(memory.preview);
});


setStep(1);
setOccasion("");
setRecipientName("");
setSenderName("");
setMessage("");
setMemories([]);
setBackgroundMemoryId("");
setMusicUrl("");
setTheme("rose");
setCreated(false);
setShareLink("");


}

if (created) {
return ( <main className="min-h-screen bg-[#fffaf5] px-6 py-12"> <div className="mx-auto max-w-2xl text-center"> <div className="mb-8 text-6xl">🎂</div>

      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d97745]">
        Your birthday surprise is ready
      </p>

      <h1 className="mb-5 text-4xl font-bold text-[#2d211c]">
        You&apos;ve created something special.
      </h1>

      <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-[#6f625b]">
        Your birthday surprise for{" "}
        <strong>{recipientName}</strong> has been prepared.
      </p>

      <div className="mb-8 rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[#7c6d65]">
          Your surprise link
        </p>

        <div className="break-all rounded-2xl bg-[#fffaf5] p-4 text-sm text-[#2d211c]">
          {shareLink}
        </div>

        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(shareLink)}
          className="mt-4 rounded-full bg-[#d97745] px-6 py-3 font-semibold text-white transition hover:bg-[#c76636]"
        >
          Copy Link
        </button>
      </div>

      <p className="mb-8 text-sm text-[#8b7d74]">
        Your surprise is now ready to share.
      </p>

      <button
        type="button"
        onClick={resetCreation}
        className="rounded-full border border-[#d9c9bf] px-6 py-3 font-semibold text-[#2d211c] transition hover:bg-white"
      >
        Create Another Surprise
      </button>
    </div>
  </main>
);
}

return ( <main className="min-h-screen bg-[#fffaf5] px-6 py-10"> <div className="mx-auto max-w-4xl">

    {/* Header */}
    <div className="mb-10 text-center">
      <div className="mb-3 text-3xl font-bold text-[#2d211c]">
        Momento
      </div>

      <p className="text-[#7c6d65]">
        Create something they&apos;ll remember.
      </p>

      {/* Progress */}
      <div className="mx-auto mt-8 flex max-w-xl items-center justify-between">
        {[1, 2, 3, 4, 5, 6].map((number) => (
          <div
            key={number}
            className="flex items-center"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                step >= number
                  ? "bg-[#d97745] text-white"
                  : "bg-[#eaded5] text-[#8b7d74]"
              }`}
            >
              {number}
            </div>

            {number !== 6 && (
              <div
                className={`hidden h-1 w-8 sm:block ${
                  step > number
                    ? "bg-[#d97745]"
                    : "bg-[#eaded5]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>

    {/* STEP 1 */}
    {step === 1 && (
      <section className="rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 1
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c]">
            What are you celebrating?
          </h1>

          <p className="mt-2 text-[#7c6d65]">
            Choose the occasion that fits your surprise.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {occasions.map((item) => (
            <button
              type="button"
              key={item.title}
              onClick={() => setOccasion(item.title)}
              className={`rounded-2xl border p-5 text-left transition ${
                occasion === item.title
                  ? "border-[#d97745] bg-[#fff3ec] ring-2 ring-[#d97745]/20"
                  : "border-[#eaded5] hover:border-[#d9b6a3]"
              }`}
            >
              <div className="mb-3 text-3xl">
                {item.emoji}
              </div>

              <div className="font-semibold text-[#2d211c]">
                {item.title}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!occasion}
          onClick={() => setStep(2)}
          className="mt-8 w-full rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white transition hover:bg-[#c76636] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </section>
    )}

    {/* STEP 2 */}
    {step === 2 && (
      <section className="rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 2
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c]">
            Who is this surprise for?
          </h1>

          <p className="mt-2 text-[#7c6d65]">
            Tell us who should receive this special moment.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-[#2d211c]">
              Recipient&apos;s name
            </label>

            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-2xl border border-[#eaded5] px-5 py-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d97745] focus:ring-2 focus:ring-[#d97745]/10"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-[#2d211c]">
              Your name
              <span className="ml-2 text-sm font-normal text-[#9a8b82]">
                Optional
              </span>
            </label>

            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Morris"
              className="w-full rounded-2xl border border-[#eaded5] px-5 py-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d97745] focus:ring-2 focus:ring-[#d97745]/10"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 rounded-full border border-[#d9c9bf] px-6 py-4 font-semibold text-[#2d211c]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!recipientName.trim()}
            onClick={() => setStep(3)}
            className="flex-1 rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white transition hover:bg-[#c76636] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </section>
    )}

    {/* STEP 3 */}
    {step === 3 && (
      <section className="rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 3
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c]">
            Write your message
          </h1>

          <p className="mt-2 text-[#7c6d65]">
            Say what you really want them to know.
          </p>
        </div>

        {/* Message input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={10000}
          rows={9}
          placeholder="Write something meaningful..."
          className="w-full resize-none rounded-2xl border border-[#eaded5] p-5 text-lg leading-8 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d97745] focus:ring-2 focus:ring-[#d97745]/10"
        />

        {/* Character count */}
        <div className="mt-2 text-right text-sm text-[#9a8b82]">
          {message.length}/10000
      
        </div>

        {/* Special message preview */}
        {message && (
          <div className="relative mt-6 min-h-[360px] overflow-hidden rounded-3xl">
            {/* Temporary background image */}
            <img
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=85"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark wine-red overlay */}
            <div className="absolute inset-0 bg-[#3b0815]/70" />

            {/* Soft vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(30,2,10,0.60)_100%)]" />

            {/* Decorative hearts */}
            <div className="pointer-events-none absolute inset-0">
              <span className="absolute left-6 top-6 text-2xl text-white/40">
                ♡
              </span>

              <span className="absolute right-8 top-10 text-3xl text-white/30">
                ♥
              </span>

              <span className="absolute bottom-8 left-10 text-xl text-white/30">
                ✦
              </span>

              <span className="absolute bottom-10 right-8 text-2xl text-white/40">
                ♡
              </span>
            </div>

            {/* Message */}
            <div className="relative z-10 flex min-h-[360px] flex-col justify-center px-7 py-10 text-center sm:px-12">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                A special message for you
              </p>

              <p className="whitespace-pre-wrap font-serif text-lg leading-9 text-white sm:text-xl">
                {message}
              </p>

              {senderName && (
                <p
                  className="mt-8 text-xl text-white"
                  style={{
                    fontFamily:
                      "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",
                  }}
                >
                  — {senderName}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex-1 rounded-full border border-[#d9c9bf] px-6 py-4 font-semibold text-[#2d211c]"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!message.trim()}
            onClick={() => setStep(4)}
            className="flex-1 rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white transition hover:bg-[#c76636] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </section>
    )}

    {/* STEP 4 */}
    {step === 4 && (
      <section className="rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 4
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c]">
            Add photos
          </h1>

          <p className="mt-2 text-[#7c6d65]">
            Photos are completely optional. Skip this step if you want a simple birthday surprise.
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#dfcfc5] bg-[#fffaf5] px-6 py-12 text-center transition hover:border-[#d97745]">
          <div className="mb-3 text-4xl">📸</div>

          <div className="font-semibold text-[#2d211c]">
            Click to upload photos
          </div>

          <div className="mt-2 text-sm text-[#8b7d74]">
            JPEG, PNG or WebP · Maximum 5MB each
          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>

        {memories.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl bg-[#fffaf5] p-5">
              <h3 className="font-semibold text-[#2d211c]">
                Choose your background photo
              </h3>

              <p className="mt-1 text-sm text-[#8b7d74]">
                This photo will appear behind the opening birthday screen.
              </p>
            </div>

            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className={`rounded-2xl border p-4 ${
                  backgroundMemoryId === memory.id
                    ? "border-[#d97745] bg-[#fffaf5] ring-2 ring-[#d97745]/20"
                    : "border-[#eaded5]"
                }`}
              >
                <div className="flex gap-4">
                  <img
                    src={memory.preview}
                    alt={`Memory ${index + 1}`}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#2d211c]">
                        Memory {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeMemory(memory.id)}
                        className="text-sm font-medium text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={memory.caption}
                      onChange={(e) =>
                        updateCaption(memory.id, e.target.value)
                      }
                      placeholder="Add a caption..."
                      className="w-full rounded-xl border border-[#eaded5] px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#d97745]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setBackgroundMemoryId(memory.id)
                      }
                      className={`mt-3 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        backgroundMemoryId === memory.id
                          ? "bg-[#d97745] text-white"
                          : "border border-[#d9c9bf] text-[#2d211c] hover:bg-white"
                      }`}
                    >
                      {backgroundMemoryId === memory.id
                        ? "✓ Background Selected"
                        : "Use as Background"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-sm text-[#8b7d74]">
          {memories.length}/10 photos added
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex-1 rounded-full border border-[#d9c9bf] px-6 py-4 font-semibold text-[#2d211c]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => setStep(5)}
            className="flex-1 rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white transition hover:bg-[#c76636]"
          >
            {memories.length === 0 ? "Skip Photos" : "Continue"}
          </button>
        </div>
      </section>
    )}

    {/* STEP 5 */}
    {step === 5 && (
      <section className="rounded-3xl border border-[#eaded5] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 5
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c]">
            Add the finishing touches
          </h1>

          <p className="mt-2 text-[#7c6d65]">
            Music is optional. Choose a theme for the birthday experience.
          </p>
        </div>

        {/* Music */}
        <div className="mb-10">
          <label className="mb-2 block font-semibold text-[#2d211c]">
            Music link
            <span className="ml-2 text-sm font-normal text-[#9a8b82]">
              Optional
            </span>
          </label>

          <input
            type="url"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            placeholder="Paste a Spotify or YouTube link"
            className="w-full rounded-2xl border border-[#eaded5] px-5 py-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d97745] focus:ring-2 focus:ring-[#d97745]/10"
          />

          <p className="mt-2 text-sm text-[#8b7d74]">
            You can leave this empty if you do not want music.
          </p>
        </div>

        {/* Themes */}
        <div>
          <div className="mb-4">
            <h2 className="font-semibold text-[#2d211c]">
              Choose a theme
            </h2>

            <p className="mt-1 text-sm text-[#8b7d74]">
              This will determine the mood of the surprise.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {themes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  theme === item.id
                    ? "border-[#d97745] ring-2 ring-[#d97745]/20"
                    : "border-[#eaded5]"
                }`}
              >
                <div
                  className={`flex h-24 items-end p-4 ${item.preview}`}
                >
                  <div
                    className={`h-8 w-24 rounded-lg ${item.accent}`}
                  />
                </div>

                <div className="p-4">
                  <div className="font-semibold text-[#2d211c]">
                    {item.name}
                  </div>

                  <div className="mt-1 text-sm text-[#8b7d74]">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="flex-1 rounded-full border border-[#d9c9bf] px-6 py-4 font-semibold text-[#2d211c]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => setStep(6)}
            className="flex-1 rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white transition hover:bg-[#c76636]"
          >
            Preview Surprise
          </button>
        </div>
      </section>
    )}

    {/* STEP 6 */}
    {step === 6 && (
      <section>
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#d97745]">
            Step 6
          </p>

          <h1 className="text-3xl font-bold text-[#2d211c] sm:text-4xl">
            Your birthday surprise
          </h1>

          <p className="mt-3 text-[#7c6d65]">
            This is how the surprise will feel.
          </p>
        </div>

        {/* Opening Preview */}
        <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] bg-[#4a0d1b] p-4 sm:p-8">
          {selectedBackground && (
            <img
              src={selectedBackground.preview}
              alt="Selected background"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}

          <div className="absolute inset-0 bg-[#3b0815]/75" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(30,2,10,0.75)_100%)]" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute left-[8%] top-[14%] text-2xl text-white opacity-40">
              ♡
            </span>

            <span className="absolute right-[12%] top-[18%] text-3xl text-white opacity-30">
              ♥
            </span>

            <span className="absolute left-[18%] bottom-[22%] text-xl text-white opacity-30">
              ♥
            </span>

            <span className="absolute right-[8%] bottom-[28%] text-2xl text-white opacity-40">
              ♡
            </span>

            <span className="absolute left-[45%] top-[9%] text-lg text-white opacity-25">
              ✦
            </span>

            <span className="absolute right-[38%] bottom-[12%] text-lg text-white opacity-25">
              ✦
            </span>
          </div>

          <div className="relative z-10 flex min-h-[450px] flex-col items-center justify-center text-center text-white">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-white/30" />
              <span className="text-lg text-white/60">♡</span>
              <span className="h-px w-12 bg-white/30" />
            </div>

            <h2
              className="mb-3 text-5xl font-normal tracking-wide text-white sm:text-6xl"
              style={{
                fontFamily:
                  "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",
              }}
            >
              Hello {recipientName || "Sarah"}
            </h2>

            <h3 className="mt-4 text-4xl font-light tracking-wide text-white sm:text-5xl">
              Happy Birthday!
            </h3>

            <button
              type="button"
              className="mt-10 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm tracking-[0.25em] text-white backdrop-blur-md transition hover:bg-white/20"
            >
              OPEN YOUR SURPRISE
            </button>

            <div className="mx-auto mt-10 flex items-center justify-center gap-3 text-white/40">
              <span>♡</span>
              <span className="h-px w-8 bg-white/20" />
              <span>♡</span>
              <span className="h-px w-8 bg-white/20" />
              <span>♡</span>
            </div>
          </div>
        </div>

        {/* Message preview */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#eaded5] bg-white">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-bold text-[#2d211c]">
              Your message
            </h3>

            <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=85"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-[#3b0815]/70" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(30,2,10,0.60)_100%)]" />

              <div className="pointer-events-none absolute inset-0">
                <span className="absolute left-5 top-5 text-2xl text-white/40">
                  ♡
                </span>

                <span className="absolute right-6 top-7 text-3xl text-white/30">
                  ♥
                </span>

                <span className="absolute bottom-6 left-7 text-xl text-white/30">
                  ✦
                </span>

                <span className="absolute bottom-7 right-6 text-2xl text-white/40">
                  ♡
                </span>
              </div>

              <div className="relative z-10 flex min-h-[300px] flex-col justify-center px-7 py-10 text-center sm:px-12">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  A special message for you
                </p>

                <p className="whitespace-pre-wrap font-serif text-lg leading-9 text-white sm:text-xl">
                  {message}
                </p>

                {senderName && (
                  <p
                    className="mt-8 text-xl text-white"
                    style={{
                      fontFamily:
                        "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive",
                    }}
                  >
                    — {senderName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        {memories.length > 0 && (
          <div className="mt-8 rounded-3xl border border-[#eaded5] bg-white p-6">
            <h3 className="mb-5 text-lg font-bold text-[#2d211c]">
              Your photos
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {memories.map((memory) => (
                <div key={memory.id}>
                  <img
                    src={memory.preview}
                    alt={memory.caption || "Memory"}
                    className={`aspect-square w-full rounded-2xl object-cover ${
                      backgroundMemoryId === memory.id
                        ? "ring-4 ring-[#d97745]"
                        : ""
                    }`}
                  />

                  {memory.caption && (
                    <p className="mt-2 text-sm text-[#7c6d65]">
                      {memory.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Music */}
        {musicUrl && (
          <div className="mt-8 rounded-3xl border border-[#eaded5] bg-white p-6 text-center">
            <div className="mb-2 text-3xl">🎵</div>

            <h3 className="font-semibold text-[#2d211c]">
              Music added
            </h3>

            <p className="mt-2 break-all text-sm text-[#8b7d74]">
              {musicUrl}
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 rounded-3xl border border-[#eaded5] bg-white p-6">
          <h3 className="mb-5 text-lg font-bold text-[#2d211c]">
            Surprise details
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[#8b7d74]">
                Occasion
              </p>

              <p className="font-semibold text-[#2d211c]">
                {occasion}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8b7d74]">
                Recipient
              </p>

              <p className="font-semibold text-[#2d211c]">
                {recipientName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8b7d74]">
                Photos
              </p>

              <p className="font-semibold text-[#2d211c]">
                {memories.length === 0
                  ? "None"
                  : `${memories.length} added`}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8b7d74]">
                Music
              </p>

              <p className="font-semibold text-[#2d211c]">
                {musicUrl ? "Added" : "None"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#8b7d74]">
                Theme
              </p>

              <p className="font-semibold text-[#2d211c]">
                {selectedTheme.name}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep(5)}
            className="rounded-full border border-[#d9c9bf] px-6 py-4 font-semibold text-[#2d211c]"
          >
            ← Edit
          </button>

          <button
            type="button"
            onClick={createSurprise}
            className="flex-1 rounded-full bg-[#d97745] px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-[#c76636]"
          >
            🎂 Create My Birthday Surprise
          </button>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-[#9a8b82]">
          Photos and music are optional. Your surprise can still be created without them.
        </p>
      </section>
    )}
  </div>
</main>
);
}
