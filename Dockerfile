FROM node:20-alpine

WORKDIR /app

copy package*.json ./

RUN npm ci --omit=dev

COPY src ./src

RUN mkdir -p uploads 

EXPOSE 5000

CMD ["npm" , "start"]