FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install sequelize-cli globally for migrations
RUN npm install -g sequelize-cli

EXPOSE 5003

CMD ["npm", "start"] 