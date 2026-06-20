@echo off
echo === Démarrage AutoMarket ===

echo Lancement du backend Symfony (port 8000)...
start "Backend Symfony" cmd /k "cd backend && php -S localhost:8000 -t public"

echo Lancement du frontend Angular (port 4200)...
start "Frontend Angular" cmd /k "ng serve"

echo Lancement Mongo DB (port 27017)...
start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
echo Lancement du serveur Node.js...
node server.js

echo === Les deux serveurs sont lancés ===
echo Backend : http://localhost:8000
echo Frontend : http://localhost:4200
echo MongoDB : http://localhost:27017