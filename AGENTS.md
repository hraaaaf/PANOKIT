# PANOKIT — Instructions pour assistants de développement

Ce fichier guide les assistants et contributeurs. Il n'autorise **aucune action non demandée**.

## Boussole unique

1. Lire les exigences pertinentes de `design.md`, `product.md`, `architecture.md` et `security.md`.
2. Pour les décisions, consulter la **roadmap Notion canonique** : https://app.notion.com/p/41777c6633628195b96cdc442fae78ec.
3. `roadmap.md` est un **miroir résumant Notion**, pas une seconde source de vérité ; ne pas le traiter comme une validation autonome.
4. Après une décision ou un jalon exécuté, **mettre à jour la même page Notion** avec cases à cocher, GOAL / SUCCESS / PROOF, preuves, statut et prochaine action ; relire pour vérifier.

## Reporting utilisateur — pilotage rapide (règle du 14 novembre 2026)

- **Réponse par défaut : 3 à 5 tirets, jalons ou un schéma concis**, consacrés uniquement à ce qui est terminé, au résultat, au blocage majeur et au **Next**.
- Ne pas envoyer de rapport technique complet, journal de tests, série de captures, fichiers ou multiples liens **sans demande explicite**. Une vidéo ou un visuel n'est présenté que s'il aide à décider ou s'il est demandé.
- Conserver tous les détails **GOAL / SUCCESS / PROOF**, checkboxes, commits, tests et décisions dans **l'unique roadmap Notion canonique**, à vérifier après chaque exécution ; communiquer au plus un lien utile quand nécessaire.
- Finir brièvement par **PANOKIT → lot → sous-lot → statut / Next**, avec PR et run GitHub seulement s'ils existent et sont utiles. Recommander l'effort GPT en une courte mention.
- **Ne pas sacrifier les alertes importantes** : risque, sécurité, blocage et besoin de GO distinct pour merge, migrations ou déploiement Vercel doivent rester explicites.

## Qualité et exécution

- Privilégier des changements **petits, contrôlables et testables** sur une branche ; pas de merge automatique sans validation humaine.
- Pour toute tâche : énoncer **GOAL**, **SUCCESS**, **PROOF** ; produire les liens de commits/PR et logs de tests, jamais annoncer « vert » sans le constater.
- Pour UI : conserver l'identité visuelle validée, documenter **captures avant/après**, vérifier desktop, mobile, français, arabe et RTL.
- Pour les commandes : provenance web et registres commerciaux **auditables**, back-office sous contrôle PANOKIT ; accès usine limités à ses dossiers autorisés.
- Pour Studio : prototype SVG-first avec contrôle industriel et sécurité des logos, pas d'éditeur libre ou de génération IA non validée.
- Conserver la séparation API NestJS / frontend Next.js, le monorepo pnpm, et les choix Supabase retenus.
- Ne pas inventer de tarifs, de formats fabricants, de métriques, de résultats de tests, ni de décisions.
- Ne jamais committer de secrets, données clients ou pièces contractuelles dans le dépôt public.

## Déploiements

**Interdiction absolue de déployer sur Vercel sans autorisation explicite**, même en DEV. Le choix Vercel pour le développement n'est pas un GO pour publier. Hébergement de production non décidé. Aucun workflow GitHub Actions de déploiement avant validation.

## Discipline documentaire

Lorsqu'un fait contredit une vieille note, consigner la **correction datée** dans Notion ; ne pas effacer silencieusement l'historique. Mettre à jour le miroir Markdown uniquement après la source canonique. Utiliser des checkboxes marquant distinctement les **décisions validées** et les **preuves non réalisées**.
