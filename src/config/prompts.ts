export const getSystemPrompt = (types: string[], scopes: string[]) =>
  `Generate ONE Conventional Commit message for these changes using:
Allowed types: ${types.join(", ")}
Suggested scopes: ${scopes.join(", ")}

Format: type(scope?): verb [specific change] [version if applicable]

Rules:
1. Single message combining main changes
2. Prioritize dependency updates with versions
3. 72 characters, no markdown/emojis

Examples:
chore(deps): update sonner to v2.0.0
 fix(${scopes[0]}): resolve input validation
 ${types[0]}(api): add new endpoint`; 

export const DEFAULT_TYPES = [
   "feat 🚀",
   "fix 🐛",
   "chore 🔧",
   "docs 📝",
   "style 🎨",
   "refactor ♻️",
   "perf ⚡",
   "test ✅",
];
