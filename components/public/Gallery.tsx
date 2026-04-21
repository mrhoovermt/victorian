const PHOTOS = [
  { src: "/images/edited/gallery-floor-overhead.jpg", alt: "Victorian Casino gaming floor overhead view" },
  { src: "/images/edited/gallery-floor-wide.jpg",     alt: "Full gaming floor at Victorian Casino" },
  { src: "/images/edited/gallery-montana-gold.jpg",   alt: "Montana Gold slot machines" },
  { src: "/images/edited/gallery-exterior-night.jpg", alt: "Victorian Casino exterior at night" },
  { src: "/images/edited/gallery-royal-touch.jpg",    alt: "Royal Touch gaming machines" },
  { src: "/images/edited/gallery-bigfoot-keno.jpg",   alt: "Bigfoot Mountain Keno machine" },
  { src: "/images/edited/gallery-montana-gambler.jpg",alt: "Montana Gambler machine" },
  { src: "/images/edited/gallery-deep-seas.jpg",      alt: "Deep Seas Adventure Keno machines" },
  { src: "/images/edited/gallery-atm.jpg",            alt: "Victorian Casino ATM" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#c9a96e] tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            The Space
          </p>
          <h2 className="text-4xl md:text-5xl text-white font-light">Gallery</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="aspect-square overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
