import React, { lazy, Suspense } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import "./@fake-db"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import Loading from "./components/@vuexy/spinner/Loading"
import "./index.scss"
import { store } from "./redux/storeConfig/store"
import { IntlProviderWrapper } from "./utility/context/Internationalization"
import { Layout } from "./utility/context/Layout"

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
      <Loading/>
    </Provider>,
  document.getElementById("root")
)