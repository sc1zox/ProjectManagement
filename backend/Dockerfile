FROM node:22.10
WORKDIR /app
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./index.ts .
COPY .env .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
RUN npm install
RUN npm install -g typescript
CMD npm run dev
