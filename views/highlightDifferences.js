const diff = require('diff');

function highlightDifferences(reference, target) {
    let diffResult = diff.diffWords(reference, target);
    return diffResult.map(part => {
        if (part.added) {
            return `<span class="text-diff">${part.value}</span>`;
        } else if (part.removed) {
            return `<del>${part.value}</del>`;
        }
        return part.value;
    }).join('');
}

module.exports = highlightDifferences;
