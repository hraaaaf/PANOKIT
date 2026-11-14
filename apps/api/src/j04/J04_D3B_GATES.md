# J04-D3-B — Contrôle JWT et guard NestJS (candidat)

**Non connecté, non fusionné.** Ce module vérifie cryptographiquement les JWT RSA/EC avec clés publiques **configurées par un serveur de confiance**, issuer, audience, exp, nbf, alg et kid. Aucune URL JWKS n'est acceptée depuis le token.

Le guard NestJS applique la politique fail-closed issue de J04-D3-A après consultation des adaptateurs d'identité, membership courant et dossier résolu côté serveur.

**Limites P0 :**
- Aucune clé Supabase réelle, aucun projet configuré et aucune connexion à la base commerciale.
- MembershipStore et résolution du dossier sont des interfaces ; les exemples des tests utilisent des fixtures synthétiques.
- Guard non raccordé à un endpoint : le seul contrôleur actif reste le healthcheck.
- Pas de GRANT/RLS SQL opérationnels, ni de flux de paiement/BAT/libération de fabrication.
- Seuls RS256/ES256 sont admis. HS256 hérité non pris en charge et nécessite une décision technique distincte ; la rotation des clés devra être gérée en configuration serveur.

**Next** : vrai adaptateur PostgreSQL limité par rôle et vérification de révocation ; configuration Supabase JWKS de confiance ; branchement à des routes atelier après tests d'intégration. Ne pas fusionner les PR #5–#9 ni migrer Supabase ou déployer Vercel sans GO distinct.

[Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec)
