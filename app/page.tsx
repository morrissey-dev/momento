import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#2d211c]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="text-2xl font-bold tracking-tight">
          Momento<span className="text-[#d97745]">.</span>
        </div>

        <Link
          href="/create"
          className="rounded-full bg-[#2d211c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a3730]"
        >
          Create a Surprise
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-6 py-16 md:px-12">
        <div className="grid w-full gap-14 md:grid-cols-2 md:items-center">
          
          {/* Hero Text */}
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#d97745]">
              Made for special moments
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Some moments deserve more than a message.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#705f57]">
              Turn your memories, photos and words into a beautiful digital
              surprise for someone special.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/create"
                className="rounded-full bg-[#d97745] px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-[#c96838]"
              >
                Create a Surprise →
              </Link>

              <a
                href="#how-it-works"
                className="rounded-full border border-[#d9cfc8] px-7 py-3.5 font-semibold transition hover:bg-white"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="rotate-2 rounded-[2rem] bg-white p-4 shadow-2xl shadow-[#3d2a2115]">
              <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#f7d8c7] via-[#f5eee8] to-[#e7d6cb] p-8">
                <div className="flex min-h-[420px] flex-col justify-between">

                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-[#8a6657]">
                      This for you
                    </p>

                    <h2 className="mt-8 text-4xl font-bold">
                      Happy Birthday,
                      <br />
                      Sarah! 🎂
                    </h2>

                    <p className="mt-5 max-w-sm leading-7 text-[#725e55]">
                      A collection of memories, little moments and words from
                      someone who appreciates you.
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex -space-x-3">
                      <div className="h-14 w-14 rounded-full border-4 border-[#f5eee8] bg-[#d7a98f]" />
                      <div className="h-14 w-14 rounded-full border-4 border-[#f5eee8] bg-[#b98267]" />
                      <div className="h-14 w-14 rounded-full border-4 border-[#f5eee8] bg-[#e2c2ad]" />
                    </div>

                    <span className="text-4xl">💌</span>
                  </div>

                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <p className="text-sm font-semibold">
                A little something...
              </p>

              <p className="text-xs text-[#8b7970]">
                made just for you ❤️
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Occasions */}
      <section className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97745]">
              Celebrate anything
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Every special moment deserves to be remembered.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["🎂", "Birthday"],
              ["🎓", "Graduation"],
              ["🏆", "Achievement"],
              ["💐", "Appreciation"],
              ["❤️", "Friendship"],
              ["👋", "Farewell"],
              ["🎉", "Congratulations"],
              ["✨", "Just Because"],
            ].map(([emoji, title]) => (
              <div
                key={title}
                className="rounded-3xl border border-[#eee5df] bg-[#fffaf5] p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl">{emoji}</span>

                <h3 className="mt-4 font-semibold">
                  {title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="px-6 py-20 md:px-12"
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97745]">
              Simple by design
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From idea to surprise in minutes.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Create",
                description:
                  "Choose an occasion and add your message, photos and memories.",
              },
              {
                number: "02",
                title: "Personalize",
                description:
                  "Choose a beautiful theme and make the surprise feel uniquely yours.",
              },
              {
                number: "03",
                title: "Share",
                description:
                  "Get a unique link and send it to the person you want to surprise.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-3xl bg-white p-8 shadow-sm"
              >
                <span className="text-sm font-bold text-[#d97745]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-[#75645d]">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#2d211c] px-8 py-16 text-center text-white md:px-16">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f3b08c]">
            Make someone's day
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
            Give them a moment they'll remember.
          </h2>

          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-[#d97745] px-8 py-4 font-semibold transition hover:bg-[#e48654]"
          >
            Create a Surprise →
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eee5df] px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-[#806f67] md:flex-row">
          <p>
            © 2026 Momento. Made for special moments.
          </p>

          <p>
            No login required.
          </p>
        </div>
      </footer>
    </main>
  );
}