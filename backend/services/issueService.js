const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'issues.json');

async function readIssues() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeIssues(issues) {
    await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
}

async function createIssue(issueData) {
    const issues = await readIssues();
    const issue = {
        id: randomUUID(),
        title: issueData.title,
        description: issueData.description,
        priority: issueData.priority,
        status: issueData.status,
        createdAt: new Date().toISOString(),
    };
    issues.push(issue);
    await writeIssues(issues);
    return issue;
}

async function updateIssueStatus(id, status) {
    const issues = await readIssues();
    const issueIndex = issues.findIndex((issue) => issue.id === id);

    if (issueIndex === -1) {
        return null;
    }

    const issue = issues[issueIndex];
    issue.status = status;
    await writeIssues(issues);
    return issue;
}

module.exports = {
    readIssues,
    createIssue,
    updateIssueStatus,
};