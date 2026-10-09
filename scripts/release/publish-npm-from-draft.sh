#!/usr/bin/env bash
# Download react-form-builder-*.tgz from a draft GitHub Release and publish to npm.
# Intended for GitHub Actions OIDC trusted publishing (no NPM_TOKEN / NODE_AUTH_TOKEN).
#
# Canonical copy lives in formengine-tools; compose seeds it onto optimajet/formengine
# (Trusted Publisher + draft host). TeamCity dispatches the workflow there.
#
# Draft releases are untagged until published. `gh release download <tag_name>` and
# `gh release download <id>` both fail with "release not found". Resolve the draft via
# the API and download using the untagged slug from html_url (…/releases/tag/untagged-…).
set -euo pipefail

VERSION="${VERSION:?VERSION is required (draft release tag / lerna version)}"
REPO="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
TAG="${NPM_PUBLISH_TAG:-latest}"
OUT_DIR="${ARCHIVES_DIR:-.archives}"
PATTERN="react-form-builder-*-${VERSION}.tgz"

if [ -n "${NODE_AUTH_TOKEN:-}" ] || [ -n "${NPM_TOKEN:-}" ]; then
  echo "NODE_AUTH_TOKEN/NPM_TOKEN must be unset for OIDC trusted publishing" >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required to download draft release assets" >&2
  exit 1
fi

mkdir -p "${OUT_DIR}"
rm -f "${OUT_DIR}"/react-form-builder-*.tgz

echo "==> Find draft release tag_name=${VERSION} on ${REPO}"
# contents:write (or push access) required — Releases API omits drafts for read-only tokens.
DRAFT_JSON="$(
  gh api "repos/${REPO}/releases" --paginate \
    --jq "[.[] | select(.draft==true and .tag_name==\"${VERSION}\")][0] | select(.!=null) | {id, html_url}"
)"
if [ -z "${DRAFT_JSON}" ] || [ "${DRAFT_JSON}" = "null" ]; then
  echo "No draft release with tag_name=${VERSION} on ${REPO}" >&2
  echo "Tip: list with: gh api repos/${REPO}/releases --jq '.[]|select(.draft)|{id,tag_name,html_url}'" >&2
  exit 1
fi

RELEASE_ID="$(printf '%s' "${DRAFT_JSON}" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>console.log(JSON.parse(d).id))')"
# html_url ends with /releases/tag/untagged-<hash> for unpublished drafts
DOWNLOAD_REF="$(printf '%s' "${DRAFT_JSON}" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const u=JSON.parse(d).html_url;console.log(u.split("/").pop())})')"

echo "==> Download ${PATTERN} (draft id=${RELEASE_ID}, ref=${DOWNLOAD_REF})"
gh release download "${DOWNLOAD_REF}" \
  --repo "${REPO}" \
  --pattern "${PATTERN}" \
  --dir "${OUT_DIR}" \
  --clobber

shopt -s nullglob
archives=("${OUT_DIR}"/react-form-builder-*-"${VERSION}".tgz)
if [ "${#archives[@]}" -eq 0 ]; then
  echo "No archives matching ${PATTERN} in ${OUT_DIR}" >&2
  exit 1
fi

# OIDC may leave a version "staged" before npm view can see it; republish then hits E409.
is_already_on_npm() {
  local spec="$1"
  npm view "${spec}" version >/dev/null 2>&1
}

publish_or_skip() {
  local tarball="$1"
  local name_version="$2"
  local log
  log="$(mktemp)"
  if npm publish "${tarball}" --access public --tag "${TAG}" >"${log}" 2>&1; then
    cat "${log}"
    rm -f "${log}"
    return 0
  fi
  if grep -qE 'npm error code E409|Cannot publish over previously staged version|cannot publish over existing version' "${log}"; then
    echo "Already staged/published ${name_version} — skipping"
    rm -f "${log}"
    return 0
  fi
  cat "${log}" >&2
  rm -f "${log}"
  return 1
}

echo "==> Publishing ${#archives[@]} package(s) with dist-tag ${TAG}"
for tarball in "${archives[@]}"; do
  name_version="$(tar -xOf "${tarball}" package/package.json | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);console.log(`${j.name}@${j.version}`)})')"
  echo "==> npm publish ${tarball} (${name_version})"
  if is_already_on_npm "${name_version}"; then
    echo "Already published ${name_version} — skipping"
    continue
  fi
  publish_or_skip "${tarball}" "${name_version}"
done

echo "==> Done"
