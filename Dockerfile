FROM node:latest
VOLUME /out
RUN apt-get update && apt-get install -y zip
WORKDIR /dbranch 
COPY . ./
RUN npm install
RUN npm run build-linux
RUN npm run make
CMD mv /dbranch/out/make/zip/linux/x64/*.zip /out/