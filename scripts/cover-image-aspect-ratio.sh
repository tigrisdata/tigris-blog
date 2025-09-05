#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 1 ] && [ "$#" -ne 2 ]; then
    echo "Usage: $0 <image> [dest]"
    exit 1
fi

old_file="${1}"
new_file="${old_file%.*}.webp"

if [ "$#" -eq 2 ]; then
    new_file="${2}"
fi

ffmpeg -i $old_file -vf 'split[original][copy];[copy]scale=ih*16/9:-1,crop=h=iw*9/16,gblur=sigma=80,eq=saturation=0.9[background];[background][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2' $new_file
