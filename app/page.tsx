'use client';

import {  useState } from "react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";

import {  LogIn, UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./components/ui/Logo";



export default function Auth() {

  const router = useRouter(); // <- hook de navegação
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fake submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // Simula um delay de request
    setTimeout(() => {
      setLoading(false);
       router.push("/home");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-gradient border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center">
          <Logo/>
          </div>
          <div>
            <CardTitle>
              <span className="font-display text-2xl font-bold">FlashCard</span>

            </CardTitle>
            <CardDescription >
              <span className="text-xs text-muted-foreground">
                Aprenda todos os dias.</span><span className="text-green-400 font-bold"> Evolua sempre.</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-600 rounded-2xl">
              <TabsTrigger className="rounded-2xl" value="login">Entrar</TabsTrigger>
              <TabsTrigger  className="rounded-2xl" value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className=" space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    className="bg-gray-600 rounded-2xl"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    className="bg-gray-600 rounded-2xl"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-green-300 rounded-2xl "
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black " />
                  ) : (
                    <LogIn className="w-4 h-4  text-black "/>
                  )}
                  <span className=" text-black ">Entrar</span>

                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    className="bg-gray-600 rounded-2xl"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    className="bg-gray-600 rounded-2xl"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-green-300 rounded-2xl "
                  size="lg"
                  disabled={loading}

                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black  "/>
                  ) : (
                    <UserPlus className="w-4 h-4 text-black" />
                  )}
                  <span className=" text-black ">Criar Conta</span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
