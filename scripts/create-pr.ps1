<#
/**
 * Descripción: Script de automatización en PowerShell para crear Pull Requests (PR) en GitHub.
 * Requiere: GitHub CLI (gh) autenticado y repositorio git configurado.
 * Implementa: Automatización del flujo de trabajo de Git y PR con limpieza de temporales.
 */
#>

param (
  [string]$Title,
  [switch]$Draft
);

$templatePath = ".github/pull_request_template.md";
$tempPath = "TEMP_PR_DESCRIPTION.md";

# Preguntar por la rama de destino
$baseBranch = Read-Host "Introduce la rama de destino [Por defecto: main]";
if (-not $baseBranch) {
  $baseBranch = "main";
}

# 1. Gestión de la plantilla de PR
if (Test-Path $templatePath) {
  Write-Host "Localizado template de PR. Copiando a $tempPath..." -ForegroundColor Green;
  Copy-Item -Path $templatePath -Destination $tempPath -Force;
} else {
  Write-Host "Template no encontrado. Generando estructura por defecto en $tempPath..." -ForegroundColor Yellow;
  $defaultContent = @"
# Resumen de Cambios

<!-- Describe de forma concisa los cambios realizados -->

## Motivación Técnica

<!-- Justificación del enfoque técnico adoptado -->

## Impacto en el Sistema

<!-- Describe posibles efectos colaterales o integraciones afectadas -->

## Guía de Pruebas/QA

<!-- Pasos detallados para verificar los cambios en testing/local -->

## Breaking Changes

<!-- Indicar si hay cambios que rompen la compatibilidad hacia atrás -->
"@;
  Set-Content -Path $tempPath -Value $defaultContent -Encoding utf8;
}

# 2. Ejecución mediante GitHub CLI
if (-not $Title) {
  $currentBranch = (git branch --show-current).Trim();
  $Title = Read-Host "Introduce el título del Pull Request [Por defecto: $currentBranch]";
  if (-not $Title) {
    $Title = $currentBranch;
  }
}

Write-Host "Creando Pull Request a la rama '$baseBranch'..." -ForegroundColor Cyan;

# Construir argumentos para evitar problemas de escape
$argsList = @("pr", "create", "--base", $baseBranch, "--title", $Title, "--body-file", $tempPath);
if ($Draft) {
  $argsList += "--draft";
}

# Ejecutar gh
& gh $argsList;

# 3. Mantenimiento y limpieza
if (Test-Path $tempPath) {
  Write-Host "Limpiando archivo temporal $tempPath..." -ForegroundColor Yellow;
  Remove-Item -Path $tempPath -Force;
}

Write-Host "Proceso finalizado con éxito." -ForegroundColor Green;

<#
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Automatiza la creación de Pull Requests usando GitHub CLI con plantilla.
 *
 * Lógica Clave:
 * - Detección de plantilla local (.github/pull_request_template.md).
 * - Creación de archivo temporal de descripción para edición/envío a GitHub.
 * - Invocación del comando gh pr create con los argumentos apropiados.
 * - Limpieza garantizada del archivo temporal utilizando bloques de control o flujos secuenciales estructurados.
 *
 * Dependencias Externas:
 * - GitHub CLI (gh) para la interacción con la plataforma de GitHub.
 * - Git CLI para determinar la rama actual.
 *
 #>
