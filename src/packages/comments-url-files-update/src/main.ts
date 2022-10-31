import {setFailed} from '@actions/core';

/**
 * Entrypoint for action.
 */
export async function entrypoint() {
    try {
        //Todo: add something here
    } catch (error: unknown) {
        setFailed(error as Error);
    }
}

void entrypoint();