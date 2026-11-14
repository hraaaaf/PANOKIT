"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Info, LockKeyhole } from "lucide-react";
import { CatalogueImage } from "@/components/j03/catalogue-image";
import { CatalogueHeader, CatalogueFooter } from "@/components/j03/catalogue-header";
import { catalogueText, j03ModelName, type J03Model, type CatalogueLocale } from "@/lib/j03-catalogue";

type Activity = "liberal" | "commerce" | "other";

export function ModelJourney({ model, locale }: { model: J03Model; locale: CatalogueLocale }) {
  const t = catalogueText[locale];
  const [step, setStep] = useState<"activity" | "format">("activity");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [otherText, setOtherText] = useState("");
  const valid = activity !== null && (activity !== "other" || otherText.trim().length > 0);

  return (
    <>
      <CatalogueHeader locale={locale}/>
      <main className="j03-main j03-journey" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <nav className="j03-crumb" aria-label={locale === "fr" ? "Fil d’Ariane" : "مسار التصفح"}>
          <Link href="/">{t.home}</Link><ChevronRight size={14} aria-hidden="true"/>
          <Link href={`/catalogue/enseignes?lang=${locale}`}>{t.family}</Link><ChevronRight size={14} aria-hidden="true"/>
          <Link href={`/catalogue/enseignes/lumineuses?lang=${locale}`}>{t.luminous}</Link><ChevronRight size={14} aria-hidden="true"/>
          <span aria-current="page">{j03ModelName(model, locale)}</span>
        </nav>
        <div className="j03-journey-grid">
          <aside className="j03-selected-model">
            <CatalogueImage model={model} locale={locale} priority/>
            <p className="j03-eyebrow">{t.selection}</p>
            <h1>{j03ModelName(model, locale)}</h1>
            <Link href={`/catalogue/enseignes/lumineuses?lang=${locale}`} className="j03-quiet-link">
              <ArrowLeft size={16} aria-hidden="true"/>{t.backModels}
            </Link>
          </aside>
          <section className="j03-form-panel" aria-labelledby="j03-step-title">
            <p className="j03-eyebrow">{t.currentStep} {step === "activity" ? "1 / 2" : "2 / 2"}</p>
            <h2 id="j03-step-title">{step === "activity" ? t.activityTitle : t.formatTitle}</h2>
            <p>{step === "activity" ? t.activityHint : t.formatHint}</p>
            {step === "activity" ? (
              <form onSubmit={(event) => {event.preventDefault(); if (valid) setStep("format");}}>
                <fieldset className="j03-activities">
                  <legend className="j03-visually-hidden">{t.activityTitle}</legend>
                  {(["liberal", "commerce", "other"] as const).map((option) => (
                    <label key={option} className={`j03-activity ${activity === option ? "j03-activity--selected" : ""}`}>
                      <input type="radio" name="activity" value={option} checked={activity === option}
                        onChange={() => setActivity(option)} />
                      <span>{option === "liberal" ? t.liberal : option === "commerce" ? t.commerce : t.other}</span>
                    </label>
                  ))}
                </fieldset>
                {activity === "other" && (
                  <label className="j03-other">
                    <span>{t.specify}</span>
                    <input type="text" autoComplete="organization-title" maxLength={100}
                      required value={otherText} onChange={(event) => setOtherText(event.target.value)} />
                  </label>
                )}
                <button className="j03-action" disabled={!valid} type="submit">
                  {t.next}<ArrowRight size={19} aria-hidden="true"/>
                </button>
              </form>
            ) : (
              <>
                <div className="j03-no-format" role="status">
                  <LockKeyhole size={26} aria-hidden="true"/>
                  <p>{t.formatBlocked}</p>
                </div>
                <p className="j03-disclaimer"><Info size={17} aria-hidden="true"/>{t.noPurchase}</p>
                <button type="button" className="j03-back" onClick={() => setStep("activity")}>
                  <ArrowLeft size={16} aria-hidden="true"/>{t.comeBack}
                </button>
              </>
            )}
          </section>
        </div>
      </main>
      <CatalogueFooter locale={locale}/>
    </>
  );
}
