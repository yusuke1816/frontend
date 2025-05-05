FROM node:18

WORKDIR /app

# 依存関係インストールのために先に package.json をコピー
COPY package*.json ./

# ここで next を含む依存関係をインストール
RUN npm install

# アプリ本体をコピー
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
