# Python Version Fix for Netlify Build

## Problem
Netlify was failing because your repository contains `requirements.txt`, which triggers Python dependency installation. However, it was trying to use Python 3.14.3, which doesn't have prebuilt wheels for `psycopg2-binary==2.9.10`, causing a `pg_config` compilation error.

## Solution
Pin Python to version 3.11.9, which has prebuilt wheels for psycopg2-binary and will work correctly with Netlify's build process.

## What We're Adding

Two key additions to fix the Python build:

1. **`.python-version`** - Tells Netlify/mise to use Python 3.11.9
2. **Updated `netlify.toml`** - Sets `PYTHON_VERSION = "3.11.9"` in the build environment

## How to Apply

### Option 1: Apply the Patch (Recommended)
```bash
# In your CompliCore repository
git apply 0002-python-version-fix.patch
git push origin main
```

### Option 2: Manual File Creation
Create these two files in your GitHub repository:

**`.python-version`**
```
3.11.9
```

**`netlify.toml`** (update existing file)
```toml
[build]
command = "npm run build"
publish = ".next"

[build.environment]
NODE_VERSION = "20"
PYTHON_VERSION = "3.11.9"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

## What Happens Next
1. After you push these changes to GitHub
2. Netlify will detect the changes and start a new build
3. Python 3.11.9 will be installed (with prebuilt wheels for psycopg2-binary)
4. Node.js build will proceed via `npm run build`
5. Your Next.js app will deploy successfully to **complicore.live**

## Why This Works
- Python 3.11.9 has prebuilt wheels for psycopg2-binary, so no compilation is needed
- The `netlify.toml` still commands Node.js to build your Next.js app
- This fixes the root cause: Python dependency installation was succeeding only to fail at compilation
- Your Next.js application will build and deploy as expected
