import { Person } from "./models/Person";
import { hashPerson } from "./utils/hash";
import { encryptHashFields } from "./utils/encrypt";
import { decryptHashFields } from "./utils/decrypt";
import { encodePerson, setParent, getKinshipPath } from "./core/tree";
import { searchKinship } from "./core/kinshipSearch";
import { generateQrCode, scanAncestorQrCode } from "./core/QRfunction";
import { generateSecurityQuestions, verifySecurityAnswer } from "./core/credential";

const checkDigit = 5;

const personX: Person = {
  lastName: "Aguam",
  firstName: "Yassin",
  middleName: "Adapun",
  gender: "Male",
  birthDate: "2000-09-08",
};

const personY: Person = {
  lastName: "Adapun",
  firstName: "Yassier",
  middleName: "Gania",
  gender: "Male",
  birthDate: "1997-05-20",
};

const sharedAncestor: Person = {
  lastName: "Adapun",
  firstName: "Bashier",
  middleName: "Marohomsalic",
  gender: "Male",
  birthDate: "1964-05-10",
};

console.log(" \n Hashed Person X:", hashPerson(personX));
console.log("\n Hashed Person Y:", hashPerson(personY));

const sharedHash = hashPerson(sharedAncestor);
const sharedEncrypted = encryptHashFields(sharedHash, checkDigit);

console.log("\n Shared Ancestor Hash Fields:");
Object.entries(sharedHash).forEach(([key, value]) => {
  console.log(` - ${key}: ${value}`);
});

console.log("\n Encrypted Shared Ancestor Fields:");
Object.entries(sharedEncrypted).forEach(([key, value]) => {
  console.log(` - ${key}: ${value}`);
});

const sharedDecrypted = decryptHashFields(sharedEncrypted, checkDigit);
console.log("\n Integrity Check: Decrypted Fields Match Original?");
Object.keys(sharedHash).forEach((key) => {
  const original = sharedHash[key];
  const decrypted = sharedDecrypted[key];
  const match = original === decrypted ? "Match" : "Mismatch";
  console.log(` - ${key}: ${match}`);
});


const encryptedX = encryptHashFields(hashPerson(personX), checkDigit);
const encryptedY = encryptHashFields(hashPerson(personY), checkDigit);
console.log("\n Encrypted Hashes of Person X:", encryptedX);
console.log("\n Encrypted Hashes of Person Y:", encryptedY);


const encodedX = encodePerson(personX, checkDigit);
const encodedY = encodePerson(personY, checkDigit);
const encodedShared = encodePerson(sharedAncestor, checkDigit);


setParent(encodedX, encodedShared);
setParent(encodedY, encodedShared);


const matched = searchKinship(encodedX, encodedY);
if (!matched) {
  console.log("\n No shared ancestor found. Kinship path not available.");
  process.exit();
}
console.log("\n Shared Ancestor Found:", matched.id);


const qr = generateQrCode(matched);
console.log("\n QR Code Base64:", qr);


const scanned = scanAncestorQrCode(qr);
console.log("\n Scanned Ancestor ID:", scanned.id);
console.log("\n Encrypted Fields:", scanned.data);


const questions = generateSecurityQuestions(sharedAncestor, scanned.checkDigit);
console.log("\n Security Questions:");
questions.forEach((q, i) => console.log(`${i + 1}. ${q.question}`));


const Answers: Record<string, string> = {
  birthDate: "1964-05-10",
  lastName: "Adapun"
};

let allCorrect = true;
questions.forEach((q) => {
  const input = Answers[q.field];
  const result = verifySecurityAnswer(input, q.encryptedAnswer, scanned.checkDigit);
  console.log(`\n ${q.question}`);
  console.log(` - User Answer: ${input}`);
  console.log(` - Correct? ${result ? " Yes" : " No"}`);
  if (!result) allCorrect = false;
});


if (allCorrect) {
  const decrypted = decryptHashFields(scanned.data, scanned.checkDigit);
  console.log("\n Decrypted Ancestor Hash Fields:");
  Object.entries(decrypted).forEach(([k, v]) => console.log(` - ${k}: ${v}`));


  const path = getKinshipPath(encodedX, encodedY, matched.id);
  if (path) {
    console.log("\n Kinship Path from Person X:");
    path.pathX.forEach(p => console.log(` - ${p.id}`));

    console.log("\n Kinship Path from Person Y:");
    path.pathY.forEach(p => console.log(` - ${p.id}`));
  } else {
    console.log("\n Could not trace kinship path.");
  }
} else {
  console.log("\n Validation failed. Cannot decrypt ancestor info.");
  console.log("\n Kinship result access blocked due to failed verification.");
}
