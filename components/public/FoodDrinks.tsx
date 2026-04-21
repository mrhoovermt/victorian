import { MENU } from "@/content/site";

export function FoodDrinks() {
  return (
    <section id="food" className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            Bar & Kitchen
          </p>
          <h2 className="text-4xl md:text-5xl text-white font-light">Food & Drinks</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Drinks */}
          <div>
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#2a2a2a]">
              <div className="w-8 h-px bg-[#c9a96e]" />
              <h3 className="text-[#c9a96e] tracking-widest text-sm uppercase font-sans">
                {MENU.drinks.title}
              </h3>
            </div>
            <ul className="space-y-4">
              {MENU.drinks.items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-[#c9a96e] rounded-full flex-shrink-0" />
                  <span className="text-gray-300 font-sans">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/edited/bar-interior.jpg"
                alt="Bar and lounge area at Victorian Casino in Whitefish, Montana"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Food */}
          <div>
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#2a2a2a]">
              <div className="w-8 h-px bg-[#c9a96e]" />
              <h3 className="text-[#c9a96e] tracking-widest text-sm uppercase font-sans">
                {MENU.food.title}
              </h3>
            </div>
            <ul className="space-y-4">
              {MENU.food.items.map((item) => (
                <li key={item.name} className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-[#c9a96e] rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <span className="text-gray-300 font-sans">{item.name}</span>
                    {item.available !== "Daily" && (
                      <span className="ml-2 text-[#c9a96e] text-xs font-sans">
                        — {item.available}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/edited/gaming-ambient-01.jpg"
                alt="Gaming lounge interior at Victorian Casino in Whitefish, Montana"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
