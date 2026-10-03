// Starting knowledge ("rulebook") for the expert system.
//
// Each question node: { type: 'question', text, yes: <node>, no: <node> }
// Each leaf:          { type: 'animal', name }
//
// To add or change animals, edit this tree and run `npm test` to check it.
// Every path from the top to an animal must be factually true for that animal.

import type { AnimalNode, QuestionNode, TreeNode } from '../utils/tree.ts'

const q = (text: string, yes: TreeNode, no: TreeNode): QuestionNode => ({ type: 'question', text, yes, no })
const a = (name: string): AnimalNode => ({ type: 'animal', name })

export const startingTree: TreeNode = q(
  'Does it have 6 legs?',
  // Insects
  q(
    'Does it make honey?',
    a('Bee'),
    q(
      'Does it suck blood?',
      a('Mosquito'),
      q('Does it have big, colourful wings?', a('Butterfly'), q('Is it often seen in kitchens at night?', a('Cockroach'), a('Ant'))),
    ),
  ),
  q(
    'Does it have 8 legs?',
    a('Spider'),
    q(
      'Does it have feathers?',
      // Birds
      q(
        'Can it copy words that people say?',
        a('Parrot'),
        q(
          'Does it swim in ponds and lakes?',
          a('Duck'),
          q(
            'Do people keep it on farms for its eggs?',
            a('Hen'),
            q(
              'Does it hunt other animals for food?',
              q('Is it awake mostly at night?', a('Owl'), a('Eagle')),
              q(
                'Does it have a long, colourful tail?',
                a('Peacock'),
                q(
                  'Is it mostly black in colour?',
                  a('Crow'),
                  q('Is it grey and often seen on buildings?', a('Pigeon'), a('Sparrow')),
                ),
              ),
            ),
          ),
        ),
      ),
      q(
        'Does it have legs?',
        q(
          'Can it live both in water and on land?',
          q(
            'Does it have a hard shell?',
            a('Turtle'),
            q('Is it bigger than a human?', a('Crocodile'), a('Frog')),
          ),
          q(
            'Does it have fur or hair?',
            // Mammals
            q(
              'Can it fly?',
              a('Bat'),
              q(
                'Is it commonly kept as a pet at home?',
                q(
                  'Does it bark?',
                  a('Dog'),
                  q('Does it have long ears?', a('Rabbit'), a('Cat')),
                ),
                q(
                  'Does it hunt other animals for food?',
                  q(
                    'Is it a big wild cat?',
                    q('Does it have stripes?', a('Tiger'), a('Lion')),
                    q(
                      'Is it bigger than a human?',
                      a('Bear'),
                      q('Does it howl and hunt in a pack?', a('Wolf'), a('Fox')),
                    ),
                  ),
                  q(
                    'Is it smaller than a cat?',
                    q('Does it have a bushy tail and climb trees?', a('Squirrel'), a('Rat')),
                    q(
                      'Does it have a trunk?',
                      a('Elephant'),
                      q(
                        'Does it have a very long neck?',
                        a('Giraffe'),
                        q(
                          'Does it have black and white stripes?',
                          a('Zebra'),
                          q(
                            'Does it carry its baby in a pouch?',
                            a('Kangaroo'),
                            q(
                              'Can it climb trees easily?',
                              a('Monkey'),
                              q(
                                'Does it live in the desert?',
                                a('Camel'),
                                q(
                                  'Does it live in forests and run very fast?',
                                  a('Deer'),
                                  q(
                                    'Do people drink its milk every day?',
                                    q(
                                      'Is it black and does it love to sit in water?',
                                      a('Buffalo'),
                                      q('Does it have a beard?', a('Goat'), a('Cow')),
                                    ),
                                    q(
                                      'Does it give us wool?',
                                      a('Sheep'),
                                      q(
                                        'Does it have a flat nose called a snout?',
                                        a('Pig'),
                                        q('Do people ride it in races?', a('Horse'), a('Donkey')),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            a('Lizard'),
          ),
        ),
        q(
          'Does it live in water?',
          q(
            'Does it breathe air like us?',
            q('Is it the biggest animal in the world?', a('Whale'), a('Dolphin')),
            q('Is it a dangerous hunter with sharp teeth?', a('Shark'), a('Fish')),
          ),
          q('Does it live in the soil and help farmers?', a('Earthworm'), a('Snake')),
        ),
      ),
    ),
  ),
)
