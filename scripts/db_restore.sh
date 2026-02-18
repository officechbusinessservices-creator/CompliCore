#!/bin/sh
set -e

if [ -z "$RESTORE_BACKUP_NAME" ]; then
  echo "RESTORE_BACKUP_NAME is required (e.g., backup-YYYY-MM-DD-HHMMSS.sql.gz)"
  exit 1
fi

RESTORE_PATH="/tmp/$RESTORE_BACKUP_NAME"

echo "Downloading backup: $RESTORE_BACKUP_NAME"
aws s3 cp "s3://$S3_BUCKET_NAME/$RESTORE_BACKUP_NAME" "$RESTORE_PATH"

echo "Restoring database $POSTGRES_DB"
gunzip -c "$RESTORE_PATH" | PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB"

rm "$RESTORE_PATH"

echo "Restore completed."
