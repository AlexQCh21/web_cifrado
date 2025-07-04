const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J

const generateKeySquare = (key: string): string[][] => {
  const keySquare: string[][] = Array(5).fill(null).map(() => Array(5).fill(''));
  const keyChars = [...new Set((key.toUpperCase().replace(/J/g, 'I') + ALPHABET).split(''))];
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      keySquare[i][j] = keyChars[i * 5 + j];
    }
  }
  return keySquare;
};

const prepareText = (text: string): string[] => {
  let prepared = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
  const digraphs: string[] = [];
  
  let i = 0;
  while(i < prepared.length) {
    let d1 = prepared[i];
    let d2 = prepared[i + 1];

    if (d2 === undefined) {
      digraphs.push(d1 + 'X');
      break;
    }

    if (d1 === d2) {
      digraphs.push(d1 + 'X');
      i++;
    } else {
      digraphs.push(d1 + d2);
      i += 2;
    }
  }
  return digraphs;
};

const findCoords = (char: string, keySquare: string[][]): { row: number; col: number } => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (keySquare[row][col] === char) {
        return { row, col };
      }
    }
  }
  return { row: -1, col: -1 }; 
};

const processDigraph = (digraph: string, keySquare: string[][], mode: 'encrypt' | 'decrypt'): string => {
  const [c1, c2] = digraph.split('');
  const pos1 = findCoords(c1, keySquare);
  const pos2 = findCoords(c2, keySquare);
  const direction = mode === 'encrypt' ? 1 : -1;

  if (pos1.row === pos2.row) {
    const newCol1 = (pos1.col + direction + 5) % 5;
    const newCol2 = (pos2.col + direction + 5) % 5;
    return keySquare[pos1.row][newCol1] + keySquare[pos2.row][newCol2];
  }
  if (pos1.col === pos2.col) {
    const newRow1 = (pos1.row + direction + 5) % 5;
    const newRow2 = (pos2.row + direction + 5) % 5;
    return keySquare[newRow1][pos1.col] + keySquare[newRow2][pos2.col];
  }
  return keySquare[pos1.row][pos2.col] + keySquare[pos2.row][pos1.col];
};

export const playfairEncrypt = (text: string, key: string): string => {
  if (!key) return '';
  const keySquare = generateKeySquare(key);
  const digraphs = prepareText(text);
  return digraphs.map(dg => processDigraph(dg, keySquare, 'encrypt')).join('');
};

export const playfairDecrypt = (text: string, key: string): string => {
  if (!key) return '';
  const keySquare = generateKeySquare(key);
  const digraphs = text.toUpperCase().replace(/[^A-Z]/g, '').match(/.{1,2}/g) || [];
  return digraphs.map(dg => processDigraph(dg, keySquare, 'decrypt')).join('');
};
