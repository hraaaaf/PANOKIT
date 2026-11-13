# PANOKIT — DESIGN (référence produit / UI)

**Statut :** cadrage fonctionnel et visuel validé en partie ; ce fichier n'est **pas** une maquette finale ni une preuve d'implémentation. Les arbitrages vivent dans la [roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec).

## Positionnement

**« Avoir son enseigne n'a jamais été aussi simple. »**

PANOKIT simplifie l'achat de panneaux et d'enseignes standardisés, personnalisables et livrables en **kits prêts à l'usage**. L'ambition : « l'IKEA des panneaux ». Le design doit communiquer **simplicité, professionnalisme, fiabilité industrielle et qualité premium**, sans ressembler à un éditeur graphique généraliste.

## Identité visuelle validée

- Marque : **orange, blanc et noir**.
- Illustrations : **dessin architectural premium à la main**, traits fins maîtrisés, perspectives cohérentes, matières crédibles, ombres et lumières douces.
- Pour les scènes illustrées : tons naturels **bleu pétrole/ardoise, vert sauge, pierre, bois** ; orange réservé surtout à l'identité de marque et aux interactions.
- Conserver la cohérence de perspective, d'épaisseur du trait et de traitement des matériaux entre illustrations.
- Accueil : **6 familles en grille 3 × 2 sur desktop** ; titres sous chaque illustration ; sous-catégories révélées par interaction adaptée au support (survol desktop, appui mobile).
- **Ne pas substituer des photos génériques** à la direction illustrative approuvée.
- Les codes HEX, familles typographiques, échelle d'espacement, rayons et animation restent **à définir** ; ne pas inventer une charte officiellement approuvée.

## Navigation / familles

1. **Enseignes** — lumineuses et non lumineuses.
2. **Drapeaux** — perpendiculaires, lumineux et non lumineux.
3. **Signalétique** — plaques, totems, chantier.
4. **PLV** — références à préciser.
5. **Impression** — vinyle, bâche, tissu.
6. **Habillage de façade** — perforé, plein (famille indépendante).

Pour **Enseignes → Lumineuses**, la galerie propose quatre modèles illustrés : lettres lumineuses frontales, lettres rétroéclairées à halo, caisson lumineux et néon LED flexible. La sélection passe directement au métier, sans imposer de fiche intermédiaire.

## PANOKIT Studio — pilote « caisson lumineux »

- **Conception guidée**, pas un clone de Canva. Formats catalogue prédéfinis : le sur-mesure n'est pas le comportement par défaut.
- Questions et **prévisualisation en direct**, puis **4 templates distincts** après collecte des informations essentielles : centré, logo à gauche, typographique et hiérarchisé.
- **Nom commercial obligatoire** ; métier et format hérités du parcours. Logo, slogan, téléphone et préférences couleur facultatifs.
- Activité professionnelle **visible par défaut et masquable** ; slogan et téléphone **masqués par défaut, activables à la demande**.
- **Français, arabe et mixte** pour le contenu ; attention au RTL, aux ligatures, aux polices adaptées et aux ratios.
- Deux aperçus synchronisés : **vue à plat** de référence + **façade standard illustrative**, avec bascule **Jour/Nuit**.
- Assistant **déterministe** en FR/AR : texte, couleur, police permise, logo, disposition bornée et changement de template ; action réversible immédiate avec **Annuler**. Pas de génération libre par IA.
- Un logo peu net peut être prévisualisé **tel quel**, avec avertissement **hors de l'enseigne** ; contrôle humain avant fabrication.
- Texte trop long : recomposer dans des limites de lisibilité puis proposer au client d'autres choix, **sans altérer son nom**.
- La simulation de façade **ne promet pas** un rendu photoréaliste, une luminosité ou des dimensions d'installation réelles.

## Qualité de livraison des écrans

- **Mobile first** sans sacrifier la clarté desktop ; interactions accessibles au clavier.
- Veiller aux contrastes, états de focus, tailles de cibles, navigation AR/RTL et faibles débits.
- Technologies validées : **Next.js/React, Tailwind CSS v4, shadcn/ui, Lucide React**.
- **Prototype SVG-first** à vérifier sur vrais fichiers, logos, scripts FR/AR, formats physiques et mobile.

### Checklist de preuve visuelle (à produire, pas réalisée)

- [ ] Accueil desktop + mobile conforme à la direction illustrée.
- [ ] Galerie des quatre modèles avec états de sélection.
- [ ] Studio : saisie progressive, quatre templates, FR/AR/bilingue.
- [ ] Rendu à plat + façade Jour/Nuit sur deux formats, avec/sans logo.
- [ ] État « logo à vérifier », débordement refusé, Annuler.
- [ ] Tests accessibilité, performances et revue avant/après.

**Ne pas confondre ces exigences validées avec des fonctionnalités déjà codées.**
