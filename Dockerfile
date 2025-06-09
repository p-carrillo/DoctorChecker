FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the code
COPY . .

# Create non-root user for better security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of files
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port (even though we won't use it for frontend)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]