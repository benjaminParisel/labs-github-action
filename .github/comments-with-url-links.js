const githubUtils = require('./github');
const template = '<!-- previewLinksCheck-->\n';
module.exports = {
    prepareUrlLinks: async function ({github, context}) {
        let {FILES,DELETED,RENAMED, SITE_URL, COMPONENT_NAME} = process.env;
        const {data: pr} = await github.rest.pulls.get({
            owner: context.repo.owner,
            pull_number: context.issue.number,
            repo: context.repo.repo,
        });
        let res = {};
        res.updated = prepareLinks({files: FILES.split(' '), siteUrl: SITE_URL, component: COMPONENT_NAME, branch: pr.base.ref});
        res.deleted = prepareLinks({files: DELETED.split(' '), siteUrl: SITE_URL, component: COMPONENT_NAME, branch: pr.base.ref});
        return res;
    },
    createOrUpdateComments: async function ({github, context}) {
        let {LINKS, HAS_DELETED_FILES} = process.env;
        const header = '## :memo: Check the pages that have been modified\n\n';
        let links = JSON.parse(LINKS);
        let body = buildMessage({header, links ,hasWarningMessage : (HAS_DELETED_FILES === 'true')});
        const {exists, id} = await githubUtils.isCommentExist({github, context, template: template});
        // Delete oldest comment if another comments exist
        if (exists && id) {
            await githubUtils.updateComment({github, context, comment_id: id, body});
            return id;
        }
        const comment = await githubUtils.createComment({github, context, body});
        return comment?.id;
    }
};

function buildMessage({header, links, hasWarningMessage}) {
    const preface =
        'In order to merge this pull request, you need to check your updates with the following url.\n\n';

    const availableLinks = `### :mag: Page list: \n ${links.updated}\n\n\n\n`;
    //Adding deleted or renamed check
    let warningAliasMessage = '';
    if (hasWarningMessage) {
        warningAliasMessage = `\n \n ### :warning: Alias \n At least one page has been renamed, moved or deleted in the Pull Request. Make sure to add [aliases](https://github.com/bonitasoft/bonita-documentation-site/blob/master/docs/content/CONTRIBUTING.adoc#use-alias-to-create-redirects) \n ${links?.deleted} \n`
    }

    return template + header + preface + availableLinks + warningAliasMessage;
}

function prepareLinks({files, siteUrl, component, branch}) {
    let urls = [];
    files.forEach(file => {
        const splitted = file.split('/');
        splitted.shift();
        const pageName = splitted.pop();
        const moduleName = splitted.shift();
        let url = `${siteUrl}/${component}/${branch}${moduleName === 'ROOT' ? '/' : `/${moduleName}/`}${pageName?.split('.').shift()}`;
        urls.push(`- [ ] [${moduleName}/${pageName}](${url})`);
    });
    return urls.join('\n');
}
