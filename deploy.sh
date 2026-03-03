#!/bin/bash

# Script deploy QR Generator lên GitHub Pages
# Usage: ./deploy.sh YOUR_GITHUB_TOKEN

GITHUB_TOKEN=$1
REPO_NAME="qr"
USERNAME="dodoanloc"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Vui lòng cung cấp GitHub Token"
    echo "Usage: ./deploy.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "Để lấy token:"
    echo "1. Vào https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Chọn scope: repo"
    echo "4. Copy token và chạy script"
    exit 1
fi

echo "🚀 Bắt đầu deploy QR Generator..."

# 1. Tạo repo trên GitHub
echo "📦 Tạo repo $REPO_NAME..."
curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false}" | grep -q '"id"' && echo "✅ Repo created" || echo "⚠️ Repo may already exist"

# 2. Setup git remote
cd ~/.openclaw/workspace/projects/qr-generator

# Remove old remote if exists
git remote remove origin 2>/dev/null

# Add new remote with token
git remote add origin "https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# 3. Push code
echo "📤 Pushing code..."
git push -u origin main --force

echo ""
echo "✅ Code đã push lên: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "🌐 Để enable GitHub Pages:"
echo "1. Vào: https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Source: Deploy from a branch"
echo "3. Branch: main / (root)"
echo "4. Click Save"
echo ""
echo "🔗 Sau khi enable, truy cập: https://$USERNAME.github.io/$REPO_NAME"
