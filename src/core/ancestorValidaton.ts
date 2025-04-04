function isMatch(a: Record<string, string>, b: Record<string, string>): boolean {
    const fields = ["lastName", "firstName", "middleName", "gender", "birthDate"];
    return fields.every(field => a[field] === b[field]);
}

export function findMatchAncestor(
    personXancestor: Record<string, string>[],
    personYancestor: Record<string, string>[]
): Record<string, string> | null {
    for(const xAncestor of personXancestor) {
        for(const yAncestor of personYancestor) {
            if(isMatch(xAncestor, yAncestor)) {
                return xAncestor;
            }
        }
    }
    return null;
}   
