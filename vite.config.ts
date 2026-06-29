import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages (project site) では https://<user>.github.io/slides/ で公開されるため
// base をリポジトリ名に合わせる。
export default defineConfig({
  base: '/slides/',
  plugins: [react()],
});
