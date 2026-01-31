import svgToDataUri from "mini-svg-data-uri";

/**
 * Generates a subtle paper grain texture using SVG noise
 */
export function generatePaperGrain(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="300" height="300" filter="url(#noise)" opacity="0.03"/>
    </svg>
  `;
  return svgToDataUri(svg);
}

/**
 * Generates a subtle Islamic geometric pattern
 */
export function generateGeometricPattern(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="2" fill="#C5A059" opacity="0.08"/>
          <circle cx="0" cy="0" r="2" fill="#C5A059" opacity="0.08"/>
          <circle cx="100" cy="0" r="2" fill="#C5A059" opacity="0.08"/>
          <circle cx="0" cy="100" r="2" fill="#C5A059" opacity="0.08"/>
          <circle cx="100" cy="100" r="2" fill="#C5A059" opacity="0.08"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#geometric)"/>
    </svg>
  `;
  return svgToDataUri(svg);
}
