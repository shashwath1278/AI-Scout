import { ToolsProvider } from '@/components/client/ToolsContext';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToolsProvider>
      <Component {...pageProps} />
    </ToolsProvider>
  );
}
