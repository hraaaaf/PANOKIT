# PANOKIT — ROADMAP (miroir de lecture GitHub)

> **IMPORTANT — SOURCE CANONIQUE UNIQUE** : [🧭 Roadmap Notion PANOKIT](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec). Les décisions et leurs checkboxes sont **mises à jour d'abord dans Notion**. Ce fichier est une synthèse pour GitHub et les sources du projet. S'il y a divergence, **Notion prévaut**. Ne pas créer une deuxième roadmap maîtresse.

**Point d'arrêt : 13/11/2026.**

## Jalons de cadrage

- [x] **J01 — Identité / accueil** : direction premium orange/blanc/noir, illustration architecturale, 6 catégories. Maquette cible statique provisoire.
- [ ] **J02 — Catalogue industriel** : six familles établies ; quatre enseignes lumineuses et standardisation validées ; formats exacts, kits, composants, coûts et capacités de l'usine partenaire à confirmer.
- [x] **J03 — Métier** : listes V1 profession libérale / commerce et « Autre à préciser ».
- [x] **J04 — Studio pilote caisson** : parcours, 4 templates, aperçu à plat et façade Jour/Nuit, FR/AR, assistant déterministe, contrôles logo ; **spécification validée, pas logiciel livré**.
- [x] **J05 — Prix / livraison** : prix TTC immédiat et modifiable par l'admin ; transport facultatif par zones ou kilomètres, plusieurs dépôts ; **livraison hors zone sur demande supprimée**.
- [x] **J06 — Commande / BAT** : checkout invité, accord visuel, contrôle technique avant fabrication, BAT révisé si changement visible ; WhatsApp consentement + SMS OTP.
- [ ] **J07 — Back-office / exploitation** : droits, audit complet des commandes web, production, rapprochement financier, documents et support à spécifier.
- [x] **J08 — Choix de stack** : Next.js/React, Tailwind CSS v4, shadcn/ui, Lucide, NestJS/TypeScript, Drizzle, Supabase PostgreSQL/Storage/Auth ; monorepo pnpm ; Vercel **DEV uniquement en cible**, sans autorisation de déployer ; PROD à définir.
- [ ] **J09 — Développement et preuves** : initialisation du dépôt public/CI en cours ; aucun prototype métier démontré ni déployé.

## Règles stratégiques non négociables

- [x] **« IKEA des panneaux »** : produits/kits standardisés, avec personnalisation de contenu et non dimensions arbitraires.
- [x] **Usine du cofondateur industriel**, et non propriété exclusive du cofondateur du canal digital.
- [x] **Droits économiques du cofondateur digital limités aux commandes issues du site** ; registre PANOKIT indépendant et contrôlable, provenance, audit, reporting de rapprochement.
- [x] **B2B et B2C** ; revendeurs prioritaires au lancement mais site ouvert aux clients directs.
- [x] **Tarif V1 identique** revendeur/client direct ; pose optionnelle, hors prix standard et étudiée séparément.
- [x] **Pas de déploiement Vercel sans GO explicite**, y compris DEV. Aucune décision PROD prise.

## Prochaines tâches d'exécution

- [ ] **P0 — Repository** : créer arborescence monorepo, configuration pnpm, applications Next.js/NestJS et contrats.
- [ ] **P0 — CI** : GitHub Actions typecheck, lint, tests, builds ; verrouiller le lockfile, valider les jobs avec liens de preuve.
- [ ] **P0 — Contrôle commercial** : schéma PostgreSQL des commandes, identifiant et provenance web, droits commerciaux vs usine, historique append-only et exports.
- [ ] **P0 — Atelier usine / kits** : nomenclature et packaging du caisson, format export, temps/coûts, qualité, politique d'installation.
- [ ] **P0 — Prototype Studio** : SVG caisson, composants FR/AR/bilingues, versions du BAT, sécurité des logos, démonstration mobile/desktop.
- [ ] **P0 — Checkout** : paiement/facturation Maroc, calcul TTC, livraison avant paiement, droits et validation BAT.
- [ ] **P0 — DEV** : obtenir GO distinct avant tout déploiement Vercel, vérifier API serverless ; **PROD différée**.
- [ ] **P1 — Extensions** : autres modèles de panneaux, catégorie Habillage de façade et règles propres.

## GOAL / SUCCESS / PROOF

**GOAL :** démontrer une première commande caisson lumineux standard, du catalogue jusqu'à un dossier atelier traçable.

**SUCCESS :** le client conçoit, voit son prix, valide et commande ; PANOKIT garde la preuve d'origine et de ses droits ; l'usine ne reçoit que l'ordre pertinent.

**PROOF attendue (aucune preuve de fonctionnement métier à ce jour) :** lien PR/commit, CI verte, captures avant/après, tests droits et tarifs, parcours E2E et export de fabrication, revue humaine avant merge.

**Synchronisation :** à chaque décision matérialisée, consigner le résultat et ses preuves dans la page Notion canonique, puis mettre à jour ce miroir Markdown lors des checkpoints Git.
