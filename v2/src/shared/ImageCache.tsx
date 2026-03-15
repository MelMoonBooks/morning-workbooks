import React from 'react';

// Context for pre-fetched base64 images (used during PDF generation)
export const ImageCacheContext = React.createContext<Record<string, string>>({});

interface DayImageProps {
  month: string;
  day: number;
  label: string;
}

export function DayImage({ month, day, label }: DayImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const cache = React.useContext(ImageCacheContext);
  const paddedDay = String(day).padStart(2, "0");
  const key = `${month.toLowerCase()}_${paddedDay}`;

  const cachedSrc = cache[key];

  React.useEffect(() => { setLoaded(false); setError(false); }, [key]);

  // PDF mode: base64 already available
  if (cachedSrc) {
    return (
      <div style={{ flex: 1, width: "100%", minHeight: 110,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={cachedSrc}
          alt={label}
          style={{ maxWidth: "100%", maxHeight: 160, width: "auto", height: "auto",
            objectFit: "contain", borderRadius: 4, display: "block" }}
        />
      </div>
    );
  }

  // Normal preview mode
  const src = `/images/${key}.png`;
  return (
    <div style={{ flex: 1, width: "100%", minHeight: 110, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {!error && (
        <img
          src={src}
          alt={label}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ display: loaded ? "block" : "none",
            maxWidth: "100%", maxHeight: 160, width: "auto", height: "auto",
            objectFit: "contain", borderRadius: 4 }}
        />
      )}
      {(!loaded || error) && (
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
