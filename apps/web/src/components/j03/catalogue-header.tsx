import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { catalogueText, type CatalogueLocale } from "@/lib/j03-catalogue";

export function CatalogueHeader({ locale }: { locale: CatalogueLocale }) {
  const t = catalogueText[locale];
  const here = locale === "ar" ? "fr" : "ar";
  return (
    <header className="j03-header">
      <div className="j03-header__inner">
        <Link href="/" className="j03-logo" aria-label="PANOKIT — accueil">
          <span className="j03-logo__word">PANOKIT<span className="j03-logo__stroke" /></span>
          <span className="j03-logo__separator" aria-hidden="true" />
          <span className="j03-logo__description">SIGNALÉTIQUE &amp;<br/> COMMUNICATION VISUELLE</span>
        </Link>
        <nav aria-label={t.products} className="j03-header__navigation">
          <Link href="/#familles">{t.products}</Link>
          <Link href="/#comment-ca-marche">{locale === "ar" ? "كيف يعمل" : "Comment ça marche"}</Link>
        </nav>
        <div className="j03-header__actions">
          <a href={`?lang=${here}`} lang={here} hrefLang={here} className="j03-language" aria-label={here === "ar" ? "اللغة العربية" : "Français"}>
            {here === "ar" ? "العربية" : "FR"}
          </a>
          <Link href="/#devis" className="j03-quote"><FileText size={17} aria-hidden="true"/> {locale === "ar" ? "طلب عرض سعر" : "Demander un devis"}</Link>
        </div>
      </div>
      <div className="j03-return">
        <Link href="/" className="j03-return__link"><ArrowLeft size={16} aria-hidden="true"/>{t.backHome}</Link>
      </div>
    </header>
  );
}

export function CatalogueFooter({ locale }: { locale: CatalogueLocale }) {
  return <footer className="j03-footer"><b>PANOKIT</b><span>{catalogueText[locale].legal}</span></footer>;
}
