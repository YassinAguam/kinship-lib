import { createHash } from "crypto";
import { Person } from "../models/Person";

export function hashField(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hashPerson(person: Person): Record<string, string> {
    return {
        lastName: hashField(person.lastName),
        firstName: hashField(person.firstName),
        middleName: hashField(person.middleName),
        gender: hashField(person.gender),
        birthDate: hashField(person.birthDate),
    };
}