from __future__ import annotations

import json
from pathlib import Path

from packages.tools.plugin_runtime import PluginValidationError, validate_plugin_manifest
from packages.shared.run_store import add_plugin_version, register_plugin, set_plugin_permissions


def discover_plugin_manifests(root: Path) -> list[Path]:
    return sorted(root.rglob('.claude-plugin/plugin.json'))


def source_type_from_path(path: Path) -> str:
    parts = set(path.parts)
    return 'external' if 'external_plugins' in parts else 'internal'


def main() -> None:
    roots = [Path('plugins'), Path('external_plugins')]
    total = 0
    failed: list[dict] = []

    for root in roots:
        if not root.exists():
            continue
        for manifest_path in discover_plugin_manifests(root):
            plugin_root = manifest_path.parent.parent
            try:
                validated = validate_plugin_manifest(plugin_root)
            except PluginValidationError as exc:
                failed.append({'plugin_root': str(plugin_root), 'error': str(exc)})
                continue

            manifest = validated['manifest']
            manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
            name = manifest.get('name')
            version = manifest.get('version', '0.1.0')
            source_type = source_type_from_path(manifest_path)
            source_url = manifest.get('source')
            owner = manifest.get('owner')
            state = manifest.get('state', 'discovered')
            trust_level = 'reviewed' if state in {'approved', 'enabled'} else 'unreviewed'

            plugin = register_plugin(
                name=name,
                source_type=source_type,
                source_url=source_url,
                owner=owner,
                trust_level=trust_level,
                state=state,
            )
            add_plugin_version(plugin['id'], version, validated['manifest_hash'], manifest)
            add_plugin_version(plugin['id'], version, None, manifest)

            permissions = []
            for permission in manifest.get('required_permissions', []):
                permissions.append({'permission_name': permission, 'scope': 'declared', 'allowed': True})
            for workspace in manifest.get('workspace_scope', []):
                permissions.append({'permission_name': 'workspace_access', 'scope': workspace, 'allowed': True})
            for role in manifest.get('role_scope', []):
                permissions.append({'permission_name': 'role_access', 'scope': role, 'allowed': True})

            if permissions:
                merged = {}
                for p in permissions:
                    key = (p['permission_name'], p['scope'])
                    merged[key] = p
                set_plugin_permissions(plugin['id'], list(merged.values()))

            total += 1

    print({'synced_plugins': total, 'failed': failed})
    print({'synced_plugins': total})


if __name__ == '__main__':
    main()
