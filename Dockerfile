# 1) Use a small official Node image
FROM node:18-alpine

# 2) Create and switch to a working folder inside the container
WORKDIR /app

# 3) Copy only package files first (better caching)
COPY package*.json ./

# 4) Install dependencies
# npm ci = clean install based on package-lock (reproducible)
RUN npm ci

# 5) Copy the rest of the project
COPY . .

# 6) Tell Docker the app listens on 3000
EXPOSE 3000

# 7) Start the app
CMD ["npm", "start"]