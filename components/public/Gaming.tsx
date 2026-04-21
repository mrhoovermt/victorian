import { GAMING } from "@/content/site";

export function Gaming() {
  const machines = [
    { name: "Video Poker", icon: "♠", desc: "Classic draw poker on screen. Play your hand, hold your cards, win on pairs or better." },
    { name: "Keno", icon: "◈", desc: "Pick your numbers, watch the draw. Easy to learn, endlessly entertaining." },
    { name: "Slots", icon: "◉", desc: "Spin and see. Montana's licensed slot machines with real payouts." },
  ];

  return (
    <section id="gaming" className="py-32 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">The Floor</p>
            <h2 className="text-4xl md:text-5xl text-white font-light mb-6">{GAMING.headline}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 font-sans">{GAMING.description}</p>
            <p className="text-[#c9a96e] text-sm leading-relaxed font-sans italic">{GAMING.firstTimerNote}</p>
          </div>
          <div className="aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/edited/gaming-floor-01.jpg"
              alt="Montana Gold gaming machines at Victorian Casino"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {machines.map((m) => (
            <div key={m.name} className="border border-[#2a2a2a] p-8 hover:border-[#c9a96e]/40 transition-colors">
              <div className="text-[#c9a96e] text-3xl mb-4">{m.icon}</div>
              <h3 className="text-white text-xl mb-3 font-light">{m.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-sans">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
