# 未来鹅 - 腾讯云一键部署脚本
# 适用于 Ubuntu 22.04 / 24.04

# ==========================================
# 1. 系统初始化
# ==========================================
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# ==========================================
# 2. 安装 Node.js 22 LTS
# ==========================================
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

node -v && npm -v

# ==========================================
# 3. 安装 PM2（进程守护）
# ==========================================
sudo npm install -g pm2

# ==========================================
# 4. 拉取项目代码
# ==========================================
cd /var/www
sudo git clone https://github.com/wjq0407/Future-Goose.git
sudo chown -R $USER:$USER /var/www/Future-Goose
cd /var/www/Future-Goose

# 使用国内 npm 镜像加速
npm config set registry https://registry.npmmirror.com

# ==========================================
# 5. 构建前端
# ==========================================
npm install
npm run build

# ==========================================
# 6. 配置后端
# ==========================================
cd server
npm install

# 创建 .env（替换为你的智谱 API Key）
echo 'ZHIPU_API_KEY=你的智谱API_KEY' > .env
echo 'PORT=3001' >> .env

# ==========================================
# 7. 启动后端服务（PM2 守护 + 开机自启）
# ==========================================
pm2 start index.js --name "weilai-e-api"
pm2 startup systemd -u $USER --hp $HOME
pm2 save

# ==========================================
# 8. 配置 Nginx
# ==========================================
sudo tee /etc/nginx/sites-available/weilai-e > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    root /var/www/Future-Goose/dist;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript text/plain;

    location /api/chat {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

# 启用站点
sudo ln -sf /etc/nginx/sites-available/weilai-e /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# ==========================================
# 9. 开放防火墙
# ==========================================
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

# ==========================================
# 10. HTTPS 证书（如果有域名）
# ==========================================
# 替换 your-domain.com 为实际域名
# sudo certbot --nginx -d your-domain.com --non-interactive --agree-tos -m 你的邮箱@qq.com

echo ""
echo "========================================"
echo "  未来鹅部署完成！"
echo "  访问地址: http://$(curl -s ifconfig.me)"
echo "========================================"
echo ""
echo "⚠️  修改 server/.env 中的 ZHIPU_API_KEY 后重启："
echo "  pm2 restart weilai-e-api"
echo ""
echo "🔄 更新代码："
echo "  cd /var/www/Future-Goose"
echo "  git pull"
echo "  npm install && npm run build"
echo "  pm2 restart weilai-e-api"
