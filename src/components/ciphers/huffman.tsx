"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { huffmanCompress, huffmanDecompress } from "@/lib/ciphers/huffman";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HuffmanCipher() {
  const [compressText, setCompressText] = useState("");
  const [compressionResult, setCompressionResult] = useState<{
    compressed: string;
    codes: Map<string, string>;
  } | null>(null);

  const [decompressText, setDecompressText] = useState("");
  const [decompressCodes, setDecompressCodes] = useState("");
  const [decompressedResult, setDecompressedResult] = useState("");

  const handleCompress = () => {
    const result = huffmanCompress(compressText);
    setCompressionResult(result);
  };

  const handleDecompress = () => {
    try {
      const codesMap = new Map<string, string>(JSON.parse(decompressCodes));
      const result = huffmanDecompress(decompressText, codesMap);
      setDecompressedResult(result);
    } catch (e) {
      setDecompressedResult(
        "Error: Formato de códigos inválido. Debe ser un array de arrays JSON, ej: [['a','01'],['b','11']]"
      );
    }
  };

  const transferToDecompress = () => {
    if (compressionResult) {
      setDecompressText(compressionResult.compressed);
      setDecompressCodes(
        JSON.stringify(Array.from(compressionResult.codes.entries()))
      );
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Comprimir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="compress-text">Texto a comprimir</Label>
            <Textarea
              id="compress-text"
              value={compressText}
              onChange={(e) => setCompressText(e.target.value)}
              placeholder="Ingrese su texto aquí..."
              rows={5}
            />
          </div>
          <Button onClick={handleCompress}>Comprimir Texto</Button>
          {compressionResult && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compressed-result">
                  Resultado comprimido (binario)
                </Label>
                <div className="relative">
                  <Textarea
                    id="compressed-result"
                    readOnly
                    value={compressionResult.compressed}
                    placeholder="El texto comprimido aparecerá aquí..."
                    rows={5}
                    className="font-mono pr-12"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                    onClick={transferToDecompress}
                    title="Transferir a descompresión"
                    disabled={!compressionResult.compressed}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tabla de Códigos de Huffman</Label>
                <Card className="max-h-60 overflow-y-auto">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Carácter</TableHead>
                          <TableHead>Código</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from(compressionResult.codes.entries()).map(
                          ([char, code]) => (
                            <TableRow key={char}>
                              <TableCell className="font-mono">
                                {char === " " ? "' '" : char}
                              </TableCell>
                              <TableCell className="font-mono">{code}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descomprimir</CardTitle>
          <CardDescription>
            Requiere el texto comprimido y la tabla de códigos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decompress-text">Texto comprimido (binario)</Label>
            <Textarea
              id="decompress-text"
              value={decompressText}
              onChange={(e) => setDecompressText(e.target.value)}
              placeholder="Ingrese el texto binario comprimido..."
              rows={5}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decompress-codes">Tabla de códigos (JSON)</Label>
            <Textarea
              id="decompress-codes"
              value={decompressCodes}
              onChange={(e) => setDecompressCodes(e.target.value)}
              placeholder='Ej: [["a","01"],["b","11"]]'
              rows={5}
              className="font-mono"
            />
          </div>
          <Button onClick={handleDecompress}>Descomprimir Texto</Button>
          <div className="space-y-2">
            <Label htmlFor="decompressed-result">Resultado</Label>
            <Textarea
              id="decompressed-result"
              readOnly
              value={decompressedResult}
              placeholder="El texto descomprimido aparecerá aquí..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
