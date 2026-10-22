# Voyage en amoureux — notes pour Claude

## Le projet
- Jeu 2D de franchissement en 4x4 (un Jeep Cherokee XJ bordeaux) en Corse, en français, joué sur iPhone en mode paysage (raccourci écran d'accueil).
- Héros : **Mila** (biologiste, spécialiste des parasites) et **Andrea** (mécanicien, garage en Bretagne), en couple, plus leur chien. **Le chien s'appelle maintenant « Fautea »** (comme la plage) : le nommer rarement, et seulement quand ce n'est pas ambigu.
- Histoire : enquête sur un produit toxique (N-12) qui rend les animaux malades. Suspects multiples, Noxacorp n'est révélé qu'au chapitre 7 (rendez-vous de nuit avec Lucia). Marchetti (gendarme corrompu) finit en prison. Fin : demande en mariage à la tour génoise de Fautea (ne pas changer cette fin amoureuse). 10 chapitres : Sari, Coasina, Arrivadu, Bavella (hélico de Mathis), Piana, Foce, Saint-Florent, Sardaigne (grottes), Ospedale (ours), Fautea.
- L'utilisateur n'est pas développeur : réponses en français, simples, avec des réserves honnêtes (« testé sur ordinateur seulement »). Pas de faux souvenirs inventés, pas d'argent mentionné pour le couple.

## Technique
- **Tout le jeu est dans `index.html`** (un seul fichier, environ 800 Ko, canvas 2D + Web Audio synthétisé, aucun fichier externe).
- Déploiement : chaque push sur `main` part automatiquement sur Netlify (`netlify.toml`). On pousse directement sur `main`, sans PR.
- **Version : 2.xx.** Constantes `GAME_VER` et `GAME_DATE` en fin de fichier, affichées dans le menu. Les incrémenter à chaque livraison.
- Style du code : on ajoute des blocs `// ===== 2.xx : ... =====` à la fin du script et on surcharge les fonctions par réaffectation (`f=(function(o){return function(){...o()...}})(f)`). Les déclarations `function` sont réaffectables. Attention à la TDZ (`let`/`const`) : définir les variables globales tôt (ex. après `let W,HH,DPR,S;`).
- Fonctions utiles :
  - `say(texte,durée,qui)` (qui : 0 = Andrea, 1 = Mila) ;
  - `cardQ.push({t,L:[['m'|'a'|'n'|'v',texte]],cb})` pour une carte de dialogue ;
  - `choice(clé,titre,texte,options,cb)` pour un choix ;
  - `openCine(k)` avec l'objet `CS[k]={L:()=>[[t,'m'|'a'|'n'|..,texte]],end,draw(Wd,gy,T2,tm),onEnd}` pour une cinématique ;
  - `openHelp(k)` avec `HELP[k]` pour les mini-jeux « animal / mécanique » ;
  - `pzOpen('farm'|'jam'|'plant')` ;
  - `stopReq={x,cb}` pour un arrêt en douceur ;
  - `chIdx()` (chapitre 0 à 9), `chP()` (progression 0 à 1), `level`, `SV` (sauvegarde) ;
  - `cherokeeSide(cx,cy)` pour le Cherokee des cinématiques (couleur et accessoires repris) ; `truck()` pour le Cherokee du jeu.
- Personnalisation : atelier « Corse 4x4 » (`openShop`, `SV.cus`, palette `CCv`). Graine de voyage `TS()` / `SV.seed` (rejouabilité).
- Tests : Playwright headless (`NODE_PATH=/opt/npm-tools/node_modules`), avec `requestAnimationFrame` neutralisé et la boucle avancée à la main par `loop(t)`. L'écran d'intro dure environ 8 s réelles : attendre avant les captures.

## Reste à faire (demandes de l'utilisateur, par priorité)
1. **Mini-jeu touristes** : Mila répond en anglais (phrases complexes acceptées) ou en coréen (hangeul, mots simples) ; Andrea en italien (simple) ou en allemand (très simple). Il faut comprendre la phrase et choisir la bonne réponse. Bonne réponse : contents, direction indiquée ou indice pour l'enquête. Mauvaise réponse : tristes ou fâchés.
2. **Mini-jeu tubes à essai** (tri des couleurs, type « water sort »), une fois par chapitre lors d'une analyse, difficulté progressive.
3. **Mission remorque** (obligatoire, une par chapitre, thème selon le chapitre) : une personne devant une ferme ou un magasin agricole nous arrête. Carte séparée plus escarpée (boue, gués, pas de treuil), remorque plus grande que le Cherokee (bétaillère vaches/moutons, bidons d'eau, bottes de paille), chargement physique à ne pas faire tomber, environ 1 minute, difficulté croissante.
4. **Construction de pont** : un pont en bois cassé, mini-jeu physique où l'on assemble des poutres sur une grille aimantée pour traverser. Une fois par chapitre, puis on voit le pont réparé.
5. **Cinématiques à ajouter** :
   - les bidons près du château de Coasina ;
   - le chien retrouvé (arrêt après avoir vu son collier au sol) ;
   - le faux dépanneur qui repart, et l'on découvre qu'il a volé des choses ;
   - garder les cinématiques de fin de chapitre qui rappellent la journée.
6. **Réglages et gameplay** :
   - supprimer le délai de 15 s entre deux pop-ups et trouver une autre solution (file d'attente intelligente) ;
   - aucun magasin ni interaction pendant la traversée en bac ;
   - au contact coupé, le levier repasse en 2H ;
   - tableau de bord plus transparent ;
   - dépanneuse : si le Cherokee est réhaussé, le dépanneur dit qu'il est trop haut et donc moins stable ;
   - mini-jeu courroie : dire qu'elle « a sauté » ;
   - atelier : régler l'orientation des phares et la dureté des amortisseurs ;
   - environ 30 % de surnoms et de mots d'amour en moins dans les dialogues (fait pour `addPet` en 2.02 : 56 % au lieu de 80 % ; reste à alléger les textes écrits en dur).

## Déjà fait récemment
**2.02** : batterie — boucle limitée à 60 i/s, 30 i/s au calme (menus, cartes, choix, Cherokee à l'arrêt), toujours 60 i/s en cinématique (`calmNow()`, `cineOn()`) ; une seule piste au lieu de terre/bitume (la boue d'un seul côté n'existe plus) tracée en un seul chemin ; étoiles pré-dessinées (`starLayer()`) ; dégradé du ciel en cache (`gradC()`) ; tableau de bord redessiné seulement si une valeur change (sinon 15 i/s). Le mode « Économie » a été refusé. Humour — `JOKE` (selon la situation : boue, pluie, moutons, nuit) et deux gags qui reviennent `GAG.par` (parasites de Mila) et `GAG.jal` (Mila jalouse du Cherokee), un échange toutes les ~4 min en roulant, jamais pendant les moments tristes (`jokeSad()`), sans surnom ajouté (`JOKE_SET`) ; répliques après l'hélico, après le chien retrouvé, et dans la cinématique du sous-marin.
**2.01** : 10 bugs corrigés — faon (arrêt chez la vétérinaire + cinématique `CS.veto`, plus de pastille 🦌 en double), tombe « FAON » et colline sous le village d'Arrivadu, camion blanc derrière le Cherokee (et synchronisé avec la narration), jante choisie reprise au changement de roue (`rimOnly()`), capot ouvert le soir seulement s'il y a une raison (`nightRep()`, `SV.hotD`), roue de secours sur le capot qui suit le capot (`hoodOpen()`), roue arrière vue de profil sous housse (`spareBack()`), bulle « Dormir ici » masquée pendant qu'on parle, pas de nuit dans un tunnel (`noSleep`), narration des fins de chapitre en bas de l'écran.
Vitesse en chiffres, treuil à côté, boost en double tapotement sur l'accélérateur ; essuie-glaces seulement sous la pluie ; fondus du décor minutés avec hystérésis ; pneus basse pression aplatis seulement en bas ; animal au sol dans les prélèvements ; bouchon vraiment bloquant ; pas de surnoms pendant les appels ; pas d'échantillon pour les animaux sans intérêt ; suspensions 35 % plus fermes ; son retravaillé ; atelier Corse 4x4 ; rejouabilité et surprises ; grottes, ours, sous-marin, bac réel.
