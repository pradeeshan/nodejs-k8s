# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY app.js .

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
