FROM node:lts-alpine3.20 AS builder

WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./src/ /app/src/
COPY ./public/ /app/public/
RUN npm run build

FROM nginx:stable-alpine3.20

LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.name="instantbox-frontend"
LABEL org.label-schema.vcs-url="https://github.com/pythoninthegrass/instantbox-frontend"
LABEL maintainer="pythoninthegrass <4097471+pythoninthegrass@users.noreply.github.com>"

COPY --from=builder /app/build/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ARG BUILD_DATE
ARG VCS_REF
LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.vcs-ref=$VCS_REF
