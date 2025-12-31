# Script pour créer un nouvel utilisateur PostgreSQL
# Exécutez ce script en tant qu'administrateur

Write-Host "Création d'un nouvel utilisateur PostgreSQL..." -ForegroundColor Green
Write-Host ""
Write-Host "Veuillez entrer les informations suivantes :" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "Nom d'utilisateur (ex: 2nb_user)"
$password = Read-Host "Mot de passe" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Tentative de connexion à PostgreSQL..." -ForegroundColor Cyan

# Essayer de se connecter avec l'utilisateur postgres (vous devrez peut-être entrer le mot de passe)
$env:PGPASSWORD = Read-Host "Mot de passe de l'utilisateur 'postgres' (ou laissez vide si pas de mot de passe)" -AsSecureString
$pgPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))

# Créer l'utilisateur
$createUserSQL = "CREATE USER $username WITH PASSWORD '$passwordPlain';"
$grantSQL = "GRANT ALL PRIVILEGES ON DATABASE `"2nb_digital`" TO $username;"

Write-Host ""
Write-Host "Pour créer l'utilisateur manuellement, exécutez dans psql :" -ForegroundColor Yellow
Write-Host "psql -U postgres" -ForegroundColor White
Write-Host ""
Write-Host "Puis exécutez ces commandes SQL :" -ForegroundColor Yellow
Write-Host $createUserSQL -ForegroundColor White
Write-Host $grantSQL -ForegroundColor White
Write-Host ""
Write-Host "Ensuite, mettez à jour votre fichier .env avec :" -ForegroundColor Green
Write-Host "DATABASE_URL=`"postgresql://$username`:$passwordPlain@localhost:5432/2nb_digital?schema=public`"" -ForegroundColor White

