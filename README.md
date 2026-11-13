# PANOKIT

PANOKIT — plateforme de panneaux et d’enseignes en kits standardisés (« IKEA des panneaux »).

> **Projet en phase d'initialisation**. Dépôt **public par choix explicite du cofondateur**. Ne jamais publier de données clients, de BAT réels, de clés ou de configuration sensible.

## Documentation de référence

- [design.md](design.md) — identité visuelle, expérience et principes UI.
- [roadmap.md](roadmap.md) — **miroir de lecture**, pas une deuxième roadmap canonique.
- [product.md](product.md) — parcours et règles métier validés.
- [architecture.md](architecture.md) — stack et frontières entre services.
- [security.md](security.md) — sécurité, accès et règles de publication.
- [AGENTS.md](AGENTS.md) — règles de travail pour les assistants et contributeurs.

**Source de vérité des décisions** : [roadmap Notion PANOKIT](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec).

## Organisation prévue

- `apps/web` : frontend Next.js, PANOKIT Studio React/SVG-first.
- `apps/api` : backend NestJS/TypeScript, commandes, prix et contrôle atelier.
- `packages/contracts` : contrats TypeScript partagés.
- `.github/workflows/ci.yml` : GitHub Actions, vérifications **sans déploiement**.

Les deux applications pourront être **testées sur Vercel DEV après GO explicite**. La production n'a **pas** d'hébergeur validé.

## Règle absolue

> Ni Vercel DEV ni Vercel PROD, ni autre déploiement, sans autorisation explicite. Les modifications à GitHub et l'exécution des tests ne valent pas autorisation de déployer.
