#!/bin/bash
set -e

echo "Executing sed"

echo "Exporting CEDAR_FRONTEND_local_REST_HOST"
export CEDAR_FRONTEND_local_REST_HOST="${CEDAR_HOST}"

echo "Exporting CEDAR_FRONTEND_local_UI_HOST"
export CEDAR_FRONTEND_local_UI_HOST="${CEDAR_HOST}"

echo "Current environment variables:"

env

echo "Executing gulp"

gulp

echo "Gulp terminated, content served by Nginx"

exec "$@"