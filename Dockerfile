# -------- Stage 1: Build the Angular app --------
    FROM node:20-alpine3.18 AS build

    WORKDIR /web/src
    COPY . .
    
    # Install dependencies
    RUN npm i --force
    RUN npm run build
    
    
    FROM nginx:latest AS nginx-build
    
    # Remove default Nginx config
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Custom Nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy Angular build output
    # IMPORTANT: replace `HireMe` with the actual output folder
    COPY --from=build /web/src/dist/HireMe/browser /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    