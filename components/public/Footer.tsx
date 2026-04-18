import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#1a1a1a] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <p className="text-[#c9a96e] tracking-widest text-sm uppercase mb-4 font-sans">
              {SITE.name}
            </p>
            <p className="text-gray-500 text-sm font-sans leading-relaxed">{SITE.address}</p>
            <p className="text-gray-500 text-sm font-sans mt-1">{SITE.addressNote}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs tracking-widest uppercase mb-4 font-sans">Hours</p>
            <p className="text-gray-400 text-sm font-sans">{SITE.hours.weekdays}</p>
            <p className="text-gray-400 text-sm font-sans">{SITE.hours.weekends}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs tracking-widest uppercase mb-4 font-sans">Contact</p>
            <a
              href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`}
              className="text-gray-400 text-sm font-sans hover:text-[#c9a96e] transition-colors block"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="text-gray-400 text-sm font-sans hover:text-[#c9a96e] transition-colors block mt-1"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-700 text-xs font-sans">
            © {new Date().getFullYear()} Victorian Casino. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs font-sans">Must be 18+ to gamble. Gamble responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
