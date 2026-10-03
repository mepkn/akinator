// Words that are not allowed in student input (English + Hindi/Hinglish).
// Animal words like kutta, gadha, ullu are deliberately NOT listed.
// Matching is case-insensitive and on whole words; longer words also match
// when hidden inside other text (e.g. with spaces or symbols removed).
export const blocklist: readonly string[] = [
  // English
  'fuck', 'fucker', 'fucking', 'fuk', 'fck', 'shit', 'bullshit', 'bitch', 'bastard',
  'asshole', 'arsehole', 'ass', 'arse', 'dick', 'dickhead', 'cock', 'pussy', 'cunt',
  'whore', 'slut', 'hoe', 'porn', 'porno', 'sex', 'sexy', 'boobs', 'boob', 'tits',
  'penis', 'vagina', 'nude', 'naked', 'rape', 'rapist', 'motherfucker', 'mf', 'wtf',
  'stfu', 'damn', 'crap', 'piss', 'wanker', 'retard', 'idiot', 'stupid', 'moron',
  'dumbass', 'nigger', 'nigga', 'faggot', 'fag',
  
  // Hindi / Hinglish
  'chutiya', 'chutiye', 'chutia', 'chootiya', 'choot', 'chut', 'bhosdi', 'bhosdike',
  'bhosadike', 'bhosda', 'bhosdiwala', 'madarchod', 'maderchod', 'mc', 'bhenchod',
  'behenchod', 'bhanchod', 'bc', 'benchod', 'lund', 'lauda', 'lawda', 'loda', 'lodu',
  'laude', 'lavde', 'gaand', 'gand', 'gandu', 'gaandu', 'randi', 'raand', 'rundi',
  'harami', 'haramkhor', 'haramzada', 'haramzade', 'kamina',
  'kamine', 'kaminey', 'saala', 'saali', 'sala', 'jhant', 'jhaatu', 'jhantu',
  'chod', 'chodu', 'chudai', 'tatte', 'tatti', 'bakchod', 'bakchodi',
  'pagal', 'bewakoof', 'nalayak', 'hijra', 'chakka', 
  'bsdk', 'bkl', 'mkc', 'tmkc', 'bhadwa', 'bhadwe', 'dalla', 'chinal',
]
