# PANOKIT — SÉCURITÉ ET PUBLICATION

**Dépôt GitHub PUBLIC à la demande de l'utilisateur.** Cette visibilité **ne donne aucune autorisation** d'exposer les données commerciales, données clients, documents privés ou secrets.

## Interdictions

- [x] Aucun `.env`, clé API secrète, jeton Supabase `service_role`, mot de passe, secret Vercel, numéro personnel, BAT réel ou fichier client dans GitHub.
- [x] **Aucun déploiement Vercel (même DEV) ou PROD sans GO explicite**, distinct de la permission de coder/committer.
- [x] Production **non décidée** ; ne pas créer de workflow de publication automatique.
- [x] Ne jamais s'appuyer seulement sur des restrictions d'interface pour protéger tarifs, commandes ou droits de l'usine.

## Contrôles à implémenter et prouver

- [ ] Authentifier les collaborateurs par Supabase Auth ; contrôler rôles et permissions dans NestJS.
- [ ] Vérifier les politiques RLS là où un accès direct à Supabase est exposé ; **clé serveur jamais envoyée au navigateur**.
- [ ] Stocker les documents clients en **Supabase Storage privé** avec autorisation côté serveur, URL signée courte et révocable selon besoin.
- [ ] Scanner/assainir les SVG et PDF ; limiter types, poids, dimensions et complexité ; éviter les ressources externes actives.
- [ ] Journaliser les commandes web, changements de prix, accès sensibles et contrôles de BAT **sans stocker les codes OTP en clair**.
- [ ] Lien BAT privé lié à une version précise, code SMS court et usage unique ; émission/renouvellement sécurisés et limites de tentatives.
- [ ] Validation côté serveur des prix au moment de la commande, requêtes idempotentes et protection anti-double paiement.
- [ ] Vérifier la politique de rétention, sauvegarde, restauration, accès internes et obligations locales applicables.
- [ ] Scanner les dépendances et dépendances GitHub Actions ; permissions minimales `contents: read`, pas de secrets sur workflow public non fiable.

## Contrôle avant toute PR / publication

- [ ] Aucun secret ni fichier client dans le diff / historique créé.
- [ ] Typecheck/lint/tests/build exécutés et résultats **réellement vérifiés**.
- [ ] Tests d'accès refusé client/atelier, version BAT et origine des commandes.
- [ ] Captures avant/après pour tout changement UI.
- [ ] Validation humaine avant merge quand requise.
- [ ] **Déploiement : demander une autorisation séparée**, même après CI verte.

Cette documentation est une exigence ; elle ne certifie pas que l'application est sécurisée avant les preuves.
