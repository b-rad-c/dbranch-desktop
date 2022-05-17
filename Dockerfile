FROM node:latest

RUN dpkg --add-architecture i386
RUN apt-get update && apt-get install -y zip wine wine32 wine64 apt-transport-https dirmngr gnupg ca-certificates
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN echo "deb https://download.mono-project.com/repo/debian stable-buster main" | tee /etc/apt/sources.list.d/mono-official-stable.list
RUN apt update && apt install -y mono-devel

VOLUME /out
WORKDIR /dbranch

COPY . ./
RUN npm install
RUN npm run build-linux
RUN npm run make
# RUN npx electron-forge make -p win32

CMD mv /dbranch/out/make/zip/linux/x64/*.zip /out/