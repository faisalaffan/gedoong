import { ref, onMounted, onUnmounted } from "vue";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileRenderOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  action?: string;
}

let scriptLoaded = false;
let scriptLoading: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise<void>((resolve) => {
    if (document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`)) {
      scriptLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });
  return scriptLoading;
}

export function useTurnstile() {
  const token = ref("");
  const widgetId = ref("");
  const isVerified = ref(false);
  const isError = ref(false);

  async function renderTurnstile(
    containerId: string,
    sitekey: string,
    theme: "light" | "dark" | "auto" = "light",
  ) {
    await loadTurnstileScript();

    if (window.turnstile) {
      window.turnstile.render(`#${containerId}`, {
        sitekey,
        theme,
        callback: (t: string) => {
          token.value = t;
          isVerified.value = true;
          isError.value = false;
        },
        "error-callback": () => {
          token.value = "";
          isVerified.value = false;
          isError.value = true;
        },
        "expired-callback": () => {
          token.value = "";
          isVerified.value = false;
        },
        "timeout-callback": () => {
          token.value = "";
          isVerified.value = false;
          isError.value = true;
        },
      });
    }
  }

  function resetTurnstile() {
    token.value = "";
    isVerified.value = false;
    isError.value = false;
    if (widgetId.value && window.turnstile) {
      window.turnstile.reset(widgetId.value);
    }
  }

  return {
    token,
    isVerified,
    isError,
    renderTurnstile,
    resetTurnstile,
  };
}
