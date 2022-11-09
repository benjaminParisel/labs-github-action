module.exports = {
    prepareUrlLinks:  async function ({github, context}) {
            let {FILES, SITE_URL, COMPONENT_NAME} = process.env;
            const {data: pr} = await github.rest.pulls.get({
                owner: context.repo.owner,
                pull_number: context.issue.number,
                repo: context.repo.repo,
            });
            let files = FILES.split(' ');
            let urls = [];
            files.forEach(file => {
                const splitted = file.split('/');
                splitted.shift();
                const pageName = splitted.pop();
                const moduleName = splitted.shift();
                urls.push(`- ${SITE_URL}/${COMPONENT_NAME}/${pr.base.ref}${moduleName === 'ROOT' ? '/' : `/${moduleName}/`}${pageName?.split('.').shift()}`);
            });
            return urls.join('\n');
    },
    createOrUpdateComments: async function ({github,context}){
        let {LINKS, RENAMED_FILES, HAS_DELETED_FILES} = process.env;
        const HEADER=' ## :memo: Pull request files update\n\n';

        let body = buildMessage(HEADER,LINKS,HAS_DELETED_FILES === 'true' || RENAMED_FILES != '');
        const {data: comments} = await github.rest.issues.listComments({
            owner: context.repo.owner,
            issue_number: context.issue.number,
            repo: context.repo.repo,
        });

        for (const comment of comments) {
            if (comment.body?.startsWith(HEADER)) {
                await github.rest.issues.deleteComment({
                    owner: context.repo.owner,
                    issue_number: context.issue.number,
                    repo: context.repo.repo,
                    comment_id: comment.id,
                });
            };
        }

        await github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: body
        })
    },
};
function buildMessage(header,links,hasWarningMessage){
    const preface =
        'In order to merge this pull request, you need to check your updates with the following url.\n\n';

    const availableLinks = `### :mag: Url to check: \n ${links}\n\n\n\n`;
    //Adding deleted or renamed check
    let warningAliasMessage = '';
    if(hasWarningMessage){
        warningAliasMessage='\n \n ### :warning: At least one file are deleted on this pull request, be sure to adding [alias](https://github.com/bonitasoft/bonita-documentation-site/blob/master/docs/content/CONTRIBUTING.adoc#use-alias-to-create-redirects)'    }

    return header + preface + availableLinks + warningAliasMessage;
}
