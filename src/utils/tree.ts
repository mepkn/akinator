import { blocklist } from '../data/blocklist.ts'

// ---------- Types ----------

export type Answer = 'yes' | 'no'
export type AnimalNode = { type: 'animal'; name: string }
export type QuestionNode = { type: 'question'; text: string; yes: TreeNode; no: TreeNode }
export type TreeNode = AnimalNode | QuestionNode

export type CleanResult = { ok: true; value: string } | { ok: false; error: string }

// ---------- Tree helpers ----------

export function listAnimals(node: TreeNode | undefined): string[] {
  if (!node) return []
  if (node.type === 'animal') return [node.name]
  return [...listAnimals(node.yes), ...listAnimals(node.no)]
}

export function countAnimals(node: TreeNode): number {
  return listAnimals(node).length
}

export function hasAnimal(node: TreeNode, name: string): boolean {
  const key = name.trim().toLowerCase()
  return listAnimals(node).some((n) => n.toLowerCase() === key)
}

export function getNode(tree: TreeNode, path: Answer[]): TreeNode {
  return path.reduce<TreeNode>((node, step) => (node.type === 'question' ? node[step] : node), tree)
}

/**
 * Returns a NEW tree where the leaf at `path` is replaced by a question that
 * separates the new animal from the old one.
 * path: array of 'yes' / 'no' steps from the root to the wrong guess.
 * newAnswer: 'yes' or 'no' – the answer to `question` for the new animal.
 */
export function insertAnimal(
  tree: TreeNode,
  path: Answer[],
  newName: string,
  question: string,
  newAnswer: Answer,
): TreeNode {
  if (path.length === 0) {
    const oldLeaf = tree
    const newLeaf: AnimalNode = { type: 'animal', name: newName }
    return {
      type: 'question',
      text: question,
      yes: newAnswer === 'yes' ? newLeaf : oldLeaf,
      no: newAnswer === 'yes' ? oldLeaf : newLeaf,
    }
  }
  if (tree.type !== 'question') throw new Error('Path goes past an animal')
  const [step, ...rest] = path
  return { ...tree, [step]: insertAnimal(tree[step], rest, newName, question, newAnswer) }
}

/**
 * Returns a list of problems; an empty list means the tree is well-formed.
 * Takes `unknown` because it also checks trees loaded from localStorage.
 */
export function validateTree(tree: unknown): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  const walk = (value: unknown, where: string) => {
    const node = value as Record<string, unknown> | null
    if (!node || typeof node !== 'object') {
      errors.push(`Missing node at ${where}`)
    } else if (node.type === 'animal') {
      if (typeof node.name !== 'string' || !node.name.trim()) errors.push(`Animal without a name at ${where}`)
      const key = String(node.name).toLowerCase()
      if (seen.has(key)) errors.push(`Duplicate animal "${node.name}"`)
      seen.add(key)
    } else if (node.type === 'question') {
      if (typeof node.text !== 'string' || !node.text.trim()) errors.push(`Question without text at ${where}`)
      walk(node.yes, `${where} → yes`)
      walk(node.no, `${where} → no`)
    } else {
      errors.push(`Unknown node type at ${where}`)
    }
  }
  walk(tree, 'root')
  return errors
}

// ---------- Input checks (students type freely) ----------

export function containsBadWord(text: string): boolean {
  const lower = text.toLowerCase()
  const words = lower.split(/[^a-z]+/).filter(Boolean)
  const compact = words.join('')
  return blocklist.some((bad) =>
    words.some((w) => w === bad || (bad.length >= 4 && w.startsWith(bad))) ||
    (bad.length >= 5 && compact.includes(bad)),
  )
}

const PROPER = 'Please use a proper animal name / question'

export function cleanAnimalName(raw: string): CleanResult {
  const text = raw.trim().replace(/\s+/g, ' ')
  if (text.length < 2 || text.length > 30) return { ok: false, error: 'Animal name must be 2–30 characters.' }
  if (!/^[A-Za-z ]+$/.test(text)) return { ok: false, error: 'Please use letters and spaces only.' }
  if (containsBadWord(text)) return { ok: false, error: PROPER }
  const value = text.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
  return { ok: true, value }
}

export function cleanQuestion(raw: string): CleanResult {
  let text = raw.trim().replace(/\s+/g, ' ')
  if (text && !text.endsWith('?')) text += '?'
  if (text.length < 8 || text.length > 100) return { ok: false, error: 'Question must be 8–100 characters.' }
  if (containsBadWord(text)) return { ok: false, error: PROPER }
  return { ok: true, value: text.charAt(0).toUpperCase() + text.slice(1) }
}

export function withArticle(name: string): string {
  return (/^[aeiou]/i.test(name) ? 'an ' : 'a ') + name
}
