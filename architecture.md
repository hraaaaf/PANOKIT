# PANOKIT — ARCHITECTURE (décisions / hypothèses)

**Source des décisions :** [roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec). **Statut :** architecture approuvée sur le papier ; ne pas présumer du fonctionnement réel avant tests.

## Composants validés

```text
Client web / mobile
    |
    v
Next.js / React  — UI, catalogue, Studio SVG-first (aperçu immédiat)
    |
    |  HTTPS, contrat API typé
    v
NestJS / Node.js / TypeScript  — sécurité et règles métier
    |                |
    | Drizzle SQL    | accès fichiers et identité
    v                v
Supabase Postgres   Supabase Storage privé / Auth
    |
    v
Registre commandes web + événements audités
    |
    v
Dossier de production transmis à l'atelier partenaire
```

- **Monorepo GitHub public** : `pnpm workspaces` ; applications autonomes `apps/web` et `apps/api` ; `packages/contracts` si utile.
- **Frontend** : Next.js, React, Tailwind CSS v4, shadcn/ui, Lucide React.
- **Studio** : moteur de rendu de **prototype** React/SVG-first ; description du document versionnée, export de production contrôlé par backend. Le modèle JSON exact reste à tester.
- **Backend** : NestJS/TypeScript, API distincte (prix, commande, permissions, BAT, flux atelier).
- **Données** : Supabase PostgreSQL et Drizzle ORM, migrations à créer.
- **Documents** : Supabase Storage en buckets privés et accès temporaires, contrôle des fichiers.
- **Comptes internes** : Supabase Auth ; les clients peuvent acheter **en invité**.
- **CI** : GitHub Actions, contrôles sans déploiement.
- **Hébergement** : **Vercel DEV choisi pour les deux applications**, mais aucun déploiement sans GO explicite ; **production non définie**.

## Invariants d'intégrité

1. Une **commande née sur le site** est inscrite dans la source de vérité PANOKIT **avant** sa transmission à l'usine ; origine commerciale, montant et historique vérifiables.
2. L'usine partenaire **ne décide pas unilatéralement** de l'origine d'une vente web, n'efface pas le registre commercial et ne voit que les dossiers nécessaires à sa production.
3. Prix et états de commande/BAT sont recalculés ou validés par le backend ; navigateur non fiable.
4. Les fichiers clients, logos, BAT et exports atelier sont privés.
5. En cas de modification visible du BAT après accord initial, nouvelle validation explicite du client avant fabrication.
6. Les clients invités ne doivent jamais pouvoir deviner ou consulter une autre commande.

## Point technique à prouver

**NestJS sur Vercel serverless** : initialisation, routage, connexions/pooling Postgres, timeouts et production de fichiers PDF/SVG, tâches longues et notifications. Prévoir un worker asynchrone séparé si nécessaire, **sans le choisir ni le déployer avant test et accord**.

## Décisions ouvertes

- [ ] Rôles / permissions précises cofondateur commercial, administration, atelier et opérateur.
- [ ] Schéma SQL, audit append-only, idempotence paiement/commande, migrations et rétention.
- [ ] Formats industriels, moteur export et workflows longues tâches.
- [ ] Configuration et gouvernance de Supabase DEV / futurs environnements.
- [ ] Hébergement production, conformité et engagements de service.

## Preuves exigées

- [ ] Typecheck, lint, tests et builds web + API en CI.
- [ ] Test de manipulation de prix refusée.
- [ ] Test de traçabilité d'une commande web jusqu'à l'atelier.
- [ ] Refus d'accès atelier à des données commerciales sensibles.
- [ ] Validation de BAT versionné et contrôle de fichiers dangereux.
- [ ] Tests de charge et contraintes serverless avant publication DEV.
