#!/bin/sh
# Write application.properties from environment variables injected by Docker/docker-compose
set -e

# Fail fast if required secrets are not set
: "${SPRING_DATASOURCE_URL:?SPRING_DATASOURCE_URL is required}"
: "${SPRING_DATASOURCE_USERNAME:?SPRING_DATASOURCE_USERNAME is required}"
: "${SPRING_DATASOURCE_PASSWORD:?SPRING_DATASOURCE_PASSWORD is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"

mkdir -p /app/config
cat > /app/config/application.properties <<EOF
server.port=8000
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false
spring.jackson.serialization.write-dates-as-timestamps=false
jwt.secret=${JWT_SECRET}
jwt.expiration-ms=${JWT_EXPIRATION_MS:-86400000}
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:-http://localhost:5173}
logging.level.com.sustainability=INFO
EOF

exec java -jar /app/app.jar --spring.config.location=file:/app/config/application.properties
