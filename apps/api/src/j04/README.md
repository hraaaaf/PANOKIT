# J04 — Fondation technique P0 (branche de travail)

**Statut : candidat non raccordé.** Ce dossier ne crée ni tables, ni migrations,
ni API, ni workflow de paiement. Il démontre seulement deux invariants minimaux
avec des fonctions pures et des tests adversariaux locaux.

- `production-policy.ts` : source commerciale non définie par le client ;
  refus de libération si format non homologué, verdict technique absent,
  BAT client de version différente ou consentement non confirmé, clearance
  commerciale absente, ou suspension non levée.
- `atelier-view.ts` : vue en **liste blanche** sans prix, marge, coordonnées,
  origine commerciale ; par défaut seul un opérateur **actif et affecté**
  au dossier de son usine reçoit cette projection.
- `../j04-foundation.spec.ts` : tests sur origine, BAT, séparation usine,
  révocation, colonnes sensibles, verrou de fabrication.

## Décisions/gates encore ouverts

Les décisions C1/C2 détaillées, notamment B–F dans la roadmap Notion, ne
sont **pas entièrement validées**. Les responsables usine ne reçoivent donc
aucune permission nouvelle dans cette proposition. Avant raccordement :

1. Finaliser C1/C2 et leur validation humaine.
2. Créer le **vrai schéma Drizzle** et migrations reproductibles sur base
   PostgreSQL isolée/fictive (J04-D1), avec tests d'intégrité.
3. Implémenter l'authentification réelle, autorisations NestJS à chaque requête,
   révocation DB, droits SQL/RLS, projections requêtées à la source (J04-D3).
4. Produire preuve transactionnelle J07/J08 : commande + provenance + événements
   + outbox atomiques ; devis/prix recalculés et contrat BAT versionné.
5. Revalider les règles de libération **dans la transaction SQL**, puis notifier
   l'usine seulement après commit ; vérifier absence d'accès aux données privées.

**Important :** les paramètres de cette fonction pure sont fiables **uniquement
si chargés côté serveur** depuis des enregistrements authentifiés et verrouillés.
Un utilisateur qui injecte directement ces valeurs peut simuler un état valide ;
ce code n'est pas un mécanisme de sécurité production tant que non raccordé.

Pas d'identifiant Supabase, de données clients réelles ni de déploiement.
Référence : roadmap Notion canonique PANOKIT, J04-C1/C2/J08/J09.
