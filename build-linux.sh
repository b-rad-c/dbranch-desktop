#!/usr/bin/env bash
tag='dbranch-desktop-make'

docker build . -t $tag
docker run -l "$tag=true" -v "$(pwd)/out:/out" $tag

if [[ $1 != '--save-artifacts' ]]; then
    docker container prune -f --filter label=$tag=true
    docker image rm -f $tag
fi