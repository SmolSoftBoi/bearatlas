FROM node:22-alpine

# Enable Corepack for Yarn
RUN corepack enable

WORKDIR /workspace

# Copy package files
COPY package.json yarn.lock ./
COPY packages/worker/package.json ./packages/worker/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN cd apps/web && yarn prisma generate

CMD ["yarn", "worker"]