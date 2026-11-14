import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { CatalogueImage } from "@/components/j03/catalogue-image";
import { CatalogueHeader, CatalogueFooter } from "@/components/j03/catalogue-header";
import { J03_MODELS, catalogueText, j03ModelName, type CatalogueLocale } from "@/lib/j03-catalogue";

export function CatalogueModels({ locale }: { locale: CatalogueLocale }) {
  const t = catalogueText[locale];
  return (
    <>
      <CatalogueHeader locale={locale} />
      <main className="j03-main" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <nav className="j03-crumb" aria-label={locale === "fr" ? "Fil d’Ariane" : "مسار التصفح"}>
          <Link href="/">{t.home}</Link><ChevronRight size={14} aria-hidden="true" />
          <Link href={`/catalogue/enseignes?lang=${locale}`}>{t.family}</Link><ChevronRight size={14} aria-hidden="true"/>
          <span aria-current="page">{t.luminous}</span>
        </nav>
        <div className="j03-heading">
          <div><p className="j03-eyebrow">{t.family} / {t.luminous}</p><h1>{t.luminous}</h1>
            <p>{t.chooseModel}</p></div>
          <span className="j03-heading__mark" aria-hidden="true" />
        </div>
        <div className="j03-models">
          {J03_MODELS.map((model, index) => (
            <article className="j03-model-card" key={model.id}>
              <Link
                href={`/catalogue/enseignes/lumineuses/${model.id}?lang=${locale}`}
                className="j03-model-card__link"
                aria-label={`${t.continue}: ${j03ModelName(model, locale)}`}
              >
                <CatalogueImage model={model} locale={locale} priority={index === 0}/>
                <div className="j03-model-card__text">
                  <h2>{j03ModelName(model, locale)}</h2>
                  <span className="j03-card-arrow" aria-hidden="true"><ArrowRight size={21}/></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <p className="j03-disclaimer" role="note">{t.notOrderable}</p>
      </main>
      <CatalogueFooter locale={locale} />
    </>
  );
}
