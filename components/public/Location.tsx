import { SITE } from "@/content/site";

export function Location() {
  return (
    <section id="location" className="py-32 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
              Find Us
            </p>
            <h2 className="text-4xl md:text-5xl text-white font-light mb-8">
              Location & Hours
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Address</p>
                <p className="text-white text-lg font-sans">{SITE.address}</p>
                <p className="text-gray-500 text-sm font-sans mt-1">{SITE.addressNote}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Hours</p>
                <p className="text-white font-sans">{SITE.hours.weekdays}</p>
                <p className="text-white font-sans">{SITE.hours.weekends}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-2 font-sans">Phone</p>
                <a
                  href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-[#c9a96e] text-xl font-sans hover:text-[#e4c68a] transition-colors"
                >
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="aspect-video md:aspect-auto">
            <iframe
              src={SITE.googleMapsEmbed}
              className="w-full h-full min-h-[300px] border-0 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Victorian Casino Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
