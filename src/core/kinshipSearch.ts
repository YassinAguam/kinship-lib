import { findMatchAncestor } from "./ancestorValidaton";
import { TreeNode } from "./tree";
import { iterateAllNodes } from "./tree";


export function searchKinship(
    personX: TreeNode,
    personY: TreeNode
): TreeNode | null {
    const personXAncestors = iterateAllNodes(personX);
    const personYAncestors = iterateAllNodes(personY);

    const matchAncestor = findMatchAncestor(
        personXAncestors.map(node => node.data),
        personYAncestors.map(node => node.data)
    );

    if (matchAncestor) {
        return personXAncestors.find(node => node.data === matchAncestor) || null;
    }

    return null;
}