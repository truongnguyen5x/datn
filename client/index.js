import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { IntlProviderWrapper } from "./utility/context/Internationalization"
import { Layout } from "./utility/context/Layout"
import { store } from "./redux/storeConfig/store"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import "./index.scss"
import "./@fake-db"

const LazyApp = lazy(() => import("./App"))


ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
          <IntlProviderWrapper>
            <LazyApp />
          </IntlProviderWrapper>
        </Layout>
      </Suspense>
    </Provider>,
  document.getElementById("root")
)