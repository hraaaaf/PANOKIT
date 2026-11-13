# PANOKIT — DESIGN.md | Direction artistique, visuels et écrans

**Statut :** spécification visuelle de référence pour le chantier ; choix de dessin demandé le 13 novembre 2026. Les visuels et les écrans restent soumis à validation humaine individuelle.

**Sources de vérité :**
- **Ce fichier** définit le style illustratif, les scènes attendues, les actifs à produire et les critères de qualité.
- La [roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec) définit l'ordre des jalons, leurs cases à cocher et les GO humains.
- product.md définit les parcours et les modèles vendables ; architecture.md / security.md régissent les contraintes techniques et de sécurité.
- GitHub contient les fichiers et le code, **pas une seconde roadmap canonique**.

**Référence maîtresse pour les DESSINS :** image utilisateur **E94E87FD-C306-4949-BD8D-19C1247C991D.jpeg**, envoyée dans le projet le 13/11/2026. Elle montre l'accueil PANOKIT avec un grand croquis de façade en haut à droite et six cartes de catégories. À préserver comme référence de conversation ; ne pas présumer de droits de publication du fichier source dans le dépôt public.

## 1. Signature graphique exacte — « croquis architectural PANOKIT »

Le dessin est l'élément distinctif de la marque. Il doit donner l'impression d'une **planche d'architecte commercial haut de gamme, colorisée avec retenue**, pas d'une photographie ordinaire, d'un rendu 3D lisse ni d'une illustration publicitaire générique.

1. **Trait** : contours à l'encre noire ou graphite, francs mais fins ; épaisseurs légèrement variables, traits d'étude visibles, hachures de construction et lignes de fuite discrètes. Ne pas entourer chaque objet de gros contours de bande dessinée.
2. **Perspective** : principalement **trois-quarts et deux points de fuite** pour façades, caissons, totems et supports ; construction crédible, verticale stable, bonne épaisseur des volumes. Les produits doivent rester identifiables.
3. **Matières** : vitres évoquées par reflets au trait, métal par surfaces nettes et arêtes, bâche ou vinyle par courbure et texture de rouleau, éclairage par touches de lumière plausibles. Détails industriels crédibles, sans inventer de fixation ou de performance garantie.
4. **Traitement artistique** : croquis architectural + lavis très léger + **gestes de pinceau obliques et rapides autour du sujet** ; un fond papier blanc cassé/pierre clair, non texturé de façon envahissante ; ombrages doux, quelques hachures de sol.
5. **Composition** : un **sujet principal unique et lisible**, décor secondaire minimal (plante, trottoir, vitrine ou structure architecturale). Beaucoup d'espace respirant ; détails au service du produit. Ne pas répéter une composition identique avec un autre titre.
6. **Hiérarchie** : le produit et sa forme passent avant l'effet graphique ; une touche dynamique accompagne le dessin, jamais ne le masque.
7. **Cohérence** : même famille de traits, niveau de détail, densité d'ombrage, perspective et traitement de la végétation sur toute la bibliothèque.

**Important :** ce choix concerne prioritairement **le style des DESSINS**. Il ne fige pas la couleur de chaque produit ni la charte UI. La marque conserve son univers orange, blanc et noir ; les nuances de fonds et de matières seront validées séparément. **Ne pas remplacer le style par des scènes bleu pétrole/vert sauge issues de l'ancienne direction.** La végétation peut rester discrète.

### À proscrire

Photographie stock, photomontage réaliste brut, rendu 3D plastique, image « IA » avec lettres déformées, objets flottants, mauvaise perspective, matériaux impossibles, décor chargé, personnages obligatoires, scène abstraite où le support n'est pas identifiable, variation de style entre catégories, texte arabe fantaisiste, logo PANOKIT altéré.

### Textes dans les images

Le texte commercial, les noms d'enseignes, les prix et les mentions légales sont idéalement **composés par l'interface HTML/SVG**, pas incrustés irréversiblement dans une image générée. La référence montre « PANOKIT » et « P » : leurs réutilisations nécessitent un contrôle manuel. Ne jamais inventer de noms de commerces, allégations ou tarifs dans un visuel. Le rendu final du client dans Studio/BAT provient de **ses données réelles**.

## 2. Contrat de production « VISUEL D'ABORD »

**Règle obligatoire avant de coder une NOUVELLE PAGE ou une refonte visuelle :**

- [ ] **V0 — Fiche écran** : but de la page, contenu issu de product.md, liste des composants et identifiants de visuels, formats desktop/mobile, états à montrer.
- [ ] **V1 — Direction et composition** : moodboard utilisant la référence ci-dessus, composition/placement, croquis ou proposition de visuels, **sans développement de cette nouvelle page**.
- [ ] **V2 — Production des assets** : images individuelles dans le style PANOKIT ; les états nécessaires d'une même illustration sont prévus. Pas de fichier maître fabriqué à partir d'un simple crop de capture si une source propre est nécessaire.
- [ ] **V3 — Contrôle visuel** : cohérence des traits, produit correct, perspective, lisibilité aux tailles réelles, absence de texte erroné ; comparaison côte à côte, miniatures mobile et desktop.
- [ ] **V4 — GO humain VISUELS** : approbation des visuels exacts de cette page avec leur version/identifiant ; refus ou corrections à tracer dans Notion.
- [ ] **D1 — Code de la page** : seulement ensuite intégration React, interactions, responsive, accessibilité et branchement au produit réel.
- [ ] **D2 — PROOF** : capture application desktop/tablette/mobile, contrôle clavier/tactile, performance, contrôle des assets et tests CI.
- [ ] **D3 — GO humain de la PAGE**, puis GO **distinct** avant merge. **Aucun déploiement Vercel** sans autorisation explicite, y compris DEV.

**Exception cadrée :** une infrastructure sans rendu graphique (schéma DB, API, sécurité, CI) ne nécessite pas d'images décoratives. Ses **écrans** futurs, en revanche, passent par V0–V4 avant leur codage. L'obligation ne s'applique pas rétroactivement aux commits existants : les visuels provisoires de J02 devront être réévalués, **sans réécrire gratuitement tout le code**.

Un mockup ou une image validée ne prouve pas que la fonction est codée. Une CI verte ne valide pas la direction artistique. Une illustration marketing ne constitue pas un plan technique de fabrication.

## 3. Dossier / registre des assets

**Convention conseillée :** apps/web/public/visuals/{page}/{ID}.webp pour images optimisées, et sources maîtres indépendantes éditables à conserver hors du dépôt public si elles sont sensibles. SVG seulement pour pictogrammes / illustrations réellement vectorielles ; les logos clients et BAT vont en stockage privé.

Pour tout asset : **ID | écran | description exacte | ratio/zone de recadrage | source/version | statut (à créer, proposé, visuel approuvé, intégré, vérifié) | preuve / validation**. Une image utilisée sur deux pages garde le même ID source ; une nouvelle composition obtient un autre ID.

**Formats cibles à confirmer à la conception** : grand hero horizontal (desktop) avec variante/composition mobile ; cartes plutôt 5:4 ou proches ; vignettes de sélection 4:3 ; SVG pour petits pictogrammes ; fonds de simulation Studio indépendants du contenu client. Les résolutions finales sont à fixer selon l'utilisation réelle, pas d'upscale systématique de JPEG compressés.

### A — Accueil : 7 compositions prioritaires + 6 pictogrammes

| ID | Visuel exact demandé | Cadrage / composition |
| --- | --- | --- |
| ACC-HERO-01 | Façade de boutique contemporaine en **perspective trois-quarts**, enseigne rectangulaire PANOKIT au-dessus d'une vitrine, lettre volumétrique lisible, quelques suspensions intérieures et une plante discrète ; lignes d'architecte esquissées et mouvement de pinceau en arrière-plan. | Sujet à **droite** sur desktop, zone de respiration à gauche pour l'accroche HTML ; variante mobile sans collage ni visage. |
| ACC-CAT-01 | **Enseignes** : gros plan de l'angle d'une boutique, caisson frontal rectangulaire sur bandeau, lettres PANOKIT et sous-face avec petites lumières, vitrage dessous ; quelques traits et une plante, comme la carte n°1 de référence. | Format carte, caisson dominant, vue trois-quarts. |
| ACC-CAT-02 | **Drapeaux** : mât / console métallique verticale avec panneau souple rectangulaire suspendu et tendu, marquage simple « P », tissu dessiné en mouvement ; geste graphique en arrière-plan. | Format carte, produit entier dans le cadre. **Attention :** le croquis marketing ressemble à un drapeau textile, tandis que le catalogue produit parle d'enseignes drapeaux perpendiculaires ; NE PAS faire passer ce visuel pour une fiche technique sans arbitrage produit. |
| ACC-CAT-03 | **Signalétique** : totem directionnel haut avec tête « P » et trois niveaux de flèches « Accueil / Bureaux / Parking », cheminement, plantes en second plan ; lettrage final propre. | Format carte, totem au centre/droite, perspective crédible. |
| ACC-CAT-04 | **PLV** : stop-trottoir / chevalet autoportant type A, toile ou face verticale rectangulaire marquée d'un P, pied et charnière visibles, plante sur le côté. | Format carte, chevalet complet, non confondu avec enseigne de façade. |
| ACC-CAT-05 | **Impression** : rouleau blanc de vinyle ou support souple en volume, extrémité déroulée vers la droite et tracé dynamique suivant la courbure ; mandrin intérieur apparent. | Format carte, zoom matière et déroulement, pas une presse d'imprimerie. |
| ACC-CAT-06 | **Habillage de façade** : bâtiment commercial moderne d'angle, vitrage au rez-de-chaussée, panneaux perforés sur une partie de la façade haute, structure portante nette et quelques arbres esquissés. | Format carte, architecture trois-quarts, trame perforée lisible. |

**ACC-ICO-01 à ACC-ICO-06** : six pictogrammes simples inspirés des silhouettes en bas de la référence : enseigne sur pied, drapeau, poteau directionnel, chevalet, imprimante, trois panneaux superposés. Ils **ne remplacent pas** les grands dessins ; préférer des SVG traçables et accessibles.

**Statut au 13/11/2026 :** six illustrations ont été extraites sous forme d'**atlas WebP de capture** dans la PR #2 ; six pictogrammes ont été codés en SVG et les tests navigateur sont verts. Ces fichiers sont des **actifs provisoires dérivés d'un screenshot**, **pas les sept compositions maîtres indépendantes créées et approuvées**. La nouvelle référence utilisateur impose une revue des images. **Aucune nouvelle génération de ces sept images n'est prétendue ici.**

**Responsive accueil :** 3 cartes par ligne sur grand écran ; variante **2 cartes par ligne sur téléphone à comparer avec 1 colonne**, notamment à 320/375/390/414 px. La version 2 colonnes est une **hypothèse UX non encore approuvée**, pas une décision codée. Les sous-catégories doivent rester utilisables au toucher, sans carte illisible. Accroche mobile sur **2 lignes** et CTA réel « Voir les produits » déjà vérifiés ; pas de faux formulaire de devis.

### B — Choix des produits et catalogue : scènes à produire avant les pages J03

| ID | Visuel exact |
| --- | --- |
| CAT-ENS-01 | Lettres lumineuses **frontales** montées sur un véritable bandeau de boutique, lumière depuis la face ; volume et fixation crédibles. |
| CAT-ENS-02 | Lettres **rétroéclairées à halo** devant mur clair, lumière projetée autour de chaque lettre, dessin technique crédible. |
| CAT-ENS-03 | **Caisson lumineux rectangulaire** à façade plane et profil visible, installé sur devanture, sans lui attribuer de dimensions non confirmées. **Pilote MVP.** |
| CAT-ENS-04 | **Néon LED flexible** dessinant une forme/typographie commerciale simple et correctement soutenue ; ne pas inventer de caractéristiques techniques. |
| CAT-DRP-01 | Enseigne drapeau **perpendiculaire à la façade**, console et épaisseur visibles : premier produit à illustrer une fois validé industriellement. |
| CAT-SIG-01 | Totem signalétique directionnel, flèches nettes et pose crédible. |
| CAT-PLV-01 | Chevalet / stop-trottoir vu de trois-quarts, pieds visibles ; catalogue exact à confirmer. |
| CAT-IMP-01 | Rouleau de vinyle ou bâche avec coupe et matière visibles ; catalogue exact à confirmer. |
| CAT-HAB-01 | Vue d'une façade commerciale avant/après pose de panneaux ; panneaux pleins ou perforés selon l'article confirmé. |

**Pour chacune des six familles :** l'illustration de l'accueil peut servir de repère, mais une nouvelle page de catégorie exige **une proposition de mise en page + un visuel d'en-tête dédié si nécessaire**, avant codage. Les modèles supplémentaires, formats et matériaux ne sont pas considérés comme validés par ce tableau ; ils requièrent le retour de l'usine et les choix de product.md.

### C — Étape « Métiers » et sélection du format

**MET-01** : planche de façade **commerce** contextualisée, enseigne lisible, scène à la manière du croquis architectural de référence.  
**MET-02** : planche d'entrée de **profession libérale**, façade/bâtiment cohérent, produit visible sans supposé réglementaire.  
**MET-AUTRE** : état neutre pour « Autre » sans faire croire à une profession. Les métiers détaillés (cabinet dentaire, pharmacie, restaurant, etc.) ne deviennent des visuels distincts **qu'après validation de la liste réellement proposée**.

**FMT-01** : diagramme **vectoriel coté** du caisson, face + profil, zones de cote et fixation affichées à partir de données fabricant **confirmées** ; aucune valeur inventée. Ce diagramme n'est pas une scène d'ambiance générée.

### D — PANOKIT Studio J05 : illustrations fixes et rendus dynamiques

**STU-ENV-01** : **façade générique** dessinée dans le style architectural de référence, cadrée pour recevoir de manière crédible un caisson configurable. Prévoir état **Jour** et état **Nuit**, sans prétendre simuler exactement les lumens réels.

**STU-TPL-01 à STU-TPL-04** : planches **de présentation** des quatre templates du caisson : (01) centré, (02) logo à gauche, (03) typographique, (04) hiérarchisé. L'interface doit calculer les aperçus **réels en SVG** à partir du nom commercial, de la langue FR/AR et des options client. Ces quatre planches ne sont **pas** des images finales figées insérées à la place du moteur.

**STU-STATE-01** : illustration discrète « importer un logo ».  
**STU-STATE-02** : état d'aide « qualité logo à vérifier », sans modifier l'image téléchargée.  
**STU-STATE-03** : aide « texte trop long / adaptation à approuver ».  
**STU-STATE-04** : état « aperçu prêt à confirmer ».  

Livrer les états et leurs copies FR/AR/RTL ; ne pas générer de logos de clients fictifs destinés à une vraie commande.

### E — Devis, paiement, BAT, fabrication, suivi : écrans et visuels conditionnels

| ID | Écran / rôle visuel |
| --- | --- |
| DEV-01 | Récapitulatif du kit/devis : miniature du **vrai produit configuré** (SVG ou vue de scène) + texte de prix calculé par API, jamais dans l'illustration. |
| CHK-01 | Confirmation commande invitée : petite scène de colis/kit PANOKIT facultative, puis état de paiement / erreur **piloté par données réelles**. |
| BAT-01 | Attente BAT : état visuel sobre avec aperçu du **BAT privé versionné**. |
| BAT-02 | BAT approuvé / refusé / expiré : pictogrammes et états contrôlés par les règles métier, pas par de simples images. |
| FAB-01 | Kit en fabrication : dessin d'atelier montrant les composants du caisson, **seulement après validation avec l'usine**. |
| SUI-01 | Suivi : états de progression et livraison/retrait représentés par pictogrammes cohérents ; données réelles prioritaires. |
| ADM-01 | Back-office : priorité à la lisibilité du tableau et aux informations, **aucune illustration décorative obligatoire**. |

Ces IDs sont des **besoins de conception par écran**, pas la commande de produire dès aujourd'hui 100 images. Les illustrations d'état ne doivent jamais remplacer la preuve d'approbation du BAT, une facture ni un dossier atelier.

## 4. Dossier de validation de chaque page / jalon

Avant une PR de nouvelle page :

1. **Fiche VISUELS de la page** dans la **même roadmap Notion**, avec cases V0–V4 ; identifiants ci-dessus et candidats étiquetés.
2. **Vignettes contact sheet** pour comparer les propositions sans changer le style ; examiner à la taille de rendu réelle, sur fond clair, en grille.
3. **GO humain explicite sur les dessins** retenus et leur composition mobile/desktop. Tracer numéro de version et décision dans Notion.
4. **Intégration React** et tests uniquement après approbation graphique ; captures d'application et preuves de comportement.
5. **Révision indépendante** : cohérence 6 familles, perspective, texte, responsive, contrastes, performances, absence de promesses industrielles non vérifiées.
6. **GO de clôture du jalon et GO de merge séparé**. Un GO des visuels n'autorise ni fusion ni déploiement.

### Définition de « visuel accepté »

- [ ] Le produit représenté correspond exactement à la famille annoncée.
- [ ] Le dessin conserve le trait architecte à l'encre, la perspective et le mouvement graphique de la référence.
- [ ] Aucun nom, texte, prix, dimension ou matériau inventé.
- [ ] Variante/cadrage mobile lisible ; états interactifs spécifiés.
- [ ] Qualité des fichiers suffisante pour l'usage web ; masters préservés et optimisés (WebP/AVIF si pertinent).
- [ ] Prévisualisation et **GO humain** consignés dans **Notion** avec preuve.

## 5. Application immédiate au jalon J02 (accueil)

**Correspondances :** J02 = jalon canonique « Design system et accueil » ; **LOT 01 — Accueil** = ancienne étiquette du lot de travail ; **PR #2** = pull request GitHub. **Ce ne sont pas trois chantiers différents.**

- [x] Structure Next.js et interactions existantes ; premiers contrôles desktop/mobile et CI réussis sur PR #2.
- [x] Choix du **style de dessin de la nouvelle image du 13/11/2026** comme référence du chantier.
- [ ] **J02-V0** : vérifier la liste de 7 scènes + 6 icônes, y compris le conflit possible sur le visuel « Drapeaux ».
- [ ] **J02-V1** : présenter une planche de style et une proposition de composition 1 colonne / 2 colonnes sur mobile.
- [ ] **J02-V2** : créer ou obtenir les images maîtres indépendantes **ACC-HERO-01 + ACC-CAT-01 à 06** dans le style retenu.
- [ ] **J02-V3** : tester recadrage, lisibilité, qualité et cohérence des sept compositions.
- [ ] **J02-V4** : **GO visuel utilisateur**, explicite et documenté ; après ce GO, remplacer les illustrations provisoires de l'interface quand nécessaire.
- [ ] **J02-D2** : captures de la version intégrée, desktop/tablette/mobile, contrôles CI ; anciens runs ne suffisent pas à certifier les **nouvelles images non encore créées**.
- [ ] **J02-D3** : clôture Notion et **GO de fusion PR #2 distinct**.

**Aucune validation des assets maîtres, aucun merge ni déploiement ne doivent être présumés à la lecture de cette spécification.**
