# J04-D1-A — PostgreSQL privé : candidat de migration

**État : PR de préparation uniquement. Pas de connexion à Supabase.**

- Les décisions C1/C2 B–F (accès PII, remboursements, rétention, commandes hors site, numérotation) restent **ouvertes** : rien n'est considéré approuvé.
- Le seul périmètre SQL proposé est `panokit_private` : `web_orders`, `provenance_records`, `order_events`, `production_jobs`, `transaction_outbox`.
- Enregistrement commande + provenance obligatoire à l'issue de la même transaction par FK cyclique différée ; origine toujours `PANOKIT_WEB` et non réécrivable par DML normal ; journaux append-only pour les comptes non propriétaires.
- Refus par défaut : aucun GRANT pour le public, aucune politique RLS qui donnerait un accès, aucun rôle usine SQL ; pas de PII, prix, marges, paiement ou BAT dans ce socle.
- La table des dossiers ne sait pas **autoriser la fabrication** : elle ne comporte que les statuts d'**examen technique**. L'acceptation technique n'est pas un feu vert de production.
- Un propriétaire / superutilisateur PostgreSQL peut contourner les triggers et le RLS ; les tests ne prétendent pas à une immutabilité cryptographique ni à une API NestJS sécurisée.
- Les tests exécutent cette migration uniquement sur un PostgreSQL 16 de GitHub Actions avec `panokit_j04_ci`, puis exécutent un rollback **interdit ailleurs**.
- **J04-D1-B reste à faire** : ajouter Drizzle ORM/Kit avec versions et lockfile épinglés, générer une migration cohérente depuis le schéma Drizzle et tester son application/rollback ; ce SQL initial est rédigé à la main, **pas généré par Drizzle**.
- **J04-D3 reste à faire** : authentification, guards NestJS, autorisations fines, RLS/GRANT contrôlés, transactions de confiance et test de fuites.

**Gate** : décision humaine sur C1/C2 avant adoption définitive ; aucune fusion, migration Supabase ni déploiement Vercel sans autorisation explicite et séparée.

[Roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec)
