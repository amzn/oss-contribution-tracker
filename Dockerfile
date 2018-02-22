FROM node:8

COPY ./package.json ./package-lock.json /build/
RUN cd /build && NPM_CONFIG_LOGLEVEL=warn npm install

COPY ./ /build
RUN cd /build && npm run build

EXPOSE 8000

ENV NODE_ENV production

CMD ["node", "/build/build/server/localserver.js"]