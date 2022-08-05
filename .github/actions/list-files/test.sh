

json=$(curl -s "https://api.github.com/repos/bonitasoft/bonita-doc/pulls/2067/files" | jq 'map(select( .status as $status | ["modified", "added", "deleted"] | index($status).filename,.status ))')
toto=$(echo $json)
echo $toto
#node formatChanges.js $toto




#bonitasoft/bonita-doc/pull/2102
https://api.github.com/repos/bonitasoft/bonita-doc/pulls/2102/files