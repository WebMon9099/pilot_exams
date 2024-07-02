import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, StartPageButton } from "../components";
import { useDispatch, useExam } from "../hooks";
import { p } from "../lib";
import { setTrainingMode } from "../redux";

const StartPage: React.FC<{
  helpHyperlink: string;
  performanceUrl: string;
}> = ({ helpHyperlink, performanceUrl }) => {
  const navigate = useNavigate();

  const { exam } = useExam();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!exam) return;

    document.title = `PAT - ${exam.name}`;
  }, [exam]);

  if (!exam) return null;
  if (exam.name === 'Custom Exam'){
    helpHyperlink = "/user-guide/theoretical-content/";
  }
  
  return (
    <main className="flex flex-1 flex-col items-center gap-[8vh] bg-[#f6f6f6] text-center text-theme-dark-gray">
      <Navbar
        className="h-14 w-full"
        minified
        hideMode
        showExitModal={() => window.close()}
        performanceUrl={performanceUrl}
        helpHyperlink={helpHyperlink}
        endButtons="exit"
      />
      <div className="flex w-full max-w-7xl flex-col gap-8 px-4 md:my-12 md:gap-0 md:px-6 lg:px-14 xl:px-16 2xl:px-24">
        <h1 className="text-small-title font-semibold text-[#474747] md:pb-[8vh] md:text-[45px]">
          {exam.name}
        </h1>
        <div className="mt-[3vh] grid w-full grid-cols-2 gap-[2vh] md:flex md:justify-between md:gap-[1vw]">
          <StartPageButton
            icon="icon_start"
            shadow
            color="blue"
            className="flex-1"
            onClick={() => {
              dispatch(setTrainingMode(false));

              navigate("select-type");
            }}
          >
            Start Exam
          </StartPageButton>
          {exam.training_mode && (
            <StartPageButton
              icon="icon_training_mode"
              shadow
              color="green"
              className="flex-1"
              onClick={() => {
                dispatch(setTrainingMode(true));

                navigate("select-type");
              }}
            >
              Training Mode
            </StartPageButton>
          )}
          <StartPageButton
            icon="icon_performance"
            className="flex-1"
            disabled={exam.name === 'Custom Exam'}
            onClick={() => {
              window.open(performanceUrl);
            }}
          >
            Performance
          </StartPageButton>
          <StartPageButton
            icon="icon_help"
            className="flex-1"
            onClick={() => window.open(helpHyperlink)}
          >
            User Guide
          </StartPageButton>
          <StartPageButton disabled icon="icon_exam_builder" className="flex-1">
            Exam Builder
          </StartPageButton>
        </div>
      </div>
      <img
        alt="logo"
        src={p("images/logo.svg")}
        className="bottom-4 mt-auto hidden w-64 md:absolute md:bottom-[1vw] md:left-[1vw] lg:block"
      />
    </main>
  );
};

export default StartPage;
