import '../styles/globals.scss'
import React from "react";
import App, { AppProps, AppContext } from "next/app";
import { storeWrapper } from "../redux/store";

interface MyAppProps extends AppProps {}

class MyApp extends App<MyAppProps> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
        <Component {...pageProps} />   
    );
  }
}

export default storeWrapper.withRedux(MyApp);
