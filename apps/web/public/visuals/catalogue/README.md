# J03 — Visuels approuvés : transfert binaire à finaliser

Source : [roadmap Notion canonique](https://app.notion.com/p/41777c6633628195b96cdc442fae78ec).
Ces quatre illustrations ont été validées par l'utilisateur lors de J03-V2 et contrôlées visuellement sur la maquette isolée en J03-V3.
**Elles ne sont PAS présentes dans cette branche au moment de la création de ce manifeste.**
Le code J03 utilise un fallback textuel explicite en cas d'absence de fichier, et aucun autre dessin ne doit être substitué automatiquement.

## Fichiers attendus dans ce même dossier

| Fichier | Sujet | Octets | SHA-256 des WebP optimisés |
| --- | --- | ---: | --- |
| `CAT-ENS-01.webp` | Lettres lumineuses frontales | 54790 | `8223be86021e8624c66b4e61147c1e555a7b7863c4e833fa88cca7cc7bbdef6d` |
| `CAT-ENS-02.webp` | Lettres rétroéclairées | 59882 | `0994a10493b9d79855c08ee5a66887ccd625f5e0ac794881c0320aad67a0d1e9` |
| `CAT-ENS-03.webp` | Caisson lumineux frontal | 29986 | `4ef7bc7ea49d661c3b1d9503de79c1c6ab930aa031a83eea3d4b7ef09ef01b2b` |
| `CAT-ENS-04.webp` | Néon LED flexible | 47468 | `e5f9339e01fc2df7e100576163155ea728bad83de6ecb65f4ecee7d3dea8bb2a` |

- Source : `PANOKIT_J03_V2_01…04_*.png` (768×512) dans les artefacts de validation du chantier, **pas** dans le dépôt public.
- Export optimisé : WebP 768×512, qualité 79 ; archive de livraison dans la conversation `PANOKIT_J03_D1_assets_WEBP.zip`.
- Aucune licence client ni document commercial dans les assets.
- Ne **pas** déclarer l'intégration graphique finale terminée avant que les quatre fichiers soient présents, que leurs empreintes correspondent, que les captures Next.js D2 soient vérifiées et qu'un GO humain soit donné.
- Formats, prix et fabricabilité : **non confirmés par l'usine**.

## Contrôle après copie

```bash
sha256sum apps/web/public/visuals/catalogue/CAT-ENS-0{1,2,3,4}.webp
```

**GOAL** : préserver les quatre visuels validés sans les dégrader. **SUCCESS** : assets présents et intègres à ces chemins, visibles sur mobile/desktop/AR. **PROOF** : SHA-256 + captures Next.js + CI.
