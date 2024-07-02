import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { getActivityInfo } from "./api";
import { useLoadingScreen } from "./hooks";
import {
  CompletePage,
  CustomizationPage,
  ExamTypePage,
  RouteErrorPage,
  RunPage,
  StartPage,
} from "./pages";
import { store } from "./redux";
import "./style.scss";

const queryClient = new QueryClient();

function App() {
  const [activityInfo, setActivityInfo] = useState<
    { id: string; name: string; help_hyperlink: string } | undefined
  >();
  const [activityInfoLoading, setActivityInfoLoading] = useState(true);

  const performanceUrl = `${
    import.meta.env.VITE_PERFORMANCE_URL
  }?filter-key=activity-${activityInfo?.id}-${activityInfo?.name}`;

  useEffect(() => {
    getActivityInfo()
      .then(setActivityInfo)
      .finally(() => setActivityInfoLoading(false));
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", preventContextMenu);

    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);

    function preventContextMenu(e: MouseEvent) {
      e.preventDefault();
    }
  }, []);

  useLoadingScreen(activityInfoLoading);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route
              index
              path="/"
              element={<RouteErrorPage />}
              errorElement={<RouteErrorPage />}
            />
            <Route
              path="/:examId"
              element={
                <StartPage
                  helpHyperlink={activityInfo?.help_hyperlink || ""}
                  performanceUrl={performanceUrl}
                />
              }
              errorElement={<RouteErrorPage />}
            />
            <Route
              path="/:examId/select-type"
              element={<ExamTypePage />}
              errorElement={<RouteErrorPage />}
            />
            <Route
              path="/:examId/customize"
              element={<CustomizationPage />}
              errorElement={<RouteErrorPage />}
            />
            <Route
              path="/:examId/run"
              element={
                <RunPage helpHyperlink={activityInfo?.help_hyperlink || ""} />
              }
              errorElement={<RouteErrorPage />}
            />
            <Route
              path="/:examId/complete/*"
              element={
                <CompletePage
                  performanceUrl={performanceUrl}
                  helpHyperlink={activityInfo?.help_hyperlink || ""}
                />
              }
              errorElement={<RouteErrorPage />}
            />
          </Routes>
        </HashRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
