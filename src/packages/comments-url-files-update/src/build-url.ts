import {
    buildMessage,
    createPrComment,
    deletePrComment,
    getPullRequest,
} from './github';
import {getInput} from '@actions/core';

export function getAllLinks(){

}


export async function getAllLinks(siteUrl: string,) {


        if (getInput('comment') === 'true') {
            await createPrComment();
        }

        return false;

    await deletePrComment();
    return true;
}
