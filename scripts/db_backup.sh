#!/bin/sh
set -e

BACKUP_NAME="backup-$(date +%Y-%m-%d-%H%M%S).sql.gz"
BACKUP_PATH="/tmp/$BACKUP_NAME"

echo "Starting backup: $BACKUP_NAME"

PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  -h "$POSTGRES_HOST" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  | gzip > "$BACKUP_PATH"

if [ "${S3_SSE}" = "aws:kms" ] && [ -n "${S3_SSE_KMS_KEY_ID}" ]; then
  aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET_NAME/$BACKUP_NAME" \
    --sse aws:kms \
    --sse-kms-key-id "$S3_SSE_KMS_KEY_ID"
elif [ "${S3_SSE}" = "AES256" ]; then
  aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET_NAME/$BACKUP_NAME" \
    --sse AES256
else
  aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET_NAME/$BACKUP_NAME"
fi

if [ -n "${BACKUP_RETENTION_DAYS}" ]; then
  cutoff_epoch=$(date -v -${BACKUP_RETENTION_DAYS}d +%s)
  aws s3api list-objects-v2 --bucket "$S3_BUCKET_NAME" --prefix "backup-" \
    --query 'Contents[].[Key,LastModified]' --output text | while read -r key last_modified; do
      object_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${last_modified%%.*}" +%s 2>/dev/null || echo 0)
      if [ "$object_epoch" -gt 0 ] && [ "$object_epoch" -lt "$cutoff_epoch" ]; then
        echo "Deleting expired backup: $key"
        aws s3 rm "s3://$S3_BUCKET_NAME/$key"
      fi
    done
fi

rm "$BACKUP_PATH"

echo "Backup uploaded successfully!"
