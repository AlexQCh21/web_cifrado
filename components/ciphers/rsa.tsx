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
import { ArrowRight, KeyRound, Bot, User, Copy } from "lucide-react";
import {
  generateRsaKeyPair,
  exportPublicKey,
  exportPrivateKey,
  rsaEncrypt,
  rsaDecrypt,
} from "@/lib/ciphers/rsa";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RsaCipher() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const [encryptText, setEncryptText] = useState("");
  const [encryptKey, setEncryptKey] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");

  const [decryptText, setDecryptText] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const addToLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const handleCopyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    addToLog(`Copiada ${name} al portapapeles.`);
  };

  const handleGenerateKeys = async () => {
    addToLog("Iniciando generación de par de claves RSA-2048...");
    setIsGenerating(true);
    try {
      const keyPair = await generateRsaKeyPair();
      const pubKey = await exportPublicKey(keyPair.publicKey);
      const privKey = await exportPrivateKey(keyPair.privateKey);
      setPublicKey(pubKey);
      setPrivateKey(privKey);
      addToLog("Par de claves generado exitosamente.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addToLog(`Error al generar claves: ${errorMessage}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleEncrypt = async () => {
    if (!encryptText || !encryptKey) {
      addToLog("Error: Se necesita el texto y la clave pública para cifrar.");
      return;
    }
    addToLog(`Cifrando mensaje con la clave pública proporcionada...`);
    setIsEncrypting(true);
    try {
      const ciphertext = await rsaEncrypt(encryptKey, encryptText);
      setEncryptedResult(ciphertext);
      addToLog("Mensaje cifrado exitosamente.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Clave pública inválida o error en el proceso.";
      addToLog(`Error de cifrado: ${errorMessage}`);
      setEncryptedResult("");
    } finally {
        setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptText || !decryptKey) {
        addToLog("Error: Se necesita el texto cifrado y la clave privada para descifrar.");
        return;
    }
    addToLog("Descifrando mensaje con la clave privada personal...");
    setIsDecrypting(true);
    try {
        const plaintext = await rsaDecrypt(decryptKey, decryptText);
        setDecryptedResult(plaintext);
        addToLog("Mensaje descifrado exitosamente.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Clave privada inválida o texto cifrado corrupto.";
        addToLog(`Error de descifrado: ${errorMessage}`);
        setDecryptedResult("");
    } finally {
        setIsDecrypting(false);
    }
  };
  
  const transferPublicKey = () => {
    setEncryptKey(publicKey);
    addToLog("Clave pública transferida al panel de cifrado.");
  };

  const transferCiphertext = () => {
    setDecryptText(encryptedResult);
    setDecryptKey(privateKey);
    addToLog("Texto cifrado y clave privada transferidos al panel de descifrado.");
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Generación de Claves (Alice)</CardTitle>
            <CardDescription>
              Genere su par de claves pública y privada. La pública se comparte, la privada se mantiene en secreto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGenerateKeys} disabled={isGenerating}>{isGenerating ? "Generando..." : "Generar mis Claves"}</Button>
             <div className="space-y-2">
                <Label htmlFor="public-key">Clave Pública</Label>
                 <div className="relative">
                    <Textarea id="public-key" readOnly value={publicKey} rows={4} className="pr-10" />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleCopyToClipboard(publicKey, 'clave pública')} disabled={!publicKey}><Copy className="h-4 w-4" /></Button>
                 </div>
                 {publicKey && <Button size="sm" variant="outline" onClick={transferPublicKey}>Usar para cifrar <ArrowRight className="ml-2 h-4 w-4"/></Button>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="private-key">Clave Privada</Label>
                 <div className="relative">
                    <Textarea id="private-key" readOnly value={privateKey} rows={4} className="pr-10"/>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleCopyToClipboard(privateKey, 'clave privada')} disabled={!privateKey}><Copy className="h-4 w-4" /></Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot/> Registro de Actividad</CardTitle>
                <CardDescription>Pasos del proceso criptográfico.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ScrollArea className="h-64 w-full rounded-md border p-4">
                    <div className="flex flex-col gap-2 text-sm font-mono">
                        {log.map((entry, i) => <p key={i}>{entry}</p>)}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Cifrado (Bob)</CardTitle>
              <CardDescription>Cifre un mensaje usando la clave pública de Alice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="encrypt-text">Texto a cifrar</Label>
                  <Textarea id="encrypt-text" value={encryptText} onChange={(e) => setEncryptText(e.target.value)} placeholder="Su mensaje secreto..."/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="encrypt-key">Clave Pública del Destinatario (Alice)</Label>
                  <Textarea id="encrypt-key" value={encryptKey} onChange={(e) => setEncryptKey(e.target.value)} placeholder="Pegue la clave pública aquí..." rows={4}/>
              </div>
              <Button onClick={handleEncrypt} disabled={isEncrypting || !encryptKey}>{isEncrypting ? "Cifrando..." : "Cifrar y Enviar"}</Button>
               <div className="space-y-2">
                <Label htmlFor="encrypted-result">Mensaje Cifrado</Label>
                 <div className="relative">
                    <Textarea id="encrypted-result" readOnly value={encryptedResult} rows={4} className="pr-10"/>
                     {encryptedResult && <Button size="sm" variant="outline" onClick={transferCiphertext} className="absolute top-2 right-2">Descifrar <ArrowRight className="ml-2 h-4 w-4"/></Button>}
                </div>
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Descifrado (Alice)</CardTitle>
              <CardDescription>Descifre el mensaje de Bob con su clave privada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="decrypt-text">Mensaje Cifrado</Label>
                  <Textarea id="decrypt-text" value={decryptText} onChange={(e) => setDecryptText(e.target.value)} placeholder="Pegue el texto cifrado aquí..." rows={4}/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="decrypt-key">Su Clave Privada</Label>
                  <Textarea id="decrypt-key" value={decryptKey} onChange={(e) => setDecryptKey(e.target.value)} placeholder="Su clave privada se llenará automáticamente..." rows={4}/>
              </div>
              <Button onClick={handleDecrypt} disabled={isDecrypting || !decryptKey}>{isDecrypting ? "Descifrando..." : "Descifrar Mensaje"}</Button>
              <div className="space-y-2">
                <Label htmlFor="decrypted-result">Mensaje Original</Label>
                <Textarea id="decrypted-result" readOnly value={decryptedResult} placeholder="El mensaje descifrado aparecerá aquí."/>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
