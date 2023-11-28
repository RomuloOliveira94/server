FROM node:18.18.2-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
EXPOSE 5000
CMD ["npm", "run" , "dev"]