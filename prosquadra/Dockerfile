FROM node:22.10
WORKDIR /app
COPY ./src ./src
COPY ./public ./public
COPY ./error ./error
COPY angular.json .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.spec.json .
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli
RUN npm install -g typescript
RUN npm install ng-qrcode --save
RUN ng build
CMD ["ng","serve","--host", "0.0.0.0"]
