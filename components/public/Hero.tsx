import { SITE } from "@/content/site";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hero-poster.jpg"
          alt="Victorian Casino gaming floor"
          className="w-full h-full object-cover opacity-50"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-6 font-sans">
          Whitefish, Montana
        </p>
        <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
          {SITE.tagline}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl font-light mb-4 font-sans">
          {SITE.hours.weekdays} &nbsp;·&nbsp; {SITE.hours.weekends}
        </p>
        <p className="text-gray-500 text-sm mb-12 font-sans">{SITE.address}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#players-club"
            className="bg-[#c9a96e] text-black px-8 py-4 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors"
          >
            Join the Players Club
          </a>
          <a
            href="#location"
            className="border border-[#c9a96e] text-[#c9a96e] px-8 py-4 text-sm tracking-widest uppercase font-sans hover:bg-[#c9a96e] hover:text-black transition-colors"
          >
            Plan Your Visit
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-[#c9a96e] to-transparent mx-auto" />
      </div>
    </section>
  );
}
