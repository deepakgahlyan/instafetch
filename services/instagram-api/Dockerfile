FROM node:22-slim

WORKDIR /app

COPY services/instagram-api/package.json ./package.json
RUN npm install --omit=dev

COPY lib/instagram/direct.ts ./lib/instagram/direct.ts
COPY services/instagram-api/server.ts ./server.ts

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["npm", "start"]
