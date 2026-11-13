/**
 * Six category pictograms drawn from the PANOKIT approved homepage mockup.
 * These are UI vector pictograms (not the factory artwork).
 * The label inside the category button supplies accessible text.
 */
export type PanokitFamilyId =
  | "enseignes"
  | "drapeaux"
  | "signaletique"
  | "plv"
  | "impression"
  | "habillage";

export function FamilyIcon({ family }: { family: PanokitFamilyId }) {
  const paths = {
    enseignes: (
      <>
        <path d="M24 4v5" />
        <rect x="5" y="9" width="38" height="28" rx="3" />
        <path d="M15 37 10 45M33 37l5 8" />
      </>
    ),
    drapeaux: (
      <>
        <path d="M9 4v41" />
        <path d="M9 10C20 3 29 12 41 8l-7 11 7 7C29 31 21 22 9 27" />
      </>
    ),
    signaletique: (
      <>
        <path d="M24 3v42" />
        <rect x="5" y="9" width="38" height="10" rx="5" />
        <rect x="7" y="26" width="34" height="10" rx="5" />
      </>
    ),
    plv: (
      <>
        <path d="M24 4v5" />
        <rect x="10" y="9" width="28" height="29" rx="1.5" />
        <path d="M10 38 6 45M38 38l4 7M8 41h32" />
      </>
    ),
    impression: (
      <>
        <path d="M13 17V5h22v12" />
        <rect x="5" y="17" width="38" height="21" rx="3" />
        <path d="M13 32h22v12H13zM10 23h2M36 23h2" />
      </>
    ),
    habillage: (
      <>
        <path d="m24 5 19 11-19 11L5 16 24 5Z" />
        <path d="m5 26 19 11 19-11M5 36l19 10 19-10" />
      </>
    ),
  } satisfies Record<PanokitFamilyId, React.ReactNode>;

  return (
    <svg
      data-family-icon={family}
      className="panokit-family-icon"
      width="34"
      height="34"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[family]}
    </svg>
  );
}
