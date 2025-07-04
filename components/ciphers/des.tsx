"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";
import { desEncrypt, desDecrypt } from "@/lib/ciphers/des";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DesCipher() {
  const [encryptText, setEncryptText] = useState("");
  const [encryptKey, setEncryptKey] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");

  const [decryptText, setDecryptText] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  
  const [log, setLog] = useState<string[]>([]);
  
  const addToLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleEncrypt = () => {
    if (encryptKey.length !== 8) {
      addToLog("Error de cifrado: La clave DES debe tener exactamente 8 caracteres.");
      return;
    }
    addToLog(`Cifrando con clave "${encryptKey}"...`);
    const result = desEncrypt(encryptText, encryptKey);
    setEncryptedResult(result);
    addToLog(`Cifrado completado.`);
  };

  const handleDecrypt = () => {
     if (decryptKey.length !== 8) {
      addToLog("Error de descifrado: La clave DES debe tener exactamente 8 caracteres.");
      return;
    }
    addToLog(`Descifrando con clave "${decryptKey}"...`);
    const result = desDecrypt(decryptText, decryptKey);
    setDecryptedResult(result);
    if(result.startsWith("Error")) {
       addToLog(result);
    } else {
       addToLog("Descifrado completado.");
    }
  };

  const transferToDecrypt = () => {
    setDecryptText(encryptedResult);
    setDecryptKey(encryptKey);
    addToLog("Texto cifrado y clave transferidos para descifrar.");
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cifrar</CardTitle>
            <CardDescription>Cifre su mensaje usando una clave de 8 caracteres.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="encrypt-text-des">Texto a cifrar</Label>
              <Textarea
                id="encrypt-text-des"
                value={encryptText}
                onChange={(e) => setEncryptText(e.target.value)}
                placeholder="Ingrese su texto aquí..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="encrypt-key-des">Clave (8 caracteres)</Label>
              <Input
                id="encrypt-key-des"
                type="text"
                value={encryptKey}
                onChange={(e) => setEncryptKey(e.target.value)}
                maxLength={8}
                placeholder="Clave de 8 caracteres"
              />
            </div>
            <Button onClick={handleEncrypt} disabled={!encryptKey || encryptKey.length !== 8}>Cifrar Texto</Button>
            <div className="space-y-2">
              <Label htmlFor="encrypted-result-des">Resultado Cifrado</Label>
              <div className="relative">
                <Textarea
                  id="encrypted-result-des"
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
            <CardDescription>Descifre el mensaje con la misma clave de 8 caracteres.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decrypt-text-des">Texto a descifrar</Label>
              <Textarea
                id="decrypt-text-des"
                value={decryptText}
                onChange={(e) => setDecryptText(e.target.value)}
                placeholder="Ingrese su texto cifrado aquí..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decrypt-key-des">Clave (8 caracteres)</Label>
              <Input
                id="decrypt-key-des"
                type="text"
                value={decryptKey}
                onChange={(e) => setDecryptKey(e.target.value)}
                 maxLength={8}
                placeholder="Clave de 8 caracteres"
              />
            </div>
            <Button onClick={handleDecrypt} disabled={!decryptKey || decryptKey.length !== 8}>Descifrar Texto</Button>
            <div className="space-y-2">
              <Label htmlFor="decrypted-result-des">Resultado Descifrado</Label>
              <Textarea
                id="decrypted-result-des"
                readOnly
                value={decryptedResult}
                placeholder="El texto descifrado aparecerá aquí..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot/> Registro de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-40 w-full rounded-md border p-4">
                <div className="flex flex-col gap-2 text-sm font-mono">
                    {log.map((entry, i) => <p key={i}>{entry}</p>)}
                </div>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
