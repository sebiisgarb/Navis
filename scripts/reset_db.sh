set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PROJECT_ROOT=$(realpath "$SCRIPT_DIR/..")

COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.dev.yml}
COMPOSE_PATH="$PROJECT_ROOT/$COMPOSE_FILE"

if [[ ! -f $COMPOSE_PATH ]]; then
	echo "compose file not fount $COMPOSE_PATH" >&2
	exit 1

fi

echo "stopping containers and removing them"
docker compose -f "$COMPOSE_PATH" down -v

echo "recreating fresh containers"
docker compose -f "$COMPOSE_PATH" up -d

echo "containers reset - now run migrations"
