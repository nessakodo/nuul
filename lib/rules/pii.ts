import { Confidence, TextLeak } from "@/lib/pipeline/types";

const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phoneRegex = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;
const orderRegex = /\b(?:order|ticket|invoice|ref|case)\s?#?\s?[A-Z0-9-]{6,}\b/gi;
const addressRegex =
  /\b\d{1,5}\s+[A-Z0-9.'-]{2,}(?:\s+[A-Z0-9.'-]{2,}){0,3}\s(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|plaza|plz)\b/gi;
const awsAccessKey = /\bAKIA[0-9A-Z]{16}\b/g;
const githubToken = /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g;
const bearerToken = /\bbearer\s+[A-Za-z0-9._-]{20,}\b/gi;
const seedPhrase = /\b(?:[a-z]+\s){11}([a-z]+)\b/gi;

const confidenceMap: Record<TextLeak["type"], Confidence> = {
  email: "high",
  phone: "high",
  address: "low",
  order: "medium",
  api_key: "high",
  seed: "medium",
  token: "high"
};

export function findTextLeaks(text: string): TextLeak[] {
  const leaks: TextLeak[] = [];

  const pushMatches = (regex: RegExp, type: TextLeak["type"]) => {
    const matches = text.match(regex) ?? [];
    matches.forEach((value) =>
      leaks.push({
        type,
        value,
        confidence: confidenceMap[type],
        suggested: confidenceMap[type] !== "high"
      })
    );
  };

  pushMatches(emailRegex, "email");
  pushMatches(phoneRegex, "phone");
  pushMatches(addressRegex, "address");
  pushMatches(orderRegex, "order");
  pushMatches(awsAccessKey, "api_key");
  pushMatches(githubToken, "token");
  pushMatches(bearerToken, "token");
  pushMatches(seedPhrase, "seed");

  return leaks;
}
