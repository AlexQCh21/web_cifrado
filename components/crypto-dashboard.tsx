"use client";

import React, { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { KeyRound, TextCursorInput, Binary, Grid, Lock, Shield } from "lucide-react";
import CaesarCipher from "@/components/ciphers/caesar";
import HuffmanCipher from "@/components/ciphers/huffman";
import PlayfairCipher from "@/components/ciphers/playfair";
import RsaCipher from "@/components/ciphers/rsa";
import DesCipher from "@/components/ciphers/des";

type Method = "rsa" | "caesar" | "huffman" | "playfair" | "des";

const componentMap: Record<Method, React.ComponentType> = {
  rsa: RsaCipher,
  caesar: CaesarCipher,
  huffman: HuffmanCipher,
  playfair: PlayfairCipher,
  des: DesCipher,
};

const methodDetails: Record<
  Method,
  { title: string; icon: React.ReactNode; description: string }
> = {
  rsa: {
    title: "RSA",
    icon: <KeyRound />,
    description: "Cifrado asimétrico de clave pública.",
  },
  caesar: {
    title: "César",
    icon: <TextCursorInput />,
    description: "Cifrado simple por desplazamiento.",
  },
  huffman: {
    title: "Huffman",
    icon: <Binary />,
    description: "Compresión de datos sin pérdida.",
  },
  playfair: {
    title: "Playfair",
    icon: <Grid />,
    description: "Cifrado por sustitución de digramas.",
  },
  des: {
    title: "DES",
    icon: <Lock />,
    description: "Estándar de cifrado de datos simétrico.",
  },
};

export default function CryptoDashboard() {
  const [selectedMethod, setSelectedMethod] = useState<Method>("caesar");

  const ActiveComponent = componentMap[selectedMethod];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">
                CryptoSuite Lite
              </h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {(Object.keys(methodDetails) as Method[]).map((method) => (
              <SidebarMenuItem key={method}>
                <SidebarMenuButton
                  onClick={() => setSelectedMethod(method)}
                  isActive={selectedMethod === method}
                >
                  {methodDetails[method].icon}
                  <span>{methodDetails[method].title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </Sidebar>
        <SidebarInset className="p-4 md:p-8 flex-1">
          <main className="w-full">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="md:hidden mr-4" />
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {methodDetails[selectedMethod].title}
                </h2>
                <p className="text-muted-foreground">
                  {methodDetails[selectedMethod].description}
                </p>
              </div>
            </div>
            <ActiveComponent />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
