# Backend – API de gestion des réclamations

Ce dossier contient le backend de l’application de gestion des réclamations, développé avec **Laravel 12** (PHP 8.2) et une base de données **MySQL 8**.

L’API est consommée par le frontend React (Vite) situé dans le dossier `../frontend`.

---

## Stack technique

- **Langage** : PHP >= 8.2
- **Framework** : Laravel 12
- **Base de données** : MySQL 8
- **Gestion des dépendances** : Composer
- **Serveur HTTP** : PHP built-in (`php artisan serve`) ou **Nginx** via Docker

---

## Prérequis

Sans Docker :

- PHP 8.2+
- Composer
- MySQL (ou MariaDB compatible)

Avec Docker (via le `docker-compose.yml` à la racine) :

- Docker
- Docker Compose

---

## Installation (sans Docker)

Depuis le dossier `backend/` :

```bash
composer install

cp .env.example .env

# Configurer la base de données dans .env
php artisan key:generate
php artisan migrate
```

Pour lancer le serveur de développement :

```bash
php artisan serve
```

L’API sera disponible par défaut sur `http://localhost:8000`.

---

## Utilisation avec Docker

Depuis la racine du projet (où se trouve `docker-compose.yml`) :

```bash
docker-compose up -d --build
```

Les services suivants seront démarrés :

- `app` : application Laravel (backend)
- `webserver` : Nginx exposé sur `http://localhost:8000`
- `db` : MySQL 8 exposé sur le port `3307`

Les migrations peuvent ensuite être lancées dans le conteneur `app` si nécessaire.

---

## Tests

Pour exécuter la suite de tests :

```bash
php artisan test
```

ou via PHPUnit :

```bash
./vendor/bin/phpunit
```

---

## Structure principale du backend

- `app/` : code applicatif Laravel (HTTP, Models, Services, etc.)
- `config/` : configuration de l’application
- `database/` : migrations, seeders et factories
- `routes/` : définition des routes API / web
- `tests/` : tests automatisés

---

## Configuration

La configuration principale se fait dans le fichier `.env` :

- connexion à la base de données
- configuration de l’URL de l’application (`APP_URL`)
- autres paramètres spécifiques au projet (authentification, filesystems, etc.)

Pense à adapter ces valeurs selon ton environnement (local, staging, production).

