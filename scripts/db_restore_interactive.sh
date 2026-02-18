#!/bin/sh
set -e

echo "Fetching latest backups from S3..."
aws s3 ls "s3://$S3_BUCKET_NAME/" | tail -n 5

printf "Enter the filename to restore (e.g., backup-YYYY-MM-DD-HHMMSS.sql.gz): "
read -r BACKUP_NAME

if [ -z "$BACKUP_NAME" ]; then
  echo "No backup name provided. Aborting."
  exit 1
fi

RESTORE_PATH="/tmp/$BACKUP_NAME"

echo "Downloading $BACKUP_NAME..."
aws s3 cp "s3://$S3_BUCKET_NAME/$BACKUP_NAME" "$RESTORE_PATH"

echo "Restoring database $POSTGRES_DB..."
gunzip -c "$RESTORE_PATH" | PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB"

rm "$RESTORE_PATH"
echo "✅ Restore complete. Database is back to $BACKUP_NAME"
