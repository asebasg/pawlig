#!/bin/bash
#/**
# * Descripción: Script de automatización en Bash para crear Pull Requests (PR) en GitHub.
# * Requiere: GitHub CLI (gh) autenticado y repositorio git configurado.
# * Implementa: Automatización del flujo de trabajo de Git y PR con limpieza de temporales.
# */

TITLE="";
DRAFT=false;

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -t|--title) TITLE="$2"; shift ;;
    -d|--draft) DRAFT=true ;;
    *) echo "Opción desconocida: $1"; exit 1 ;;
  esac;
  shift;
done;

TEMPLATE_PATH=".github/pull_request_template.md";
TEMP_PATH="TEMP_PR_DESCRIPTION.md";

# Preguntar por la rama de destino
read -p "Introduce la rama de destino [Por defecto: main]: " INPUT_BASE;
BASE_BRANCH="${INPUT_BASE:-main}";

# 1. Gestión de la plantilla de PR
if [ -f "$TEMPLATE_PATH" ]; then
  echo "Localizado template de PR. Copiando a $TEMP_PATH...";
  cp "$TEMPLATE_PATH" "$TEMP_PATH";
else
  echo "Template no encontrado. Generando estructura por defecto en $TEMP_PATH...";
  cat <<EOT > "$TEMP_PATH"
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
EOT
fi;

# 2. Ejecución mediante GitHub CLI
if [ -z "$TITLE" ]; then
  CURRENT_BRANCH=$(git branch --show-current | tr -d '\n');
  read -p "Introduce el título del Pull Request [Por defecto: $CURRENT_BRANCH]: " INPUT_TITLE;
  TITLE="${INPUT_TITLE:-$CURRENT_BRANCH}";
fi;

echo "Creando Pull Request a la rama '$BASE_BRANCH'...";

ARGS=("pr" "create" "--base" "$BASE_BRANCH" "--title" "$TITLE" "--body-file" "$TEMP_PATH");
if [ "$DRAFT" = true ]; then
  ARGS+=("--draft");
fi;

gh "${ARGS[@]}";

# 3. Mantenimiento y limpieza
if [ -f "$TEMP_PATH" ]; then
  echo "Limpiando archivo temporal $TEMP_PATH...";
  rm -f "$TEMP_PATH";
fi;

echo "Proceso finalizado con éxito.";

#/*
# * ---------------------------------------------------------------------------
# * NOTAS DE IMPLEMENTACIÓN
# * ---------------------------------------------------------------------------
# *
# * Descripción General:
# * Automatiza la creación de Pull Requests usando GitHub CLI con plantilla.
# *
# * Lógica Clave:
# * - Detección de plantilla local (.github/pull_request_template.md).
# * - Creación de archivo temporal de descripción para edición/envío a GitHub.
# * - Invocación del comando gh pr create con los argumentos apropiados.
# * - Limpieza garantizada del archivo temporal utilizando comandos estándar de Unix.
# *
# * Dependencias Externas:
# * - GitHub CLI (gh) para la interacción con la plataforma de GitHub.
# * - Git CLI para determinar la rama actual.
# *
# */
