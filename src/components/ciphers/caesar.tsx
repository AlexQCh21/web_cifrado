"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { caesarEncrypt, caesarDecrypt } from "@/lib/ciphers/caesar";

export default function CaesarCipher() {
  const [encryptText, setEncryptText] = useState("");
  const [encryptShift, setEncryptShift] = useState(3);
  const [encryptedResult, setEncryptedResult] = useState("");

  const [decryptText, setDecryptText] = useState("");
  const [decryptShift, setDecryptShift] = useState(3);
  const [decryptedResult, setDecryptedResult] = useState("");

  const handleEncrypt = () => {
    setEncryptedResult(caesarEncrypt(encryptText, encryptShift));
  };

  const handleDecrypt = () => {
    setDecryptedResult(caesarDecrypt(decryptText, decryptShift));
  };

  const transferToDecrypt = () => {
    setDecryptText(encryptedResult);
    setDecryptShift(encryptShift);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Cifrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="encrypt-text">Texto a cifrar</Label>
            <Textarea
              id="encrypt-text"
              value={encryptText}
              onChange={(e) => setEncryptText(e.target.value)}
              placeholder="Ingrese su texto aquí..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="encrypt-shift">Desplazamiento</Label>
            <Input
              id="encrypt-shift"
              type="number"
              value={encryptShift}
              onChange={(e) =>
                setEncryptShift(parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
          <Button onClick={handleEncrypt}>Cifrar Texto</Button>
          <div className="space-y-2">
            <Label htmlFor="encrypted-result">Resultado</Label>
            <div className="relative">
              <Textarea
                id="encrypted-result"
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
            <Label htmlFor="decrypt-text">Texto a descifrar</Label>
            <Textarea
              id="decrypt-text"
              value={decryptText}
              onChange={(e) => setDecryptText(e.target.value)}
              placeholder="Ingrese su texto cifrado aquí..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decrypt-shift">Desplazamiento</Label>
            <Input
              id="decrypt-shift"
              type="number"
              value={decryptShift}
              onChange={(e) =>
                setDecryptShift(parseInt(e.target.value, 10) || 0)
              }
            />
          </div>
          <Button onClick={handleDecrypt}>Descifrar Texto</Button>
          <div className="space-y-2">
            <Label htmlFor="decrypted-result">Resultado</Label>
            <Textarea
              id="decrypted-result"
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
