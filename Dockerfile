FROM debian:trixie

# Install dependencies
RUN apt-get update && apt-get install -y \
    gnupg \
    curl \
    git \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install MongoDB from official repository
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | \
    tee /etc/apt/sources.list.d/mongodb-org-8.0.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies in correct order
WORKDIR /app/common
RUN npm install

WORKDIR /app/backend
RUN npm install

WORKDIR /app/frontend
RUN npm install && npm run build

# Create startup script
RUN echo '#!/bin/bash' > /start.sh && \
    echo 'mkdir -p /data/db' >> /start.sh && \
    echo 'mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db' >> /start.sh && \
    echo 'sleep 5' >> /start.sh && \
    echo 'cd /app/backend' >> /start.sh && \
    echo 'if [ ! -f /data/db/.db_initialized ]; then' >> /start.sh && \
    echo '  echo "Initializing database..."' >> /start.sh && \
    echo '  npm run db-build && touch /data/db/.db_initialized' >> /start.sh && \
    echo '  echo "Database initialization complete"' >> /start.sh && \
    echo 'else' >> /start.sh && \
    echo '  echo "Database already initialized, skipping..."' >> /start.sh && \
    echo 'fi' >> /start.sh && \
    echo 'npm run dev' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
