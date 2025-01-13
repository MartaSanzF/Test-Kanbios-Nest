# Étape 1 : Utiliser une image de Node.js officielle comme base
FROM node:16-alpine

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de l'application
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste du code
COPY . .

# Étape 6 : Construire l'application Nest.js
RUN npm run build

# Étape 7 : Exposer le port utilisé par Nest.js
EXPOSE 3000

# Étape 8 : Définir la commande de démarrage
CMD ["npm", "run", "start:dev"]
