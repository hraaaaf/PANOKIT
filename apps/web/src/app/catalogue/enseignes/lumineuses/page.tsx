import { CatalogueModels } from "@/components/j03/catalogue-models";
import { localeFrom } from "@/lib/j03-catalogue";

export default async function EnseignesLumineusesPage({ searchParams }: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  return <CatalogueModels locale={localeFrom(lang)}/>;
}
