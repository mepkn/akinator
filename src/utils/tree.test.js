import { describe, expect, it } from 'vitest'
import { startingTree } from '../data/animals.js'
import {
  cleanAnimalName, cleanQuestion, countAnimals, getNode, hasAnimal, insertAnimal, validateTree,
} from './tree.js'

describe('starting tree', () => {
  it('is well-formed (every question has yes & no, no duplicate animals)', () => {
    expect(validateTree(startingTree)).toEqual([])
  })
  it('knows 50 animals', () => {
    expect(countAnimals(startingTree)).toBe(50)
  })
})

describe('learning', () => {
  it('inserts a new animal on the correct branch', () => {
    const path = ['no', 'no', 'no', 'yes', 'no', 'yes', 'no', 'no', 'yes', 'yes', 'yes'] // → Tiger
    expect(getNode(startingTree, path).name).toBe('Tiger')
    const t = insertAnimal(startingTree, path, 'Leopard', 'Does it have spots?', 'yes')
    const node = getNode(t, path)
    expect(node.yes.name).toBe('Leopard')
    expect(node.no.name).toBe('Tiger')
    expect(countAnimals(t)).toBe(51)
    expect(validateTree(t)).toEqual([])
    expect(countAnimals(startingTree)).toBe(50) // original untouched
    expect(hasAnimal(t, ' leopard ')).toBe(true)
  })
})

describe('input checks', () => {
  it('cleans animal names', () => {
    expect(cleanAnimalName('  giraffe ')).toEqual({ ok: true, value: 'Giraffe' })
    expect(cleanAnimalName('polar   BEAR').value).toBe('Polar Bear')
    expect(cleanAnimalName('x').ok).toBe(false)
    expect(cleanAnimalName('cat123').ok).toBe(false)
    expect(cleanAnimalName('chutiya').ok).toBe(false)
    expect(cleanAnimalName('Gadha').ok).toBe(true)
  })
  it('cleans questions', () => {
    expect(cleanQuestion('does it have a long neck').value).toBe('Does it have a long neck?')
    expect(cleanQuestion('short').ok).toBe(false)
    expect(cleanQuestion('is it a fucking cat?').ok).toBe(false)
    expect(cleanQuestion('Does it grasp things?').ok).toBe(true)
  })
})
