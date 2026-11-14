import Link from "next/link";
import { ArrowRight, ChevronRight, Lightbulb, PanelsTopLeft } from "lucide-react";
import { CatalogueHeader, CatalogueFooter } from "@/components/j03/catalogue-header";
import { catalogueText, localeFrom } from "@/lib/j03-catalogue";

const families: Record<string, [string, string]> = {
  enseignes: ["Enseignes", "اللافتات"],
  drapeaux: ["Drapeaux", "الأعلام"],
  signaletique: ["Signalétique", "اللافتات الإرشادية"],
  plv: ["PLV", "الدعاية في نقطة البيع"],
  impression: ["Impression", "الطباعة"],
  habillage: ["Habillage de façade", "تكسية الواجهات"],
};

export default async function CatalogueFamilyPage({ params, searchParams }: {
  params: Promise<{ famille: string }>;
  searchParams: Promise<{ lang?: string; categorie?: string }>;
}) {
  const { famille } = await params;
  const { lang, categorie } = await searchParams;
  const locale = localeFrom(lang);
  const t = catalogueText[locale];
  const familyTitle = families[famille]?.[locale === "ar" ? 1 : 0];

  return (
    <>
      <CatalogueHeader locale={locale}/>
      <main className="j03-main j03-family" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        <nav className="j03-crumb" aria-label={locale === "ar" ? "مسار التصفح" : "Fil d’Ariane"}>
          <Link href="/">{t.home}</Link><ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{familyTitle ?? t.familyUnknown}</span>
        </nav>
        <div className="j03-heading">
          <div><p className="j03-eyebrow">{t.products}</p>
            <h1>{familyTitle ?? t.familyUnknown}</h1>
            <p>{famille === "enseignes" ? t.chooseFamily : t.otherFamilyHint}</p></div>
        </div>
        {famille === "enseignes" ? (
          <div className="j03-family-grid">
            <Link href={`/catalogue/enseignes/lumineuses?lang=${locale}`} className="j03-family-card">
              <Lightbulb size={36} strokeWidth={1.5} aria-hidden="true"/>
              <h2>{t.luminous}</h2>
              <span>{t.discover}<ArrowRight size={17} aria-hidden="true"/></span>
            </Link>
            <div className="j03-family-card j03-family-card--disabled" aria-disabled="true">
              <PanelsTopLeft size={36} strokeWidth={1.5} aria-hidden="true"/>
              <h2>{t.nonLuminous}</h2>
              <span>{t.unavailable}</span>
            </div>
          </div>
        ) : <p role="note" className="j03-disclaimer">{t.otherFamilyHint}</p>}
        {famille === "enseignes" && categorie === "non-lumineuses" && (
          <p role="note" className="j03-disclaimer">{t.nonLuminous} : {t.unavailable}</p>
        )}
      </main>
      <CatalogueFooter locale={locale}/>
    </>
  );
}
