#!/usr/bin/env bash
# Bulk merge all branches into default branch safely.
# Usage:
#   bash scripts/bulk-merge.sh                # normal mode (prompts)
#   CONFIRM=1 bash scripts/bulk-merge.sh      # skip prompt
#   DRY_RUN=1 bash scripts/bulk-merge.sh      # list branches only
#   INCLUDE_REMOTE_ONLY=1 bash scripts/bulk-merge.sh   # also merge remote-only origin/* branches

set -Eeuo pipefail

# --- helpers ---
die() { echo "❌ $*" >&2; exit 1; }

require_clean_tree() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git status
    die "Working tree not clean. Commit or stash changes, then re-run."
  fi
}

default_branch_name() {
  local d=""
  if git symbolic-ref -q --short refs/remotes/origin/HEAD >/dev/null 2>&1; then
    d="$(git symbolic-ref --short refs/remotes/origin/HEAD | sed 's@^origin/@@')"
  fi
  if [[ -z "$d" ]]; then
    if git show-ref --verify --quiet refs/heads/main;   then d="main"
    elif git show-ref --verify --quiet refs/heads/master; then d="master"
    else die "Could not determine default branch (main/master)."
    fi
  fi
  echo "$d"
}

already_contains_ref() {
  # returns 0 if HEAD already contains the ref's commits
  git merge-base --is-ancestor "$1" HEAD
}

echo "🔎 Checking repo…"
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[[ -n "$repo_root" ]] || die "Not a Git repository."
cd "$repo_root"

require_clean_tree
git fetch --all --prune

DEFAULT_BRANCH="$(default_branch_name)"
echo "📌 Default branch: $DEFAULT_BRANCH"

# Fast-forward local default to remote if it exists
if git show-ref --verify --quiet "refs/remotes/origin/$DEFAULT_BRANCH"; then
  git checkout "$DEFAULT_BRANCH"
  git merge --ff-only "origin/$DEFAULT_BRANCH" || echo "ℹ️ Could not fast-forward from origin (may be identical or no remote)."
else
  git checkout "$DEFAULT_BRANCH"
fi

TS="$(date +"%Y%m%d-%H%M%S")"
BACKUP_BRANCH="backup/${DEFAULT_BRANCH}-${TS}"
BACKUP_TAG="pre-bulk-merge-${TS}"
INTEGRATION_BRANCH="integration/bulk-merge-${TS}"

# Build list of branches to merge
mapfile -t LOCAL_BRANCHES < <(git for-each-ref --format='%(refname:short)' refs/heads \
  | grep -Ev "^${DEFAULT_BRANCH}$|^${INTEGRATION_BRANCH}$|^backup/|^integration/" \
  | sort)

REMOTE_ONLY=()
if [[ "${INCLUDE_REMOTE_ONLY:-0}" == "1" ]]; then
  while read -r r; do
    short="${r#origin/}"
    # skip default and HEAD
    [[ "$short" == "$DEFAULT_BRANCH" ]] && continue
    [[ "$short" == "HEAD" ]] && continue
    # only if no local branch with that name exists
    if ! git show-ref --verify --quiet "refs/heads/$short"; then
      REMOTE_ONLY+=("$r")
    fi
  done < <(git for-each-ref --format='%(refname:short)' refs/remotes/origin | sort)
fi

echo "🧾 Branches that will be merged (in order):"
for b in "${LOCAL_BRANCHES[@]}"; do echo "  - $b"; done
for b in "${REMOTE_ONLY[@]:-}"; do echo "  - $b"; done
[[ "${DRY_RUN:-0}" == "1" ]] && { echo "✅ DRY RUN complete."; exit 0; }

if [[ -z "${CONFIRM:-}" ]]; then
  read -r -p "Proceed with merge plan? [y/N] " ans
  [[ "${ans,,}" == "y" ]] || die "Aborted."
fi

echo "🛟 Creating backup branch & tag..."
git branch "$BACKUP_BRANCH"
git tag -a "$BACKUP_TAG" -m "Backup before bulk merge on $TS"

echo "🌿 Creating integration branch: $INTEGRATION_BRANCH"
git checkout -b "$INTEGRATION_BRANCH" "$DEFAULT_BRANCH"

echo "🔁 Starting sequential merges into $INTEGRATION_BRANCH …"
merge_one() {
  local ref="$1"
  if already_contains_ref "$ref"; then
    echo "  ↪️  Already contains $ref, skipping."
    return 0
  fi
  echo "  ➕ Merging $ref …"
  if git merge --no-ff --no-edit "$ref"; then
    echo "  ✅ $ref merged."
  else
    echo "  ⚠️ Conflict while merging $ref."
    cat <<'EOS'
Resolve the conflicts, then:
  git status
  # edit files to resolve conflicts
  git add -A
  git commit        # completes the conflicted merge
Then re-run this script (set CONFIRM=1 to skip prompts). It will continue and skip already-merged refs.

If you want to abort this particular merge:
  git merge --abort    # leaves you still on the integration branch

If you want to roll EVERYTHING back to before bulk merge:
  git checkout <default-branch>
  git reset --hard '"$BACKUP_BRANCH"'
  git branch -D '"$INTEGRATION_BRANCH"'
EOS
    exit 1
  fi
}

for b in "${LOCAL_BRANCHES[@]}"; do merge_one "$b"; done
for b in "${REMOTE_ONLY[@]:-}";  do merge_one "$b"; done

echo "⬆️ Promoting integration to $DEFAULT_BRANCH …"
git checkout "$DEFAULT_BRANCH"
if git merge --ff-only "$INTEGRATION_BRANCH"; then
  echo "🎉 All done!"
  echo "   Backup branch: $BACKUP_BRANCH"
  echo "   Backup tag:    $BACKUP_TAG"
  echo "   Integration:   $INTEGRATION_BRANCH (you may keep or delete later)"
else
  echo "⚠️ Could not fast-forward (did $DEFAULT_BRANCH move meanwhile?)."
  echo "   You can merge manually now:"
  echo "     git merge --no-ff $INTEGRATION_BRANCH"
fi
