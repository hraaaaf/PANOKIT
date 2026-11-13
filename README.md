# PANOKIT

PANOKIT — plateforme de panneaux et d'enseignes en kits standardisés (« IKEA des panneaux »).

> **État :** initialisation technique. Ce dépôt est public sur décision du cofondateur, mais ne contient **aucune** donnée client, secret, clé d'API ou configuration de production.

## Architecture prévue

- `apps/web` — Next.js / React, Tailwind CSS et PANOKIT Studio (prototype SVG-first).
- `apps/api` — NestJS / TypeScript, règles métier et commandes.
- `packages/contracts` — contrats typés partagés.
- Données et fichiers privés : Supabase PostgreSQL, Storage et Auth (configuration ultérieure).

Le monorepo utilisera pnpm workspaces et GitHub Actions pour la validation automatique.

**Aucun déploiement autorisé par ce dépôt.** Vercel est envisagé pour DEV uniquement, sous GO explicite. Hébergement PROD non décidé.

Roadmap canonique : https://app.notion.com/p/41777c6633628195b96cdc442fae78ec
