#!/usr/bin/env bash
set -euo pipefail

# build.sh - Build the app in Docker, extract the dist folder, and optionally run the image
# Usage:
#   ./build.sh                # build with default tag and extract ./dist
#   ./build.sh -t tag -o out  # set image tag and output dir
#   ./build.sh --no-cache     # pass --no-cache to docker build

TAG="rede-capivara-fe:build"
OUT_DIR="./dist"
NO_CACHE=""
RUN_AFTER=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--tag)
      TAG="$2"; shift 2;;
    -o|--out)
      OUT_DIR="$2"; shift 2;;
    --no-cache)
      NO_CACHE="--no-cache"; shift 1;;
    -r|--run)
      RUN_AFTER=1; shift 1;;
    -h|--help)
      sed -n '1,120p' "$0"; exit 0;;
    *)
      echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "Building Docker image with tag: $TAG"
docker build $NO_CACHE -t "$TAG" .

echo "Creating temporary container..."
cid=$(docker create "$TAG")
echo "Container id: $cid"

echo "Removing existing output dir: $OUT_DIR"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo "Copying built assets from container..."
docker cp "$cid":/usr/share/nginx/html/. "$OUT_DIR"

echo "Removing temporary container"
docker rm "$cid" >/dev/null

echo "Build artifacts extracted to: $OUT_DIR"

if [[ "$RUN_AFTER" -eq 1 ]]; then
  echo "Running container on port 8080..."
  docker run -p 8080:80 --rm "$TAG"
fi

echo "Done."
