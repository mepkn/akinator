import { blocklist } from '../data/blocklist.js'

// ---------- Tree helpers ----------

export function listAnimals(node) {
  if (!node) return []
  if (node.type === 'animal') return [node.name]
  return [...listAnimals(node.yes), ...listAnimals(node.no)]
}

export function countAnimals(node) {
  return listAnimals(node).length
}

export function hasAnimal(node, name) {
  const key = name.trim().toLowerCase()
  return listAnimals(node).some((n) => n.toLowerCase() === key)
}

export function getNode(tree, path) {
  return path.reduce((node, step) => node[step], tree)
}

/**
 * Returns a NEW tree where the leaf at `path` is replaced by a question that
 * separates the new animal from the old one.
 * path: array of 'yes' / 'no' steps from the root to the wrong guess.
 * newAnswer: 'yes' or 'no' – the answer to `question` for the new animal.
 */
export function insertAnimal(tree, path, newName, question, newAnswer) {
  if (path.length === 0) {
    const oldLeaf = tree
    const newLeaf = { type: 'animal', name: newName }
    return {
      type: 'question',
      text: question,
      yes: newAnswer === 'yes' ? newLeaf : oldLeaf,
      no: newAnswer === 'yes' ? oldLeaf : newLeaf,
    }
  }
  const [step, ...rest] = path
  return { ...tree, [step]: insertAnimal(tree[step], rest, newName, question, newAnswer) }
}

/** Returns a list of problems; an empty list means the tree is well-formed. */
export function validateTree(tree) {
  const errors = []
  const seen = new Set()
  const walk = (node, where) => {
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

export function containsBadWord(text) {
  const lower = text.toLowerCase()
  const words = lower.split(/[^a-z]+/).filter(Boolean)
  const compact = words.join('')
  return blocklist.some((bad) =>
    words.some((w) => w === bad || (bad.length >= 4 && w.startsWith(bad))) ||
    (bad.length >= 5 && compact.includes(bad)),
  )
}

const PROPER = 'Please use a proper animal name / question'

/** Returns { ok: true, value } or { ok: false, error }. */
export function cleanAnimalName(raw) {
  const text = raw.trim().replace(/\s+/g, ' ')
  if (text.length < 2 || text.length > 30) return { ok: false, error: 'Animal name must be 2–30 characters.' }
  if (!/^[A-Za-z ]+$/.test(text)) return { ok: false, error: 'Please use letters and spaces only.' }
  if (containsBadWord(text)) return { ok: false, error: PROPER }
  const value = text.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
  return { ok: true, value }
}

export function cleanQuestion(raw) {
  let text = raw.trim().replace(/\s+/g, ' ')
  if (text && !text.endsWith('?')) text += '?'
  if (text.length < 8 || text.length > 100) return { ok: false, error: 'Question must be 8–100 characters.' }
  if (containsBadWord(text)) return { ok: false, error: PROPER }
  return { ok: true, value: text.charAt(0).toUpperCase() + text.slice(1) }
}

export function withArticle(name) {
  return (/^[aeiou]/i.test(name) ? 'an ' : 'a ') + name
}
