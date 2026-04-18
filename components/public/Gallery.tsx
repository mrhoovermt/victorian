// Drop media files into public/media/ — photos (.jpg/.png) and videos (.mp4) auto-populate.
// For now, renders placeholder tiles.

const PLACEHOLDER_COUNT = 9;

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
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[#111] border border-[#1a1a1a] flex items-center justify-center group hover:border-[#c9a96e]/30 transition-colors"
            >
              <span className="text-gray-700 text-xs font-sans group-hover:text-gray-500 transition-colors">
                Photo {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
