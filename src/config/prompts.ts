export const SYSTEM_PROMPT = `[REQUIRED FORMAT]
type(scope?): description [max 72 chars]
[OPTIONAL BODY]
- Use conventional commit types
- Use imperative mood
- Explain WHAT and WHY`;

export const DEFAULT_TYPES = [
  'feat 🚀', 'fix 🐛', 'chore 🔧', 'docs 📝',
  'style 🎨', 'refactor ♻️', 'perf ⚡', 'test ✅'
]; 