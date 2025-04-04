import { Person } from "../models/Person";
import { hashPerson } from "../utils/hash";
import { encryptHashFields } from "../utils/encrypt";

export interface TreeNode {
    id: string; 
    data: Record<string, string>;
    checkDigit: number;
    left?: TreeNode;
    right?: TreeNode;
}

function generateId(person: Person): string {
    return `${person.lastName}-${person.firstName}-${person.middleName}-${person.birthDate}`.replace(/\s+/g, "-");
}

export function encodePerson(person: Person, checkDigit: number):TreeNode{
    const hashFields = hashPerson(person);
    const encryptedhashFields = encryptHashFields(hashFields, checkDigit);

    return {
        id: generateId(person),
        data: encryptedhashFields,
        checkDigit,
    };
}

export function setParent(
    child: TreeNode,
    parent: TreeNode
): boolean {
    if (!child.left){
        child.left = parent;
        return true;
    }else if (!child.right){
        child.right = parent;
        return true;
    }else{
        return false;
    }
}

export function iterateAllNodes(
    root: TreeNode,
    visited: TreeNode[] = []
): TreeNode []{
    if (!root) return visited;
    visited.push(root);
    if (root.left) iterateAllNodes(root.left, visited);
    if (root.right) iterateAllNodes(root.right, visited);
    return visited;
}

export function findPathtoAncestor (
    root:TreeNode,
    targetId: string,
    path: TreeNode[] = []
): TreeNode[] | null {
    if (!root) return null;
    const newPath = [...path, root];

    if (root.id === targetId) {
        return newPath;
    }

    const leftPath = root.left && findPathtoAncestor(root.left, targetId, newPath);
    const rightPath = root.right && findPathtoAncestor(root.right, targetId, newPath);
    
    return leftPath || rightPath || null;    
}

export function getKinshipPath(
    personX: TreeNode,
    personY: TreeNode,
    sharedAncestorId: string
): { pathX: TreeNode[]; pathY: TreeNode[]} | null {
    const pathX = findPathtoAncestor(personX, sharedAncestorId);
    const pathY = findPathtoAncestor(personY, sharedAncestorId);

    if (pathX && pathY){
        return {pathX, pathY};
    }
    return null;
}