class HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string | null, freq: number, left: HuffmanNode | null = null, right: HuffmanNode | null = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

const buildFrequencyMap = (text: string): Map<string, number> => {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  return freqMap;
};

const buildHuffmanTree = (freqMap: Map<string, number>): HuffmanNode | null => {
  if (freqMap.size === 0) return null;
  
  const priorityQueue: HuffmanNode[] = [];
  for (const [char, freq] of freqMap.entries()) {
    priorityQueue.push(new HuffmanNode(char, freq));
  }

  const sortQueue = () => priorityQueue.sort((a, b) => a.freq - b.freq);

  while (priorityQueue.length > 1) {
    sortQueue();
    const left = priorityQueue.shift()!;
    const right = priorityQueue.shift()!;
    const newNode = new HuffmanNode(null, left.freq + right.freq, left, right);
    priorityQueue.push(newNode);
  }

  return priorityQueue[0];
};

const buildCodesMap = (tree: HuffmanNode | null, currentCode: string, codesMap: Map<string, string>) => {
  if (!tree) return;
  if (tree.char !== null) {
    codesMap.set(tree.char, currentCode || '0');
    return;
  }
  buildCodesMap(tree.left, currentCode + '0', codesMap);
  buildCodesMap(tree.right, currentCode + '1', codesMap);
};

export const huffmanCompress = (text: string): { compressed: string; codes: Map<string, string> } => {
  if (!text) return { compressed: '', codes: new Map() };
  
  const freqMap = buildFrequencyMap(text);
  const tree = buildHuffmanTree(freqMap);
  const codesMap = new Map<string, string>();
  buildCodesMap(tree, '', codesMap);

  let compressed = '';
  for (const char of text) {
    compressed += codesMap.get(char);
  }

  return { compressed, codes: codesMap };
};

export const huffmanDecompress = (compressed: string, codes: Map<string, string>): string => {
  if (!compressed || codes.size === 0) return '';
  
  const reversedCodes = new Map<string, string>();
  for (const [char, code] of codes.entries()) {
    reversedCodes.set(code, char);
  }
  
  let decompressed = '';
  let currentCode = '';
  for (const bit of compressed) {
    currentCode += bit;
    if (reversedCodes.has(currentCode)) {
      decompressed += reversedCodes.get(currentCode);
      currentCode = '';
    }
  }

  return decompressed;
};
