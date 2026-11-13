# LOT 01 — Accueil PANOKIT (J02, en cours)

- **Référence** : dernier mockup PANOKIT approuvé, spécifications dans [design.md](../../design.md) et roadmap Notion canonique.
- **Branche** : `feat/lot01-accueil` ; **PR #2 brouillon**, J01 déjà fusionné dans `main` avec GO utilisateur.
- **Déjà intégré** : en-tête responsive, slogan noir/orange, six familles en grille 3×2, survol desktop / appui mobile, navigation catalogue provisoire.
- **Illustrations de référence** : `public/images/panokit-cards.webp`, atlas 3×2 des six illustrations **extraites du mockup d'origine**. Les SVG de structure ne servent plus que de repli si le WebP n'est pas chargé.
- **Provenance et limites** : la capture d'origine faisait 1254 × 1254 pixels. L'atlas est réduit à 1140 × 604 pixels pour l'interface. Il s'agit de **visuels de maquette compressés**, pas d'assets industriels ou d'images de fabrication haute résolution.
- **Comportement** : carte Enseignes soulignée comme dans le mockup ; ouverture des sous-familles au survol sur périphériques adaptés, à l'appui sur écran tactile ; fermeture au départ du pointeur.
- **Qualité** : vérifier la fidélité visuelle et le contraste sur de vraies captures de l'application en desktop/mobile, ainsi que clavier/focus, couleurs et comportements FR/AR/RTL.
- **Non inclus** : panier, devis fonctionnel, paiement, Studio, catalogue industriel, API métier connectée.
- **Gate avant fusion** : CI verte sur HEAD, asset chargé en HTTP 200, capture réelle desktop/mobile et revue humaine.
- **Aucun merge PR #2 ni déploiement Vercel (DEV ou PROD) sans autorisation explicite.**
