"use client";

import { type PropsWithChildren, useEffect, useMemo } from "react";
import {
  SDKProvider,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
} from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorBoundary } from "../ErrorBoundary";
import { ErrorPage } from "../ErrorPage";
import { useTelegramMock } from "../../hooks/useTelegramMock";
import { useDidMount } from "../../hooks/useDidMount";

import "./styles.css";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { AuthBoundary } from "../AuthBoundary";
import { ThemeProvider } from "@gravity-ui/uikit";

function App(props: PropsWithChildren<{}>) {
  let lp, miniApp, themeParams, viewport;
  try {
    lp = useLaunchParams();
    miniApp = useMiniApp();
    themeParams = useThemeParams();
    viewport = useViewport();
  } catch (error) {
    console.error(
      "Failed to fetch launch parameters, mini app, theme parameters, or viewport due to user not being logged in via Telegram:",
      error
    );
    //throw error; // Rethrow the error to handle it globally
    return <>Please login via Telegram!</>;
  }

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <AppRoot
      className='mx-auto'
      appearance={miniApp.isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
    >
      <ThemeProvider theme={"dark"}>{props.children}</ThemeProvider>
    </AppRoot>
  );
}

function RootInner({ children }: PropsWithChildren<{}>) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === "debug";
  const manifestUrl = useMemo(() => {
    return new URL("tonconnect-manifest.json", window.location.href).toString();
  }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/vself_bot/app",
      }}
    >
      <SDKProvider acceptCustomStyles debug={debug}>
        <App>
          <AuthBoundary>{children}</AuthBoundary>
        </App>
      </SDKProvider>
    </TonConnectUIProvider>
  );
}

export default function Root(props: PropsWithChildren<{}>) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className='root__loading'>Loading</div>
  );
}
