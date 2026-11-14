# J04-D3-B2 — API/SQL authorization candidate

GOAL : lire membership actif, révocation, usine et affectation d'un dossier depuis PostgreSQL, jamais depuis le client.

- [x] Interface SQL read-only, paramètres SQL liés et requêtes limitées au dossier demandé.
- [x] Schéma candidat membership, RLS et rôle dédié sans LOGIN, privilèges SELECT restreints aux colonnes.
- [x] Tests négatifs écrits : inter-usines, révocation, affectation, panne DB et injection.
- [ ] CI confirmée sur HEAD (à vérifier).
- [ ] PostgreSQL 16 jetable exécutant le schéma Drizzle PR #7 + overlay 0003.
- [ ] Adaptateur de connexion, credentials, JWKS de confiance, route HTTP NestJS, tests E2E.
- [ ] Migration Supabase, fusion et déploiement Vercel : NON AUTORISÉS.

PR #9 est empilée sur #8/#5, alors que le schéma Drizzle est dans PR #7. L'overlay est une proposition conditionnelle, jamais appliquée à une base réelle. Le guard reste non connecté ; aucune API usine n'est activée.

SUCCESS : contrat d'accès PostgreSQL préparé et testable ; aucun accès opérationnel.
PROOF : commit et CI à relever après exécution.
