# Resto Globe

Une application pour localiser les restaurants dans le monde entier. Utilisez la carte interactive pour trouver des restaurants près de vous ou dans n'importe quelle ville.

## Fonctionnalités

- Recherche de restaurants par lieu
- Affichage des restaurants sur une carte interactive
- Filtrage par note, prix et disponibilité
- Détails complets sur chaque restaurant
- Interface intuitive et responsive
- Géolocalisation pour trouver des restaurants à proximité

## Technologies utilisées

- React
- Google Maps API
- Google Places API
- TailwindCSS
- Vite

## Configuration

L'application nécessite une clé API Google Maps avec les API Places activées. Vous devez définir cette clé dans le fichier .env :

```
VITE_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_api
```

## Développement local

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Construction pour la production
npm run build
```