import "@/assets/scss/themes.scss";

// import "tailwindcss";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/utils/queryClient";
import { Provider } from "react-redux";
import rootReducer from "@/slices";
import { configureStore } from "@reduxjs/toolkit";

export default function App({ Component, pageProps }: AppProps) {
  const store = configureStore({ reducer: rootReducer, devTools: true });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}
