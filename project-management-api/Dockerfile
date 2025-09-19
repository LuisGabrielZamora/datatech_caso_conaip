# Install dependencies only when needed
FROM node:22-alpine3.22 AS dependencies

# Define the new Time Zone
RUN apk add -U tzdata
ENV TZ=Etc/GMT+5
RUN cp /usr/share/zoneinfo/Etc/GMT+5 /etc/localtime

# Install pnpm
RUN npm install -g pnpm

# Clean the npm cache
RUN npm cache clean --force

# RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app with cache dependencies
FROM node:22-alpine3.22 AS builder

# Define the new Time Zone
RUN apk add --no-cache tzdata
ENV TZ=Etc/GMT+5
RUN cp /usr/share/zoneinfo/Etc/GMT+5 /etc/localtime

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image, copy all the files and run next
FROM node:22-alpine3.22 AS runner

# Define the new Time Zone
RUN apk add --no-cache tzdata
ENV TZ=Etc/GMT+5
RUN cp /usr/share/zoneinfo/Etc/GMT+5 /etc/localtime

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main" ]