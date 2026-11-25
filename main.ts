// Unsent: The Micro-Confession Sprint.
//
// A two-part micro-confession: a To: line naming who it was meant
// for, and the unsent message itself, one line written exactly as it
// was typed. Mine is the 47-page report nobody read: I nodded at the
// charts like they were old friends. It feels genuinely unsent
// because it is the draft you type, stare at, and delete — a small
// daily dishonesty everyone recognises and nobody sends. Read the To:
// line like an address, then the message like a whisper you never sent.
import fs from "node:fs";
import path from "node:path";

const ENTRY =
  "To: my boss\nI never read the 47-page report, I just nodded at the charts like they were old friends.";

function problems(text: string): string[] {
  const found: string[] = [];
  const chars = [...text].length;
  if (chars < 1 || chars > 260) found.push(`length ${chars} is outside 1-260`);
  if (text.trim().length === 0) found.push("entry is only white space");
  const lines = text.split("\n");
  if (lines.length !== 2) found.push(`entry has ${lines.length} lines, want 2`);
  if (!lines[0].startsWith("To: ")) found.push("first line is not a To: line");
  const messageChars = [...(lines[1] ?? "")].length;
  if (messageChars < 1 || messageChars > 200) {
    found.push(`message length ${messageChars} is outside 1-200`);
  }
  if (!(lines[1] ?? "").trimEnd().endsWith(".")) {
    found.push("message does not end on a full stop");
  }
  if (!text.includes("47-page report")) found.push("the report is missing");
  return found;
}

function main(): void {
  const bad = problems(ENTRY);
  if (bad.length > 0) {
    throw new Error(`micro-confession is not valid: ${bad.join("; ")}`);
  }
  const outDir = path.resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), ENTRY, { encoding: "utf8", mode: 0o644 });
}

main();
