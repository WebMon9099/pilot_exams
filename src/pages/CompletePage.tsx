import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../clients";
import {
  CompleteExitModal,
  CompleteRestartModal,
  FeedbackTab,
  Navbar,
  OverviewTab,
  Tabbar,
} from "../components";
import { useDispatch, useExam, useLoadingScreen, useSelector } from "../hooks";
import { resetExam } from "../redux";
import { Result } from "../types";

const CompletePage: React.FC<{
  performanceUrl: string;
  helpHyperlink: string;
}> = ({ performanceUrl, helpHyperlink }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { exam } = useExam();
  const {
    mode,
    score: _score,
    customization,
    time,
    trainingMode,
  } = useSelector((state) => state.exam);

  const [tab, setTab] = useState<"overview" | "feedback">("overview");

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);

  const { isLoading: insertResultLoading, mutate: insertResult } =
    useMutation(_insertResult);

  const [medianScore, setMedianScore] = useState<number | undefined>(undefined);
  const [pastResults, setPastResults] = useState<Result[]>([]);
  const [usersResultsLoading, setUsersResultsLoading] = useState(true);

  const questionQuantity = exam
    ? mode === "customization" && customization
      ? customization.question_quantity
      : exam.question_quantity
    : 0;

  const score = Math.round((_score / questionQuantity) * 100);

  useEffect(() => {
    if (!exam) return;

    if (mode !== "customization" && exam.id !== "custom") {
      insertResult({
        score,
        duration: time,
        mode: trainingMode ? "training" : "normal",
      });

      getUsersResults()
        .then((res) => {
          setMedianScore(res.median_score);
          setPastResults(res.past_results);
        })
        .finally(() => setUsersResultsLoading(false));
    }
  }, [insertResult, exam, score, time, mode, trainingMode]);

  useLoadingScreen(insertResultLoading || usersResultsLoading);

  if (!exam) return null;

  return (
    <>
      <main className="flex flex-1 flex-col">
        <Navbar
          className="h-14"
          minified
          endButtons
          helpHyperlink={helpHyperlink}
          performanceUrl={performanceUrl}
          showExitModal={() => setExitModalOpen(true)}
          showRestartModal={() => setRestartModalOpen(true)}
        />

        {/* NOTE: Desktop */}
        <Tabbar
          tab={tab}
          setTab={setTab}
          className="hidden h-12 md:flex"
          style={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px -4px 10px 0px" }}
        />
        <div className="hidden flex-1 flex-col items-center md:flex">
          {tab === "overview" ? (
            <OverviewTab
              score={score}
              median_score={medianScore}
              past_results={pastResults}
              showRestartModal={() => setRestartModalOpen(true)}
              helpHyperlink={helpHyperlink}
              performanceUrl={performanceUrl}
            />
          ) : (
            <FeedbackTab />
          )}
        </div>

        {/* NOTE: Mobile */}
        <div className="relative flex-1 bg-[#f7f7f7] md:hidden">
          <OverviewTab
            className="relative border-b border-[#e0e0e0]"
            score={score}
            median_score={medianScore}
            past_results={pastResults}
            showRestartModal={() => setRestartModalOpen(true)}
            style={{ boxShadow: "rgba(0,0,0,0.02) 0px -4px 10px 0px" }}
            helpHyperlink={helpHyperlink}
            performanceUrl={performanceUrl}
          />
          <FeedbackTab />
        </div>
      </main>
      <CompleteExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate(`/${exam.id}`)}
      />
      <CompleteRestartModal
        visible={restartModalOpen}
        hideModal={() => setRestartModalOpen(false)}
        restart={restartTest}
      />
    </>
  );

  async function getUsersResults() {
    try {
      const { data } = await api.get<{
        median_score: number;
        past_results: Result[];
      }>("../get-users-results.php");

      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async function _insertResult(data: {
    score: number;
    duration: number;
    mode: string;
  }) {
    try {
      return await api.post("../insert-result.php", data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function restartTest() {
    if (!exam) return;

    dispatch(resetExam());

    navigate(`/${exam.id}/run`, { replace: true });
  }
};

export default CompletePage;
