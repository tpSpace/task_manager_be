# Use an official Node.js image as base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the source code to the working directory
COPY . .

# Build TypeScript code
RUN yarn tsc -p .

# Generate Prisma schema
RUN npx prisma generate

# Expose the port on which your app will run
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_URL=mongodb+srv://admin:1234@cluster0.xsgodaj.mongodb.net/

# Start the application
CMD ["yarn", "run", "dev"]
