# J04-D1-B — Schéma Drizzle typé, sans accès Supabase

**Candidat en PR DRAFT empilée sur D1-A. Aucun schéma réel ni
permission métier n'a été approuvé(e).** Choix B–F en suspens.

## Source testée

- `src/db/j04.schema.ts` : 5 tables minimales privées, sans PII/prix
  ni possibilité de libération fabrication.
- `drizzle.config.ts` : génération locale, sans credentials DB.
- `db/drizzle-generated/0000_j04_private_registry.sql` et `meta/` :
  **vrais fichiers Drizzle Kit générés** avec `drizzle-orm@0.45.4` et
  `drizzle-kit@0.31.11` épinglés dans `pnpm-lock.yaml`.
- `db/migrations/0002_j04_security_overlay.sql` : protections DML,
  origine, FK différée (provenance au commit), RLS deny-by-default,
  REVOKE et journal append-only, absentes de la génération Drizzle.
- `db/scripts/test-migration.sh` : applique **le SQL généré**, puis
  l'overlay, sur `panokit_j04_ci` uniquement ; teste 11 refus et la
  suppression de la fixture. SQL du jalon D1-A `0001_j04_private_registry.sql`
  est conservé comme preuve historique : **ne pas l'appliquer en plus**,
  sinon doublon des tables. Seul le couple Drizzle + overlay est testé ici.
- Workflow `J04 Drizzle isolated proof` : PostgreSQL 16 éphémère,
  `pnpm install --frozen-lockfile`, `drizzle-kit check`, génération sans
  dérive et test SQL. **Aucun déploiement ni lien Supabase.**

## Limites bloquantes

Les contraintes DML/trigger sont contournables par le propriétaire
PostgreSQL ; les politiques RLS sont volontairement absentes, donc
pas de GRANT applicatif. La future API NestJS doit authentifier
l'utilisateur, recalculer les prix et valider BAT, rôles et
autorisations sous transaction. Ni le code testé ici ni les tests
PG ne prouvent la sécurité d'une application connectée.

**NEXT :** approbation C1/C2 B–F, revue de sécurité et restauration
sur base isolée ; aucun merge, migration Supabase ou Vercel sans GO distinct.

[Roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec)
