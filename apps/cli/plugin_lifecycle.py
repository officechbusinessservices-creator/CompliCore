from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import argparse

from packages.shared.run_store import (
    add_plugin_review,
    get_plugin_by_name,
    get_plugin_details,
    install_plugin,
    list_plugins,
    register_plugin,
    set_plugin_state,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Antigravity plugin lifecycle CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="List plugins")

    inspect = sub.add_parser("inspect", help="Inspect plugin")
    inspect.add_argument("name")

    install = sub.add_parser("install", help="Install approved plugin")
    install.add_argument("name")
    install.add_argument("--workspace", default="global")
    install.add_argument("--role", default="global")
    install.add_argument("--path", required=True)
    install.add_argument("--by", default="operator")

    enable = sub.add_parser("enable", help="Enable plugin")
    enable.add_argument("name")
    enable.add_argument("--by", default="operator")
    enable.add_argument("--reason", default=None)

    disable = sub.add_parser("disable", help="Disable plugin")
    disable.add_argument("name")
    disable.add_argument("--by", default="operator")
    disable.add_argument("--reason", default=None)

    approve = sub.add_parser("approve", help="Approve plugin")
    approve.add_argument("name")
    approve.add_argument("--by", default="operator")
    approve.add_argument("--reason", default=None)

    quarantine = sub.add_parser("quarantine", help="Quarantine plugin")
    quarantine.add_argument("name")
    quarantine.add_argument("--by", default="operator")
    quarantine.add_argument("--reason", default=None)

    register = sub.add_parser("register", help="Register plugin in registry")
    register.add_argument("name")
    register.add_argument("--source-type", choices=["internal", "external"], required=True)
    register.add_argument("--source-url", default=None)
    register.add_argument("--owner", default=None)
    register.add_argument("--state", default="discovered")
    register.add_argument("--trust", default="unreviewed")

    review = sub.add_parser("review", help="Record plugin review")
    review.add_argument("name")
    review.add_argument("--reviewer", required=True)
    review.add_argument("--status", required=True)
    review.add_argument("--notes", default=None)

    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.command == "list":
        print(list_plugins())
        return

    if args.command == "inspect":
        print(get_plugin_details(args.name))
        return

    if args.command == "register":
        print(
            register_plugin(
                name=args.name,
                source_type=args.source_type,
                source_url=args.source_url,
                owner=args.owner,
                state=args.state,
                trust_level=args.trust,
            )
        )
        return

    plugin = get_plugin_by_name(args.name)
    if not plugin:
        raise SystemExit(f"Plugin not found: {args.name}")

    if args.command == "install":
        if plugin["state"] not in {"approved", "enabled"}:
            raise SystemExit("Plugin must be approved before install")
        print(
            install_plugin(
                plugin_id=plugin["id"],
                workspace=args.workspace,
                role=args.role,
                install_path=args.path,
                installed_by=args.by,
            )
        )
    elif args.command == "enable":
        print(set_plugin_state(plugin["id"], "enabled", args.by, args.reason))
    elif args.command == "disable":
        print(set_plugin_state(plugin["id"], "disabled", args.by, args.reason))
    elif args.command == "approve":
        print(set_plugin_state(plugin["id"], "approved", args.by, args.reason))
    elif args.command == "quarantine":
        print(set_plugin_state(plugin["id"], "quarantined", args.by, args.reason))
    elif args.command == "review":
        print(add_plugin_review(plugin["id"], args.reviewer, args.status, args.notes, None))


if __name__ == "__main__":
    main()
