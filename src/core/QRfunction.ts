import { checkPrime } from "crypto";
import { TreeNode } from "./tree";

export function generateQrCode(ancestor: TreeNode): string {
    const qrCodeData = JSON.stringify({
        id: ancestor.id,
        data: ancestor.data,
        checkDigit: ancestor.checkDigit,
    });
    return Buffer.from(qrCodeData).toString("base64");
}

export function scanAncestorQrCode(qrData: string): TreeNode {
    const decodedData = Buffer.from(qrData, "base64").toString("utf-8");
    return JSON.parse(decodedData) as TreeNode;
}