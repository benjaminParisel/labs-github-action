import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
    try {
        // get information on everything
        const token = core.getInput('github-token', {required: true})
        // const token = core.getInput('github-token', {required: true})
        const octokit = github.getOctokit(token)
        const context = github.context

        // Request the pull request diff from the GitHub API
        // const {data: prDiff} = await octokit.rest.pulls.get({
        //     owner: context.repo.owner,
        //     repo: context.repo.repo,
        //     // @ts-ignore
        //     pull_number: context.payload.pull_request.number,
        //     mediaType: {
        //         format: "json",
        //     },
        // });
        const {data: jsonPr} = await octokit.rest.pulls.get({
            owner: 'benjaminParisel',
            repo: 'gh-pr-diff-checker',
            // @ts-ignore
            pull_number: context.payload.pull_request.number,
            mediaType: {
                format: "json",
            },
        });

        console.log('data:', jsonPr);
        // @ts-ignore
        // let files : parseDiff.File[] = parseDiff(prDiff);
        // let inputStringDiff: string = core.getInput('diffDoesNotContain');
        // let diffDoesNotContain: Array<string> = JSON.parse(inputStringDiff);

        let filteredExtensions = JSON.parse(core.getInput("extensionsToCheck"));
        // let result: prDiffResult= validate(files, filteredExtensions,diffDoesNotContain);
        // if(!result.isDiffValid) {
        //     core.setFailed(`The PR should not include one of ${diffDoesNotContain.toString()}`);
        // }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
