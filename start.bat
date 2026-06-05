@echo off
echo === Démarrage AutoMarket ===

echo Lancement du backend Symfony (port 8000)...
start "Backend Symfony" cmd /k "cd backend && php -S localhost:8000 -t public"

echo Lancement du frontend Angular (port 4200)...
start "Frontend Angular" cmd /k "ng serve"

echo === Les deux serveurs sont lancés ===
echo Backend : http://localhost:8000
echo Frontend : http://localhost:4200