# PANOKIT — Roadmap en 16 jalons (miroir GitHub)

> **SOURCE DE VÉRITÉ UNIQUE :** [🧭 Roadmap Notion PANOKIT](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec). Ce fichier n'est qu'un résumé versionné pour les contributeurs et les Sources du projet. **En cas de divergence, Notion prévaut.** Les décisions et validations humaines se consignent d'abord dans Notion.

**Découpage J00–J15 validé explicitement le 13 novembre 2026.** Le MVP de référence est une **commande complète de caisson lumineux rectangulaire en kit** : catalogue standard → Studio → devis/prix → commande invitée → BAT → fabrication. Les six familles sont visibles dès l'accueil, mais toutes ne sont pas encore commercialisables.

## Tableau des jalons

**Légende :** `[x]` = jalon clos avec preuve ; `[ ]` = jalon incomplet, même si des spécifications sont validées.

### Phase A — Fondations et gouvernance

- [x] **J00 — Vision, gouvernance et documentation.** Modèle « IKEA des panneaux », architecture ciblée et six fichiers Markdown disponibles ; Notion est la roadmap canonique. **Statut : cadrage initial terminé.**
- [ ] **J01 — Monorepo, CI et reproductibilité.** Next.js, NestJS, contrats partagés, GitHub Actions, lockfile pnpm figé, contrôles et revue humaine. **Statut : en cours**. [PR #1](https://github.com/hraaaaf/PANOKIT/pull/1).

### Phase B — Vitrine et catalogue

- [ ] **J02 — Design system et accueil.** Reproduire fidèlement le dernier mockup validé : six illustrations premium, grille 3×2, interactions desktop/mobile, accessibilité, comparaison avant/après. **Statut : en cours** ; [PR #2](https://github.com/hraaaaf/PANOKIT/pull/2).
- [ ] **J03 — Catalogue et standardisation industrielle.** Familles, quatre enseignes lumineuses, caisson pilote, formats et composants réels confirmés par l'usine.

### Phase C — Commerce et personnalisation

- [ ] **J04 — Base de données, rôles et provenance des commandes.** Supabase PostgreSQL/Drizzle, audit, identité `PANOKIT_WEB`, séparation PANOKIT/usine, tests de fraude.
- [ ] **J05 — PANOKIT Studio SVG-first.** Quatre templates, vue à plat/façade Jour-Nuit, FR/AR, logo contrôlé, moteur de personnalisation guidé.
- [ ] **J06 — Prix, devis et livraison.** Prix TTC serveur et modifiable par admin, options, livraison zone/distance, installation séparée.
- [ ] **J07 — Commande invitée et paiement.** Nom/téléphone, consentement visuel, transaction fiable, prestataire Maroc à choisir.
- [ ] **J08 — BAT et validation.** Contrôle atelier, versions, OTP SMS, refus/expiration, accord explicite en cas de modification visible.

### Phase D — Exploitation et ateliers

- [ ] **J09 — Dossier atelier et fabrication.** Export industriel, composants de kit, fichiers privés, transmission au partenaire, test réel.
- [ ] **J10 — Back-office et rapprochement du canal web.** Droits distincts, reporting ventes PANOKIT, audit financier indépendant.
- [ ] **J11 — Notifications et suivi.** WhatsApp avec consentement, SMS de secours, suivi commande, assistant déterministe FR/AR.

### Phase E — Qualité et lancement

- [ ] **J12 — Sécurité et résilience.** Protection des données, contrôle des accès, imports de fichiers, sauvegardes, contraintes serverless.
- [ ] **J13 — Tests E2E, qualité visuelle et accessibilité.** Scénarios du caisson jusqu'à l'usine, preuves, captures, revue.
- [ ] **J14 — Démonstration Vercel DEV.** Deux applications séparées. **Jamais de déploiement sans GO explicite**, même DEV.
- [ ] **J15 — Choix PROD et lancement.** Hébergement de production non décidé ; plan de lancement pilote, GO distinct requis.

## Garde-fous

- Chaque jalon exige **GOAL / SUCCESS / PROOF**, résultats CI et revue humaine avant clôture.
- **Le fait d'avoir validé les spécifications pendant l'onboarding ne signifie pas que les fonctionnalités sont codées.**
- Respecter les règles commerciales : droits du cofondateur digital limités aux **commandes issues du site PANOKIT**, registre vérifiable distinct des autres commandes usine.
- Dépôt GitHub **public par choix de l'utilisateur** : aucun secret, fichier client, logo réel ou BAT sensible ne doit y être ajouté.
- **Aucun merge automatique, aucun déploiement Vercel sans autorisation explicite.** PROD à décider plus tard.
- Les captures avant/après sont requises pour les livraisons visuelles.

## Prochaine action

**J01 d'abord**, avec lockfile pnpm, installation `--frozen-lockfile`, CI verte sur la tête de PR #1 et revue humaine ; **J02** ensuite pour intégrer les véritables assets du mockup dans la PR #2. La source Notion est prioritaire lors de tout avancement.

**Ne pas créer une deuxième roadmap canonique dans GitHub ou dans un autre document.**
