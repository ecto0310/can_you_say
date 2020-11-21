#!/bin/bash

theme="[]"

for file_path in $(find "public/data" -type f | gawk -F/ '{print $NF}' | cut -d . -f 1); do
  for cmd in $(cat "public/data/"${file_path}".json" | jq -r 'to_entries|map("\(.key)=\"\(.value)\"")|.[]'); do
    eval ${cmd}
  done
  
  theme=$(
    echo ${theme} |
      jq '.|=.+[{"title":"'${name}'","answerCnt":'${answerCnt}',"path":"'${file_path}'"}]'
  )
done

echo ${theme} > "public/theme.json"
