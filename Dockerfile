FROM public.ecr.aws/docker/library/node:23.10-alpine
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json tsconfig.json ./

RUN apk add --no-cache tzdata tini && \
    npm ci --no-fund --no-update-notifier

COPY main.tsx ./

USER node
ENV PORT=8000 DB_FILE=/data/shorts.db
ENV BASE_URL=https://fabricio.gay

EXPOSE 8000
VOLUME /data

CMD ["npm", "start"]
ENTRYPOINT ["/sbin/tini", "--"]
