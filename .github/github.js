module.exports = {
    prepareUrlLinks:  async function ({github, context}) {
            let {FILES, SITE_URL, COMPONENT_NAME} = process.env;
            const {data: pr} = await github.rest.pulls.get({
                owner: context.repo.owner,
                pull_number: context.issue.number,
                repo: context.repo.repo,
            });
            let files = FILES.split(' ');
            console.log('files => ', files);
            let urls = [];
            files.forEach(file => {
                const splitted = file.split('/');
                splitted.shift();
                const pageName = splitted.pop();
                const moduleName = splitted.shift();
                urls.push(`- ${SITE_URL}/${COMPONENT_NAME}/${pr.base.ref}${moduleName === 'ROOT' ? '/' : `/${moduleName}/`}${pageName?.split('.').shift()}`);
            });
            return urls.join('\n');
    }
};
