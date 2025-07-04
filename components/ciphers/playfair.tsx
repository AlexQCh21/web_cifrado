"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { playfairEncrypt, playfairDecrypt } from "@/lib/ciphers/playfair";

export default function PlayfairCipher() {
  const [encryptText, setEncryptText] = useState("");
  const [encryptKey, setEncryptKey] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");

  const [decryptText, setDecryptText] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");

  const handleEncrypt = () => {
    setEncryptedResult(playfairEncrypt(encryptText, encryptKey));
  };

  const handleDecrypt = () => {
    setDecryptedResult(playfairDecrypt(decryptText, decryptKey));
  };

  const transferToDecrypt = () => {
    setDecryptText(encryptedResult);
    setDecryptKey(encryptKey);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Cifrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="encrypt-text-playfair">Texto a cifrar</Label>
            <Textarea
              id="encrypt-text-playfair"
              value={encryptText}
              onChange={(e) => setEncryptText(e.target.value)}
              placeholder="Ingrese su texto aquí..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="encrypt-key-playfair">Clave</Label>
            <Input
              id="encrypt-key-playfair"
              type="text"
              value={encryptKey}
              onChange={(e) => setEncryptKey(e.target.value)}
              placeholder="Ingrese la clave..."
            />
          </div>
          <Button onClick={handleEncrypt} disabled={!encryptKey}>Cifrar Texto</Button>
          <div className="space-y-2">
            <Label htmlFor="encrypted-result-playfair">Resultado</Label>
            <div className="relative">
              <Textarea
                id="encrypted-result-playfair"
                readOnly
                value={encryptedResult}
                placeholder="El texto cifrado aparecerá aquí..."
                className="pr-12"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={transferToDecrypt}
                title="Transferir a descifrado"
                disabled={!encryptedResult}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descifrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decrypt-text-playfair">Texto a descifrar</Label>
            <Textarea
              id="decrypt-text-playfair"
              value={decryptText}
              onChange={(e) => setDecryptText(e.target.value)}
              placeholder="Ingrese su texto cifrado aquí..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decrypt-key-playfair">Clave</Label>
            <Input
              id="decrypt-key-playfair"
              type="text"
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
              placeholder="Ingrese la clave..."
            />
          </div>
          <Button onClick={handleDecrypt} disabled={!decryptKey}>Descifrar Texto</Button>
          <div className="space-y-2">
            <Label htmlFor="decrypted-result-playfair">Resultado</Label>
            <Textarea
              id="decrypted-result-playfair"
              readOnly
              value={decryptedResult}
              placeholder="El texto descifrado aparecerá aquí..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
