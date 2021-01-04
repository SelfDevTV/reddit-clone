import "../styles/index.css";
import { Provider } from "next-auth/client";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Binding events
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
