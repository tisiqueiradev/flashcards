import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

useEffect(() => {
  // Postpone the state updates to the next tick
  const timer = setTimeout(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, 0);

  return () => clearTimeout(timer);
}, []);


  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallBanner(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
  };

  if (isInstalled || !showInstallBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-linear-to-t from-background via-background to-transparent pb-safe">
      <div className="mx-auto max-w-md bg-card border border-border rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-primary-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">Instalar FlashMaster</h3>
            {isIOS ? (
              <p className="text-sm text-muted-foreground mt-1">
                Toque em <span className="inline-flex items-center px-1 bg-muted rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3 3h-2v8h-2V5H9l3-3zm-6 9v10h12V11h-2v8H8v-8H6z"/>
                  </svg>
                </span> <span>e depois Adicionar à Tela Inicial</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Instale para usar offline e ter acesso rápido
              </p>
            )}
          </div>

          <button
            onClick={dismissBanner}
            className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isIOS && (
          <Button
            onClick={handleInstall}
            className="w-full mt-4 gap-2"
            size="lg"
          >
            <Download className="w-4 h-4" />
            Instalar App
          </Button>
        )}
      </div>
    </div>
  );
};
