FROM node:24-alpine

WORKDIR /app

# Copy package.json and install dependencies first for caching
COPY package*.json ./
RUN npm install

# Copy remaining source code
COPY . .


EXPOSE 5000

# Use nodemon or node depending on your package.json scripts
CMD ["npm", "run", "dev"]