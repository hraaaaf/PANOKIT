"use client";

import {
  ArrowRight,
  ChevronDown,
  FileText,
  Flag,
  Layers3,
  Menu,
  PanelsTopLeft,
  Printer,
  SignpostBig,
  Store,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type FamilyId =
  | "enseignes"
  | "drapeaux"
  | "signaletique"
  | "plv"
  | "impression"
  | "habillage";

type Family = {
  id: FamilyId;
  name: string;
  icon: typeof Store;
  options: string[];
};

const families: Family[] = [
  {
    id: "enseignes",
    name: "Enseignes",
    icon: Store,
    options: ["Lumineuses", "Non lumineuses"],
  },
  {
    id: "drapeaux",
    name: "Drapeaux",
    icon: Flag,
    options: ["Lumineux", "Non lumineux"],
  },
  {
    id: "signaletique",
    name: "Signalétique",
    icon: SignpostBig,
    options: ["Plaques", "Totems", "Chantier"],
  },
  {
    id: "plv",
    name: "PLV",
    icon: PanelsTopLeft,
    options: ["Supports de communication"],
  },
  {
    id: "impression",
    name: "Impression",
    icon: Printer,
    options: ["Vinyle", "Bâche", "Tissu"],
  },
  {
    id: "habillage",
    name: "Habillage de façade",
    icon: Layers3,
    options: ["Plein", "Perforé"],
  },
];

/**
 * Illustration vectorielle PROVISOIRE de structure.
 * La maquette validée contient six illustrations architecturales dédiées.
 * Nous les remplacerons par leurs assets de production, sans intégrer
 * une capture globale non interactive dans le site.
 */
function CategoryScene({ family }: { family: FamilyId }) {
  const common = {
    fill: "none",
    stroke: "#254b4c",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
  };

  return (
    <svg
      className="scene-art"
      viewBox="0 0 370 260"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`wall-${family}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f0e9" />
          <stop offset="1" stopColor="#e2d7c9" />
        </linearGradient>
        <linearGradient id={`board-${family}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#255a5e" />
          <stop offset="1" stopColor="#123d42" />
        </linearGradient>
      </defs>
      <rect width="370" height="260" fill={`url(#wall-${family})`} />
      <path d="M0 219L370 209V260H0Z" fill="#dcd2c5" />
      <path d="M0 221L370 211" stroke="#c5baa9" strokeWidth="1" />
      {family === "enseignes" && (
        <>
          <rect x="18" y="45" width="334" height="182" fill="#c5beb1" />
          <path d="M18 45L70 16H352V45Z" fill="#e7e3d9" />
          <rect x="42" y="120" width="286" height="108" fill="#b5c5c0" />
          <path d="M184 120V228M42 174H328" {...common} />
          <rect x="24" y="49" width="322" height="77" rx="3" fill="#e89f54" />
          <rect x="31" y="54" width="309" height="65" fill={`url(#board-${family})`} />
          <text x="185" y="100" textAnchor="middle" fill="#fff8e8" fontSize="36" fontWeight="800" letterSpacing="2">
            PANOKIT
          </text>
          <path d="M95 107Q175 120 268 108" fill="none" stroke="#f97316" strokeWidth="4" />
          <path d="M13 217q18-60 43-26m-17 26q-17-35 4-47" stroke="#69875b" strokeWidth="7" fill="none" />
        </>
      )}
      {family === "drapeaux" && (
        <>
          <path d="M0 18L174 0V260H0Z" fill="#d8cabe" />
          <path d="M20 0V260M80 0V260M138 0V260" stroke="#c1b0a4" strokeWidth="2" />
          <path d="M174 42L202 52V198L174 208Z" fill="#b1a99f" />
          <rect x="193" y="90" width="48" height="8" rx="4" fill="#445a56" />
          <rect x="193" y="159" width="48" height="8" rx="4" fill="#445a56" />
          <path d="M237 47L347 76V192L237 166Z" fill="#df8a42" />
          <path d="M242 53L341 79V184L242 162Z" fill={`url(#board-${family})`} />
          <text x="288" y="130" textAnchor="middle" fill="#fdf9ec" fontSize="66" fontWeight="800">
            P
          </text>
          <path d="M267 143Q289 132 309 141" stroke="#f97316" strokeWidth="5" fill="none" />
        </>
      )}
      {family === "signaletique" && (
        <>
          <path d="M135 241L145 55L252 44L275 239Z" fill="#b0aba1" />
          <path d="M142 48L257 41L261 226L140 233Z" fill={`url(#board-${family})`} />
          <path d="M143 119L260 113V233L140 237Z" fill="#fbfaf6" />
          <text x="201" y="94" textAnchor="middle" fill="#fff" fontSize="47" fontWeight="800">P</text>
          <path d="M177 108q31-15 60-10" stroke="#fa7926" strokeWidth="5" fill="none" />
          {["Accueil", "Bureaux", "Parking"].map((s, i) => (
            <g key={s} transform={`translate(0,${i * 37})`}>
              <text x="153" y="145" fontSize="14" fill="#162f31">{s}</text>
              <path d="M227 138h18m-7-7 7 7-7 7" fill="none" stroke="#162f31" strokeWidth="2" />
              <path d="M145 153L259 147" stroke="#dadbd4" />
            </g>
          ))}
        </>
      )}
      {family === "plv" && (
        <>
          <path d="M115 40L207 29L270 226L177 238Z" fill="#545e58" />
          <path d="M116 40L177 238L106 239L82 53Z" fill="#acb8ae" />
          <path d="M97 50L202 37L257 211L155 222Z" fill={`url(#board-${family})`} />
          <path d="M113 60L173 213" stroke="#2b4441" strokeWidth="3" />
          <text x="180" y="154" fill="#fff" textAnchor="middle" fontSize="81" fontWeight="800">P</text>
          <path d="M145 172Q180 154 218 166" stroke="#f97316" strokeWidth="7" fill="none" />
          <path d="M65 239h232" stroke="#89887d" strokeWidth="5" />
        </>
      )}
      {family === "impression" && (
        <>
          <ellipse cx="139" cy="161" rx="70" ry="65" fill="#e1d3c2" />
          <path d="M118 99L300 75L354 155L173 188Z" fill="#3f6c70" />
          <path d="M159 189L352 154L316 215L173 239Z" fill="#79a099" />
          <path d="M159 189L352 154L344 171L165 210Z" fill="#f2f0e8" />
          <ellipse cx="139" cy="160" rx="65" ry="63" fill="#f0e8d8" />
          <ellipse cx="139" cy="160" rx="41" ry="41" fill="#cfac84" />
          <ellipse cx="139" cy="160" rx="25" ry="25" fill="#9b704e" />
          <ellipse cx="139" cy="160" rx="13" ry="13" fill="#745943" />
        </>
      )}
      {family === "habillage" && (
        <>
          <path d="M36 70L228 25L344 65L345 240L38 243Z" fill="#b2ada1" />
          <path d="M41 75L228 32L228 230L41 239Z" fill="#436569" />
          <path d="M229 33L339 68V228L228 230Z" fill="#6a8980" />
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <path d={`M${40 + i * 38} ${74 - i * 8}V238`} stroke="#253f41" strokeWidth="4" />
              <path d={`M${228 + i * 22} ${33 + i * 7}V230`} stroke="#314f50" strokeWidth="3" />
            </g>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M39 ${105 + i * 26}L228 ${67 + i * 32}L341 ${100 + i * 28}`} stroke="#b4c8bf" strokeWidth="3" />
          ))}
          <path d="M228 32L339 68V178L228 144Z" fill="#9ab69d" />
          {Array.from({ length: 7 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) => (
              <circle key={`${i}-${j}`} cx={239 + i * 14} cy={54 + i * 4.2 + j * 17} r="2.4" fill="#3d6664" />
            )),
          )}
          <rect x="39" y="209" width="304" height="30" fill="#294a4c" opacity=".85" />
        </>
      )}
    </svg>
  );
}

export default function HomePage() {
  const [expanded, setExpanded] = useState<FamilyId | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [artReady, setArtReady] = useState(false);

  useEffect(() => {
    const artwork = new window.Image();
    artwork.onload = () => setArtReady(true);
    artwork.onerror = () => setArtReady(false);
    artwork.src = "/images/panokit-cards.webp";
    return () => {
      artwork.onload = null;
      artwork.onerror = null;
    };
  }, []);

  return (
    <main className="panokit-home">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#" className="brand" aria-label="PANOKIT — accueil">
            <span className="brand-word">PANOKIT<span className="brand-swoosh" /></span>
            <span className="brand-separator" aria-hidden="true" />
            <span className="brand-descriptor">SIGNALÉTIQUE &amp;<br />COMMUNICATION VISUELLE</span>
          </a>

          <nav className="desktop-nav" aria-label="Navigation principale">
            <a href="#familles">Produits <ChevronDown size={15} aria-hidden="true" /></a>
            <a href="#metiers">Métiers <ChevronDown size={15} aria-hidden="true" /></a>
            <a href="#comment-ca-marche">Comment ça marche</a>
            <a href="#devis">Devis</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href="#devis" className="primary-action desktop-action">
            <FileText size={19} aria-hidden="true" />
            Demander un devis
          </a>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {[
              ["Produits", "#familles"],
              ["Métiers", "#metiers"],
              ["Comment ça marche", "#comment-ca-marche"],
              ["Devis", "#devis"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}>{label}</a>
            ))}
          </nav>
        )}
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <p className="eyebrow"><span className="eyebrow-line" /> SIGNALÉTIQUE &amp; COMMUNICATION VISUELLE</p>
        <h1 id="home-title">Avoir son enseigne n&apos;a<span className="mobile-headline-break"><br /></span> jamais<br className="headline-break" /> <strong>été aussi simple.</strong></h1>
        <div className="headline-stroke" aria-hidden="true" />
      </section>

      <section className="category-section" id="familles" aria-label="Nos familles de produits">
        <div className="category-grid">
          {families.map((family) => {
            const Icon = family.icon;
            const isExpanded = expanded === family.id;
            return (
              <article
                key={family.id}
                className={`category-card ${family.id === "enseignes" ? "reference-emphasis" : ""} ${isExpanded ? "selected" : ""}`}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover)").matches) setExpanded(family.id);
                }}
                onMouseLeave={() => {
                  if (window.matchMedia("(hover: hover)").matches) {
                    setExpanded((open) => (open === family.id ? null : open));
                  }
                }}
              >
                <div
                  className={`card-artwork ${artReady ? "has-photo" : ""}`}
                  data-family={family.id}
                  role="img"
                  aria-label={`Illustration de ${family.name.toLowerCase()} issue de la maquette PANOKIT`}
                >
                  {!artReady && <CategoryScene family={family.id} />}
                </div>
                <button
                  type="button"
                  className="category-title-row"
                  aria-expanded={isExpanded}
                  aria-controls={`family-${family.id}-options`}
                  onClick={() => setExpanded(isExpanded ? null : family.id)}
                >
                  <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
                  <span>{family.name}</span>
                  <span className="category-chevron" aria-hidden="true"><ChevronDown size={21} /></span>
                </button>
                <div className="family-options" id={`family-${family.id}-options`} hidden={!isExpanded}>
                  {family.options.map((option) => (
                    <a
                      key={option}
                      href={`/catalogue/${family.id}?categorie=${encodeURIComponent(option.toLowerCase().replaceAll(" ", "-"))}`}
                      className="family-option"
                    >
                      {option} <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="reference-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 76" preserveAspectRatio="none">
          <path d="M0 25C350 83 1040 -4 1440 27" fill="none" stroke="#f46b0a" strokeWidth="4" />
        </svg>
      </div>
      <section className="home-secondary" id="comment-ca-marche">
        <div>
          <span className="section-kicker">CONCEPTION SIMPLIFIÉE</span>
          <h2>Choisissez. Personnalisez. Commandez.</h2>
          <p>Des formats standardisés, votre identité graphique, un aperçu avant fabrication et un kit pensé pour votre activité.</p>
        </div>
        <a href="#familles" className="secondary-link">Découvrir les produits <ArrowRight size={18} aria-hidden="true" /></a>
      </section>
      <section className="home-anchor-links" aria-label="Informations complémentaires">
        <div id="metiers"><h2>Pour votre métier</h2><p>Le choix de votre activité intervient après celui de votre modèle d&apos;enseigne.</p></div>
        <div id="devis"><h2>Votre devis</h2><p>Le parcours de devis sera relié au PANOKIT Studio lors du prochain lot.</p></div>
        <div id="contact"><h2>Nous contacter</h2><p>Les coordonnées de contact seront intégrées une fois validées.</p></div>
      </section>
      <footer className="site-footer"><span>PANOKIT</span><span>Signalétique &amp; communication visuelle</span></footer>
    </main>
  );
}
