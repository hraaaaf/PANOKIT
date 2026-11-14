import Link from "next/link";

const titles: Record<string, string> = {
  enseignes: "Enseignes",
  drapeaux: "Drapeaux",
  signaletique: "Signalétique",
  plv: "PLV",
  impression: "Impression",
  habillage: "Habillage de façade",
};

export default async function CatalogueFamilyPage({
  params,
}: {
  params: Promise<{ famille: string }>;
}) {
  const { famille } = await params;
  const title = titles[famille];
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm font-bold text-orange-600">
        ← Retour à l&apos;accueil
      </Link>
      {title ? (
        <>
          <h1 className="mt-8 text-4xl font-bold">{title}</h1>
          <p className="mt-5 text-lg text-neutral-600">
            Le catalogue de cette famille sera ouvert dans le lot produit.
            Les formats et contraintes de l&apos;usine doivent être validés
            avant de proposer des articles à commander.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-8 text-4xl font-bold">Famille non disponible</h1>
          <p className="mt-5 text-neutral-600">Cette famille ne fait pas partie du catalogue prévu.</p>
        </>
      )}
    </main>
  );
}
