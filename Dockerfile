# Step 1: Use the official Node.js image as a base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install app dependencies
RUN npm install

# Step 5: Copy the entire project to the container
COPY . .

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the port on which the app will run
EXPOSE 3000

# Step 8: Define the command to run the app
CMD ["npm", "run", "start:prod"]
