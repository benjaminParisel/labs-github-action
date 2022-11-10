module.exports = {
    isCommentExist: async function ({github, context, header}) {
        const {data: comments} = await github.rest.issues.listComments({
            owner: context.repo.owner,
            issue_number: context.issue.number,
            repo: context.repo.repo,
        });
        console.log('header', header);
        for (const comment of comments) {
            if (comment.body?.startsWith(header)) {
                console.log('comment.id', comment.id);
                return {
                    exists: true,
                    id: comment.id,
                };
            }
        }

        return {
            exists: false,
            id: null,
        };
    },
    createComment: async function ({github, context, body}) {
        await github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: body
        })
    },
    deleteComment: async function ({github, context, commentIdToDelete}) {
        console.log('delete id', commentIdToDelete);
        await github.rest.issues.deleteComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentIdToDelete,
        });
    }
}



