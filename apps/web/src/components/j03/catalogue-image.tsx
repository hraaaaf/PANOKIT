"use client";

import Image from "next/image";
import { useState } from "react";
import { catalogueText, j03AssetPath, type J03Model, type CatalogueLocale } from "@/lib/j03-catalogue";

/**
 * Show only the exact approved J03 illustration when available. An explicit
 * neutral fallback avoids substituting another product for an approved asset.
 */
export function CatalogueImage({ model, locale, priority = false }: {
  model: J03Model; locale: CatalogueLocale; priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="j03-art" data-asset={model.asset}>
      {hasError ? (
        <div className="j03-art__fallback" role="img" aria-label={catalogueText[locale].artPending}>
          <span aria-hidden="true" className="j03-art__placeholder">P</span>
          <small>{catalogueText[locale].artPending}</small>
        </div>
      ) : (
        <Image
          src={j03AssetPath(model)}
          alt={locale === "ar" ? model.nameAr : model.nameFr}
          fill sizes="(max-width: 600px) 48vw, (max-width: 900px) 46vw, 480px"
          className="j03-art__image" priority={priority} unoptimized
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
