import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import vinext from 'vinext';
import { defineConfig } from 'vite';

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

export default defineConfig({
  server: isCodexSeatbeltSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  plugins: [tailwindcss(), vinext(), nitro()],
});
