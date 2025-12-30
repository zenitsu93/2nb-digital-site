# Script PowerShell pour copier tous les fichiers nécessaires du site 2NB Digital
# Exécutez ce script depuis la racine du projet : .\2nb-digital-site\copy-files.ps1

$sourceDir = "..\package\src"
$destDir = "src"

Write-Host "Création de la structure de dossiers..." -ForegroundColor Green

# Créer tous les dossiers nécessaires
$folders = @(
    "src\layouts\entreprise",
    "src\layouts\full\shared\loadable",
    "src\views\accueil",
    "src\views\services",
    "src\views\realisations",
    "src\views\actualites",
    "src\views\contact",
    "src\views\spinner",
    "src\components\entreprise",
    "src\components\shared",
    "src\routes",
    "src\css\layouts",
    "src\css\override",
    "src\utils\theme",
    "src\assets\images\blog",
    "src\assets\images\profile",
    "public"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host "Copie des fichiers..." -ForegroundColor Green

# Copier les layouts
Copy-Item "$sourceDir\layouts\entreprise\*" -Destination "src\layouts\entreprise\" -Recurse -Force
Copy-Item "$sourceDir\layouts\full\shared\loadable\*" -Destination "src\layouts\full\shared\loadable\" -Recurse -Force

# Copier les views
Copy-Item "$sourceDir\views\accueil\*" -Destination "src\views\accueil\" -Recurse -Force
Copy-Item "$sourceDir\views\services\*" -Destination "src\views\services\" -Recurse -Force
Copy-Item "$sourceDir\views\realisations\*" -Destination "src\views\realisations\" -Recurse -Force
Copy-Item "$sourceDir\views\actualites\*" -Destination "src\views\actualites\" -Recurse -Force
Copy-Item "$sourceDir\views\contact\*" -Destination "src\views\contact\" -Recurse -Force
Copy-Item "$sourceDir\views\spinner\*" -Destination "src\views\spinner\" -Recurse -Force

# Copier les components
Copy-Item "$sourceDir\components\entreprise\*" -Destination "src\components\entreprise\" -Recurse -Force
Copy-Item "$sourceDir\components\shared\CardBox.tsx" -Destination "src\components\shared\" -Force

# Copier les routes
Copy-Item "$sourceDir\routes\Router.tsx" -Destination "src\routes\" -Force

# Copier les CSS
Copy-Item "$sourceDir\css\globals.css" -Destination "src\css\" -Force
Copy-Item "$sourceDir\css\layouts\*" -Destination "src\css\layouts\" -Recurse -Force
Copy-Item "$sourceDir\css\override\*" -Destination "src\css\override\" -Recurse -Force

# Copier les utils
Copy-Item "$sourceDir\utils\theme\*" -Destination "src\utils\theme\" -Recurse -Force

# Copier App.tsx et main.tsx
Copy-Item "$sourceDir\App.tsx" -Destination "src\" -Force
Copy-Item "$sourceDir\main.tsx" -Destination "src\" -Force

# Copier les assets (images utilisées)
if (Test-Path "$sourceDir\assets\images\blog") {
    Copy-Item "$sourceDir\assets\images\blog\*" -Destination "src\assets\images\blog\" -Recurse -Force
}
if (Test-Path "$sourceDir\assets\images\profile") {
    Copy-Item "$sourceDir\assets\images\profile\*" -Destination "src\assets\images\profile\" -Recurse -Force
}
if (Test-Path "$sourceDir\assets\logo-icon.svg") {
    Copy-Item "$sourceDir\assets\logo-icon.svg" -Destination "src\assets\" -Force
    Copy-Item "$sourceDir\assets\logo-icon.svg" -Destination "public\logo-icon.svg" -Force
}

Write-Host "Copie terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Placez votre logo dans public/logo.png" -ForegroundColor White
Write-Host "2. Exécutez: npm install" -ForegroundColor White
Write-Host "3. Exécutez: npm run dev" -ForegroundColor White

