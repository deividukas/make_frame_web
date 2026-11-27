#!/bin/bash
BASE="http://localhost:5000"
PASS=0
FAIL=0
BOT_UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

check() {
  local desc="$1"
  local result="$2"
  if [ "$result" = "PASS" ]; then
    echo "[PASS] $desc"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] $desc"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== SEO & Indexing Verification ==="
echo ""

# 1. robots.txt allows /api/resources
ROBOTS=$(curl -s "$BASE/robots.txt")
echo "$ROBOTS" | grep -q "Allow: /api/resources"
[ $? -eq 0 ] && check "robots.txt allows /api/resources" "PASS" || check "robots.txt allows /api/resources" "FAIL"

echo "$ROBOTS" | grep -q "Allow: /api/content"
[ $? -eq 0 ] && check "robots.txt allows /api/content" "PASS" || check "robots.txt allows /api/content" "FAIL"

echo "$ROBOTS" | grep -q "Disallow: /api/"
[ $? -eq 0 ] && check "robots.txt disallows /api/ (catch-all)" "PASS" || check "robots.txt disallows /api/ (catch-all)" "FAIL"

echo "$ROBOTS" | grep -q "Sitemap: https://make-frame.com/sitemap.xml"
[ $? -eq 0 ] && check "robots.txt has sitemap URL" "PASS" || check "robots.txt has sitemap URL" "FAIL"

# 2. Public API GET has NO X-Robots-Tag
HEADERS_PUBLIC=$(curl -sI "$BASE/api/content")
echo "$HEADERS_PUBLIC" | grep -qi "X-Robots-Tag"
[ $? -ne 0 ] && check "GET /api/content has NO X-Robots-Tag" "PASS" || check "GET /api/content has NO X-Robots-Tag" "FAIL"

# 3. Admin API still has X-Robots-Tag
HEADERS_ADMIN=$(curl -sI "$BASE/api/admin/content")
echo "$HEADERS_ADMIN" | grep -qi "X-Robots-Tag"
[ $? -eq 0 ] && check "GET /api/admin/content HAS X-Robots-Tag" "PASS" || check "GET /api/admin/content HAS X-Robots-Tag" "FAIL"

# 4. POST to public API still has X-Robots-Tag
HEADERS_POST=$(curl -sI -X POST "$BASE/api/resources")
echo "$HEADERS_POST" | grep -qi "X-Robots-Tag"
[ $? -eq 0 ] && check "POST /api/resources HAS X-Robots-Tag" "PASS" || check "POST /api/resources HAS X-Robots-Tag" "FAIL"

# 5. /auth routes still have X-Robots-Tag
HEADERS_AUTH=$(curl -sI "$BASE/auth/login")
echo "$HEADERS_AUTH" | grep -qi "X-Robots-Tag"
[ $? -eq 0 ] && check "/auth routes HAS X-Robots-Tag" "PASS" || check "/auth routes HAS X-Robots-Tag" "FAIL"

# 6. Sitemap returns valid XML
SITEMAP=$(curl -s "$BASE/sitemap.xml")
echo "$SITEMAP" | grep -q "<urlset"
[ $? -eq 0 ] && check "sitemap.xml returns valid XML" "PASS" || check "sitemap.xml returns valid XML" "FAIL"

echo "$SITEMAP" | grep -q "make-frame.com/resources/"
[ $? -eq 0 ] && check "sitemap.xml includes resource URLs" "PASS" || check "sitemap.xml includes resource URLs" "FAIL"

# 7. Bot SSR for resource page (use first slug from sitemap)
SLUG=$(echo "$SITEMAP" | grep -oP 'make-frame\.com/resources/\K[^<]+' | head -1)
if [ -n "$SLUG" ]; then
  BOT_HTML=$(curl -s -A "$BOT_UA" "$BASE/resources/$SLUG")
  BOT_HEADERS=$(curl -sI -A "$BOT_UA" "$BASE/resources/$SLUG")

  echo "$BOT_HTML" | grep -q 'lang="en"'
  [ $? -eq 0 ] && check "Bot SSR HTML has lang=en" "PASS" || check "Bot SSR HTML has lang=en" "FAIL"

  echo "$BOT_HTML" | grep -q 'https://make-frame.com'
  [ $? -eq 0 ] && check "Bot SSR has absolute URLs" "PASS" || check "Bot SSR has absolute URLs" "FAIL"

  echo "$BOT_HEADERS" | grep -qi "Link:.*canonical"
  [ $? -eq 0 ] && check "Bot SSR returns Link canonical header" "PASS" || check "Bot SSR returns Link canonical header" "FAIL"

  echo "$BOT_HTML" | grep -oP 'og:image.*?content="[^"]*"' | grep -q 'https://make-frame.com'
  [ $? -eq 0 ] && check "Bot SSR og:image uses absolute URL" "PASS" || check "Bot SSR og:image uses absolute URL" "FAIL"
else
  echo "[SKIP] No published resources found in sitemap to test bot SSR"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
