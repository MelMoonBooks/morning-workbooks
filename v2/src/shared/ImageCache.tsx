import React from 'react';

// Context for pre-fetched base64 images (used during PDF generation)
// Keys can be: "hindu/march_14", "india/march_14", or "march_14"
export const ImageCacheContext = React.createContext<Record<string, string>>({});

interface DayImageProps {
  month: string;
  day: number;
  label: string;
  tradition?: string;   // dominant tradition for this day (e.g. "hindu")
  region?: string;      // child's region (e.g. "india")
  imageFile?: string;   // explicit override from DayTheme (e.g. "diwali_diya.png")
}

// Tiered image fallback:
// 1. imageFile override (if provided)
// 2. images/{tradition}/{month}_{day}.png
// 3. images/{region}/{month}_{day}.png
// 4. images/{month}_{day}.png (universal fallback)
//
// To add images for a tradition/region, create a subfolder:
//   public/images/hindu/october_14.png
//   public/images/india/january_26.png

export function DayImage({ month, day, label, tradition, region, imageFile }: DayImageProps) {
  const cache = React.useContext(ImageCacheContext);
  const paddedDay = String(day).padStart(2, "0");
  const baseKey = `${month.toLowerCase()}_${paddedDay}`;

  // Build candidate list in priority order
  const candidates: string[] = [];
  if (imageFile) {
    candidates.push(imageFile.replace(/\.png$/, ""));
  }
  if (tradition && tradition !== "universal") {
    candidates.push(`${tradition}/${baseKey}`);
  }
  if (region) {
    candidates.push(`${region}/${baseKey}`);
  }
  candidates.push(baseKey);

  // PDF mode: check cache for any candidate
  const cachedKey = candidates.find(k => cache[k]);
  if (cachedKey) {
    return (
      <div style={{ flex: 1, width: "100%", minHeight: 110,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={cache[cachedKey]}
          alt={label}
          style={{ maxWidth: "100%", maxHeight: 160, width: "auto", height: "auto",
            objectFit: "contain", borderRadius: 4, display: "block" }}
        />
      </div>
    );
  }

  // Normal preview mode: try candidates in order with fallback
  return <TieredImage candidates={candidates} label={label} />;
}

// Tries each image URL in order; on error, falls through to the next
function TieredImage({ candidates, label }: { candidates: string[]; label: string }) {
  const [index, setIndex] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  // Reset when candidates change
  const candidateKey = candidates.join(",");
  React.useEffect(() => { setIndex(0); setLoaded(false); }, [candidateKey]);

  const exhausted = index >= candidates.length;
  const src = exhausted ? "" : `/images/${candidates[index]}.png`;

  return (
    <div style={{ flex: 1, width: "100%", minHeight: 110, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!exhausted && (
        <img
          src={src}
          alt={label}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setIndex(i => i + 1);
          }}
          style={{ display: loaded ? "block" : "none",
            maxWidth: "100%", maxHeight: 160, width: "auto", height: "auto",
            objectFit: "contain", borderRadius: 4 }}
        />
      )}
      {(!loaded || exhausted) && (
        <div style={{ flex: 1, width: "100%", minHeight: 110,
          border: "1.5px dashed #9ca3af", borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "white" }}>
          <div style={{ fontSize: 9, color: "#c4b5a0", textAlign: "center",
            lineHeight: 1.4, maxWidth: "80%", fontStyle: "italic" }}>
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
