FROM node:20.12.0

WORKDIR /work

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]