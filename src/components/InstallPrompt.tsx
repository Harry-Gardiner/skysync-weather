import { X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export default function InstallPrompt() {
  const { canInstall, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!canInstall || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
            <Download size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">Install SkySync</h3>
            <p className="text-sm text-white/90 mb-4">
              Get quick access and work offline. Install our app on your device.
            </p>
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors w-full md:w-auto"
            >
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
