import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      data-layout-style="default"
      data-theme-colors="default"
      data-bs-theme="light"
      data-sidebar-size="sm"
      data-sidebar="dark"
      data-theme="default"
      data-layout-width="fluid"
      data-layout-position="fixed"
      data-topbar="light"
      data-layout="vertical"
      data-sidebar-image="none"
      data-sidebar-visibility="show"
    >
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
