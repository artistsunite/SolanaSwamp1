# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Use the official nginx template entrypoint to handle environment variable substitution in config
# This will replace $PORT in the template and output to /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/templates
RUN echo 'server { \
    listen ${PORT}; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/templates/default.conf.template

ENV PORT=8080
EXPOSE 8080
# The official nginx image's entrypoint script automatically runs envsubst on templates/*.template
# and puts the result in /etc/nginx/conf.d/
