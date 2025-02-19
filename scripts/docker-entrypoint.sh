#!/bin/bash
set -e

echo "Executing sed"



echo "Current environment variables:"

env

echo "Executing gulp"

gulp

echo "Gulp terminated, content served by Nginx"

exec "$@"