import { Person } from "../models/Person";
import { hashField } from "../utils/hash";
import { encryptSingleField } from "../utils/encrypt";

export interface SecurityQuestion {
    question: string;
    field: keyof Person;
    encryptedAnswer: string;
}

export function generateSecurityQuestions(
    matchedAncestor: Person,
    checkDigit: number
): SecurityQuestion[] {
    const questions: {field: keyof Person, question: string}[] = [
        {field: "birthDate", question: `What is ${matchedAncestor.firstName}'s birthday?`},
        {field: "lastName", question: `What is ${matchedAncestor.firstName}'s last name?`},
    ];
    
    return questions.map(q => {
        const hashed = hashField(matchedAncestor[q.field]);
        const encryptedAnswer = JSON.stringify(encryptSingleField(hashed, checkDigit));

        return {
            question: q.question,
            field: q.field,
            encryptedAnswer
        };
    });

}

export function verifySecurityAnswer(
    userAnswer: string,
    encryptedExpectedAnswer: string,
    checkDigit: number
): boolean {
    try {
        if (!userAnswer) return false;
        
        const expectedAnswerValue = JSON.parse(encryptedExpectedAnswer);

        const hashed = hashField(userAnswer);
        const encrypted = encryptSingleField(hashed, checkDigit);
        
        return encrypted === expectedAnswerValue;
    } catch (error) {
        console.error("Error verifying security answer:", error);
        return false;
    }
}