import { notFound } from "next/navigation";
import { ModelJourney } from "@/components/j03/model-journey";
import { getJ03Model, localeFrom } from "@/lib/j03-catalogue";

export default async function CatalogueModelPage({ params, searchParams }: {
  params: Promise<{ modele: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { modele } = await params;
  const { lang } = await searchParams;
  const model = getJ03Model(modele);
  if (!model) notFound();
  return <ModelJourney model={model} locale={localeFrom(lang)}/>;
}
