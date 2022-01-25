#!/bin/bash

testReturnCode() {
    COD_RET=$1
    if [ ${COD_RET} -ne 0 ]; then
        echo -e "\e[31m ERROR ${COD_RET} $2 $NC";
        exit ${COD_RET}
    fi
}

checkError() {
    testReturnCode $1 "$2"
}

merge() {
    FROM=$1
    INTO=$2
    echo "Merging branch '${FROM}' into '${INTO}'"

    echo "**** List all branch****"
    git branch -a
    git checkout 7.10
    git checkout ${INTO} && git pull
    checkError $? "checking out branch ${INTO}"
    git merge --no-commit origin/${FROM}
    checkError $? "merging branch ${FROM} into ${INTO}. Please resolve conflicts manually."
    # only commit if there is something to commit (otherwise the commit command exits with an error code)
    if [  ! -z "$(git status --short)" ]; then
        git commit -m "Merge branch '${FROM}' into '${INTO}'"
        checkError $? "Committing in ${INTO}"
    fi

    echo $(pwd)

    git remote -v

    git push https://github.com/benjaminParisel/gh-pr-diff-checker.git ${INTO}

    checkError $? "pushing remote branch ${INTO}"

}

############################################ main code #####################################"""

merge "7.10" "7.11"
