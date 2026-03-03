#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# CompliCore — Run All Agents Orchestrator
# Sequentially launches the three agent-related scripts:
#   1. complicore_automator.py  — Multi-phase infrastructure & AI stack
#   2. composio_agent.py        — Composio + Claude MCP tool router
#   3. connect_apps_client.py   — Anthropic Skills / Connect Apps client
#
# Usage:
#   bash scripts/run-all-agents.sh              # run all agents
#   bash scripts/run-all-agents.sh --dry-run    # show what would run
#   bash scripts/run-all-agents.sh --agent 1    # run only agent 1
#   bash scripts/run-all-agents.sh --agent 2    # run only agent 2
#   bash scripts/run-all-agents.sh --agent 3    # run only agent 3
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Resolve project root (works even when called from another dir) ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Agent definitions ──
AGENT_SCRIPTS=(
  "scripts/complicore_automator.py"
  "scripts/composio_agent.py"
  "scripts/connect_apps_client.py"
)
AGENT_NAMES=(
  "ComplicoreAutomator  — Infrastructure & AI Stack"
  "ComposioAgent        — MCP Tool Router (Composio + Claude)"
  "ConnectAppsClient    — Anthropic Skills / Connect Apps"
)

# ── Defaults ──
DRY_RUN=false
RUN_AGENT=""       # empty = run all
AUTOMATOR_START=1  # default --start phase for complicore_automator

# ── Parse flags ──
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)  DRY_RUN=true; shift ;;
    --agent)    RUN_AGENT="$2"; shift 2 ;;
    --start)    AUTOMATOR_START="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: bash scripts/run-all-agents.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run        Print commands without executing"
      echo "  --agent N        Run only agent N (1=Automator, 2=Composio, 3=ConnectApps)"
      echo "  --start N        Phase number to start from for the Automator (1-5, default: 1)"
      echo "  -h, --help       Show this help message"
      echo ""
      echo "Agents:"
      for i in "${!AGENT_NAMES[@]}"; do
        echo "  $((i+1)). ${AGENT_NAMES[$i]}"
      done
      echo ""
      echo "Environment variables:"
      echo "  COMPOSIO_API_KEY      Composio API key (agent 2)"
      echo "  ANTHROPIC_API_KEY     Anthropic API key (agent 3)"
      echo "  COMPOSIO_USER_ID      Composio external user ID (agent 2)"
      echo "  COMPOSIO_CALLBACK_URL OAuth callback URL (agent 2)"
      exit 0
      ;;
    *) echo -e "${RED}Unknown option: $1${RESET}"; exit 1 ;;
  esac
done

# ── Helpers ──
banner() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${CYAN}║${RESET} ${BOLD}$1${RESET}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${RESET}"
}

log_info()    { echo -e "${GREEN}[INFO]${RESET}  $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${RESET} $*"; }
separator()   { echo -e "${CYAN}────────────────────────────────────────────────────${RESET}"; }

# ── Pre-flight checks ──
preflight() {
  local ok=true

  # Python
  if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    log_error "Python 3 not found. Install Python 3.9+ to continue."
    ok=false
  fi

  PYTHON_CMD="$(command -v python3 || command -v python)"

  # Verify scripts exist
  for script in "${AGENT_SCRIPTS[@]}"; do
    if [[ ! -f "$PROJECT_ROOT/$script" ]]; then
      log_error "Missing: $script"
      ok=false
    fi
  done

  # Warn about optional env vars (non-blocking)
  if [[ -z "${COMPOSIO_API_KEY:-}" ]]; then
    log_warn "COMPOSIO_API_KEY not set — Agent 2 (Composio) may use default key."
  fi
  if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    log_warn "ANTHROPIC_API_KEY not set — Agent 3 (Connect Apps) will fail without it."
  fi

  if [[ "$ok" == false ]]; then
    log_error "Pre-flight checks failed. Aborting."
    exit 1
  fi

  log_info "Pre-flight checks passed ✓"
}

# ── Run a single agent ──
run_agent() {
  local idx="$1"
  local script="${AGENT_SCRIPTS[$idx]}"
  local name="${AGENT_NAMES[$idx]}"
  local extra_args=()

  # Agent-specific arguments
  case "$idx" in
    0) extra_args=("--start" "$AUTOMATOR_START") ;;  # complicore_automator.py
    1) ;;  # composio_agent.py — interactive, no default args
    2) ;;  # connect_apps_client.py — interactive, no default args
  esac

  separator
  echo -e "  ${BOLD}Agent $((idx+1)):${RESET} ${name}"
  echo -e "  ${BOLD}Script:${RESET} ${script}"
  if [[ ${#extra_args[@]} -gt 0 ]]; then
    echo -e "  ${BOLD}Args:${RESET}   ${extra_args[*]}"
  fi
  separator

  if [[ "$DRY_RUN" == true ]]; then
    log_info "[DRY-RUN] Would execute: $PYTHON_CMD $PROJECT_ROOT/$script ${extra_args[*]:-}"
    return 0
  fi

  # Run with a timeout guard and capture exit code
  set +e
  "$PYTHON_CMD" "$PROJECT_ROOT/$script" "${extra_args[@]}" 2>&1
  local exit_code=$?
  set -e

  if [[ $exit_code -eq 0 ]]; then
    log_info "Agent $((idx+1)) completed successfully ✓"
  else
    log_error "Agent $((idx+1)) exited with code $exit_code"
    FAILED_AGENTS+=("$((idx+1)): ${name}")
  fi

  return $exit_code
}

# ── Main ──
main() {
  banner "CompliCore — Agent Orchestrator"
  echo -e "  ${BOLD}Date:${RESET}    $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo -e "  ${BOLD}Root:${RESET}    $PROJECT_ROOT"
  echo ""

  preflight

  FAILED_AGENTS=()
  TOTAL=0
  PASSED=0

  if [[ -n "$RUN_AGENT" ]]; then
    # ── Single agent mode ──
    local idx=$((RUN_AGENT - 1))
    if [[ $idx -lt 0 || $idx -ge ${#AGENT_SCRIPTS[@]} ]]; then
      log_error "Invalid agent number: $RUN_AGENT (must be 1-${#AGENT_SCRIPTS[@]})"
      exit 1
    fi
    TOTAL=1
    banner "Running Agent $RUN_AGENT of ${#AGENT_SCRIPTS[@]}"
    if run_agent "$idx"; then
      PASSED=1
    fi
  else
    # ── Run all agents sequentially ──
    TOTAL=${#AGENT_SCRIPTS[@]}
    for i in "${!AGENT_SCRIPTS[@]}"; do
      banner "Agent $((i+1)) of $TOTAL"
      run_agent "$i" || true   # continue on failure
    done
    PASSED=$((TOTAL - ${#FAILED_AGENTS[@]}))
  fi

  # ── Summary ──
  echo ""
  banner "Orchestration Summary"
  echo -e "  ${BOLD}Total:${RESET}   $TOTAL"
  echo -e "  ${GREEN}Passed:${RESET}  $PASSED"
  echo -e "  ${RED}Failed:${RESET}  ${#FAILED_AGENTS[@]}"

  if [[ ${#FAILED_AGENTS[@]} -gt 0 ]]; then
    echo ""
    log_warn "Failed agents:"
    for f in "${FAILED_AGENTS[@]}"; do
      echo -e "    ${RED}✗${RESET} $f"
    done
    echo ""
    exit 1
  fi

  echo ""
  log_info "All agents completed successfully 🚀"
}

main
