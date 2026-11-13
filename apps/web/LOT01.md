# J02 — Accueil PANOKIT (ancien LOT 01) — VISUELS AVANT FINALISATION

> **Correspondance :** J02 = jalon de la roadmap Notion, LOT 01 = ancienne étiquette d'implémentation de l'accueil, PR #2 = demande de fusion GitHub. Même chantier. **La roadmap canonique unique est Notion** : https://app.notion.com/p/41777c6633628195b96cdc442fae78ec

## Source d'art et contrat

- Lire d'abord [design.md](../../design.md), version « Croquis architectural PANOKIT » basée sur le nouveau visuel utilisateur `E94E87FD-C306-4949-BD8D-19C1247C991D.jpeg` daté du 13/11/2026.
- **Cible :** stylo/encre graphite, hachures d'étude, perspective architecturale trois-quarts, lavis léger, geste de pinceau et composition à sujet dominant. Ce choix concerne **les dessins** ; ne pas prétendre figer la palette de chaque produit.
- **7 images maîtres à produire/valider AVANT finalisation** : `ACC-HERO-01` et `ACC-CAT-01` à `ACC-CAT-06`. Les 6 pictogrammes `ACC-ICO-01` à `ACC-ICO-06` ont déjà une première traduction SVG, à vérifier face à la nouvelle référence.
- Différence à arbitrer : « Drapeaux » illustré par tissu suspendu sur la nouvelle référence vs enseigne drapeau perpendiculaire dans le catalogue prévu.
- Comparer **1 colonne vs 2 colonnes sur mobile** (320 / 375 / 390 / 414 px) avant de choisir. **Ne pas implémenter 2 colonnes sans validation de la maquette.**

## État réellement construit sur la PR #2

- [x] En-tête, slogan responsive sur 2 lignes mobile, galerie 6 familles, pages catalogue transitoires.
- [x] Six images WebP issues d'un **atlas recadré de capture**, pas des créations sources HD indépendantes.
- [x] Six pictogrammes SVG dédiés, CTA mobile réel « Voir les produits » et interactions souris / clavier / toucher.
- [x] CI et captures navigateur des anciens actifs : https://github.com/hraaaaf/PANOKIT/actions/runs/43518067659 et https://github.com/hraaaaf/PANOKIT/actions/runs/43518067630 (verts **pour l'ancien rendu**, pas preuve des nouvelles images).
- [ ] **V0** Confirmer le contenu des 7 scènes et la variante mobile.
- [ ] **V1** Produire la planche de propositions dans le style nouvellement retenu.
- [ ] **V2** Créer les 7 maîtres séparés, exploitables et optimisés pour le web.
- [ ] **V3** Comparer le dessin, les perspectives et les crops desktop/mobile ; vérifier les inscriptions.
- [ ] **V4** Obtenir le GO utilisateur **sur les visuels précis**.
- [ ] **D1** Réutiliser le code existant et remplacer les assets provisoires approuvés, sans refaire la logique inutilement.
- [ ] **D2** Nouvelle CI et nouvelles captures du rendu final, vérification responsive, FR/AR si page concernée, accessibilité.
- [ ] **D3** GO final pour la page et GO de **merge PR #2 distinct**.

## Hors périmètre J02

- Catalogue réellement industrialisé, formats usines, prix/devis, Studio, BAT et paiements non codés.
- Ne pas simuler un tunnel de commande opérationnel ; le bouton mobile pointe simplement vers les familles.
- Aucun déploiement Vercel DEV/PROD, aucun merge sans GO explicite.

**GOAL :** respecter la direction artistique réelle de la nouvelle image avant de clore l'accueil. **SUCCESS :** 7 images distinctes approuvées, rendus vérifiés, validations tracées dans Notion. **PROOF :** images masters + comparatifs + CI sur le code intégrant les nouveaux masters.
