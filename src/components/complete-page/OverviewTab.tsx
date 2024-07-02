import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useExam } from "../../hooks";
import { c, getDatePreview, p } from "../../lib";
import getTime from "../../lib/utils/getTime";
import type { Median, Result } from "../../types";
import { Slide, Slideshow } from "../core";
import ScorePie from "../core/ScorePie";
import BreakdownContainer from "./BreakdownContainer";
import ScorePieContainer from "./ScorePieContainer";

interface OverviewTabProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  median_score?: number;
  past_results: Result[];
  performanceUrl: string;
  helpHyperlink: string;
  showRestartModal: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  score,
  past_results,
  performanceUrl,
  helpHyperlink,
  showRestartModal,
  ...rest
}) => {
  const { exam } = useExam();

  if (!exam) return null;

  return (
    <>
      {/* NOTE: Desktop: */}
      <div
        {...rest}
        className={c("hidden w-full md:block md:px-8", rest.className)}
      >
        <p className="my-[6vh] text-center font-inter text-[27px] font-semibold text-[#cecece]">
          You have completed <span className="text-[#474747]">{exam.name}</span>
        </p>
        <div className="mx-auto mb-[6vh] flex max-h-[442px] w-full max-w-6xl">
          <div className="flex flex-1 flex-col border-r border-[#d8d8d8] lg:flex-[2_1_0%]">
            <p className="rounded-tl-[3px] border-b border-l border-t border-[#dddddd] bg-white px-6 py-4 text-lg font-semibold text-[#555555]">
              Your Score
            </p>
            <div className="flex flex-1 items-center justify-between rounded-bl-[3px] border-b border-l border-[#dddddd] bg-white">
              <ScorePieContainer
                className="flex-1 py-10 lg:px-12"
                score={score}
              />
              <BreakdownContainer
                className="hidden h-full flex-1 border-l border-[#dddddd] lg:flex lg:w-48 xl:w-64"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.05) 5px 0px 7px 0px inset",
                }}
              />
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <p className="rounded-tr-[3px] border-b border-r border-t border-[#dddddd] bg-white px-6 py-4 text-lg font-semibold text-[#9b9b9b]">
              Last 5 Attempts
            </p>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto border-r border-[#dddddd] bg-[#f6f6f6] px-4 py-2 scrollbar-thin scrollbar-thumb-[#e0e0e0] scrollbar-thumb-rounded-full">
              {past_results.map((result) => (
                <ResultCard
                  result={result}
                  weak_pass={exam.weak_pass}
                  strong_pass={exam.strong_pass}
                  key={result.id}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 rounded-br-[3px] border-b border-r border-t border-[#dddddd] bg-[#eaeaea] px-6 py-2 text-[13px] font-semibold text-[#99999d]">
              <img
                className="h-4 w-4"
                src={p("images/performance_grey.svg")}
                alt="performance"
              />
              <p className="whitespace-nowrap">
                Go to <i>Performance</i> to see additional data
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-[10vh] flex w-3/4 max-w-2xl justify-between gap-6">
          <button
            className="flex flex-1 justify-center rounded-[5px] border border-[#34424c] bg-[#34424c] py-3 shadow-[0_1px_2px_#eaeaea] transition hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
            onClick={showRestartModal}
          >
            <img
              alt="restart"
              className="h-10 w-10"
              src={p("images/icon_restart.svg")}
            />
          </button>
          <button
            className="flex flex-1 justify-center rounded-[5px] border border-theme-border bg-white py-3 shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
            onClick={() => window.open(helpHyperlink)}
          >
            <img
              alt="help"
              className="h-10 w-10"
              src={p("images/icon_help.svg")}
            />
          </button>
          <button
            className="flex flex-1 justify-center rounded-[5px] border border-theme-border bg-white py-3 shadow-[0_1px_2px_#eaeaea] transition hover:border-[#00acdd] hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95"
            onClick={() => window.open(performanceUrl)}
          >
            <img
              alt="performance"
              className="h-10 w-10"
              src={p("images/performance_light_grey.svg")}
            />
          </button>
        </div>
      </div>

      {/* NOTE: Mobile: */}
      <div {...rest} className={c("h-[412px] md:hidden", rest.className)}>
        <Slideshow frameDots className="z-0 h-full w-full">
          <Slide className="flex h-[412px] flex-col items-center justify-center bg-white pb-16">
            <p className="my-[2vh] font-semibold text-[#bcbcbc]">You scored:</p>
            <ScorePieContainer score={score} />
          </Slide>
          <Slide className="flex h-[412px] min-h-0 flex-col justify-center bg-white">
            <BreakdownContainer className="h-full" />
          </Slide>
          <Slide className="flex h-[412px] min-h-0 flex-col items-center justify-center bg-[#f2f2f2] pb-14">
            <p className="w-full border-b border-[#e0e0e0] bg-white py-[2vh] text-center font-semibold text-[#666666]">
              Last 5 Attempts
            </p>
            <div className="z-30 flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#e0e0e0] scrollbar-thumb-rounded-full">
              {past_results.map((result) => (
                <ResultCard result={result} key={result.id} />
              ))}
            </div>
          </Slide>
        </Slideshow>
      </div>
    </>
  );

  // return (
  //   <>
  //     {/* NOTE: Desktop: */}
  //     <div
  //       className={c(
  //         'hidden gap-12 bg-white md:flex xl:rounded-md xl:shadow-md',
  //         exam.id === 'custom' ? 'w-1/2' : 'md:w-full xl:w-5/6'
  //       )}
  //     >
  //       <ScorePieContainer score={score} className="flex-1 py-12" />
  //       {/* {usersResults && (
  //         <div className="flex max-w-[calc(100%/3)] flex-1 flex-col items-center justify-center gap-16 border-x py-12">
  //           <p className="flex items-center text-theme-medium-gray">
  //             <b>Your Result</b>
  //             <b className="px-4 text-3xl text-theme-extra-dark-gray">
  //               <i>VS</i>
  //             </b>
  //             <b>Competitors</b>
  //           </p>
  //           <Carousel
  //             className="h-full w-full cursor-grab p-2"
  //             emulateTouch
  //             showStatus={false}
  //             showThumbs={false}
  //             showArrows={false}
  //             renderIndicator={(onClick, isSelected, index) => {
  //               return (
  //                 <button
  //                   className={c(
  //                     'mx-1 h-4 w-4 rounded-full',
  //                     isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
  //                   )}
  //                   onClick={onClick}
  //                   key={index}
  //                 />
  //               );
  //             }}
  //           >
  //             <div className="flex w-full flex-col items-start gap-16 px-4">
  //               <BarGraph
  //                 value={score}
  //                 label="Your Result"
  //                 style={{ width: `calc((${score} / 100) * 100%)` }}
  //               />
  //               <BarGraph
  //                 value={usersResults.average_score}
  //                 label="Competitor Average"
  //                 style={{
  //                   width: `calc((${usersResults.average_score} / 100) * 100%)`,
  //                 }}
  //               />
  //             </div>
  //             <StanineGraph score={score} className="w-full" />
  //           </Carousel>
  //         </div>
  //       )} */}
  //       <BreakdownContainer className="flex-1 py-12" />
  //     </div>

  //     {/* NOTE: Mobile: */}
  //     {usersResults && (
  //       <div className="w-full cursor-grab bg-white md:hidden">
  //         <Carousel
  //           emulateTouch
  //           showStatus={false}
  //           showThumbs={false}
  //           showArrows={false}
  //           renderIndicator={(onClick, isSelected, index) => {
  //             return (
  //               <button
  //                 className={c(
  //                   'mx-1 h-4 w-4 rounded-full',
  //                   isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
  //                 )}
  //                 onClick={onClick}
  //                 key={index}
  //               />
  //             );
  //           }}
  //         >
  //           <ScorePieContainer score={score} className="py-12" />
  //           <div className="flex w-full flex-col items-center justify-center gap-16 py-16">
  //             <p className="flex items-center text-theme-medium-gray">
  //               <b>Your Result</b>
  //               <b className="px-4 text-3xl text-theme-extra-dark-gray">
  //                 <i>VS</i>
  //               </b>
  //               <b>Competitors</b>
  //             </p>
  //             <div className="flex w-full flex-col items-start gap-16 px-4">
  //               <BarGraph
  //                 value={score}
  //                 label="Your Result"
  //                 style={{ width: `calc((${score} / 100) * 100%)` }}
  //               />
  //               <BarGraph
  //                 value={usersResults.average_score}
  //                 label="Competitor Average"
  //                 style={{
  //                   width: `calc((${usersResults.average_score} / 100) * 100%)`,
  //                 }}
  //               />
  //             </div>
  //           </div>
  //           <div className="flex w-full flex-col items-center justify-center gap-16 py-16">
  //             <p className="flex items-center text-theme-medium-gray">
  //               <b>Your Result</b>
  //               <b className="px-4 text-3xl text-theme-extra-dark-gray">
  //                 <i>VS</i>
  //               </b>
  //               <b>Competitors</b>
  //             </p>
  //             <StanineGraph score={score} className="w-full" />
  //           </div>
  //           <BreakdownContainer className="h-full pb-16 md:pb-0" />
  //         </Carousel>
  //       </div>
  //     )}

  //     {/* NOTE: Mobile with custom exam: */}
  //     {exam.id === 'custom' && (
  //       <div className="w-full cursor-grab bg-white md:hidden">
  //         <Carousel
  //           emulateTouch
  //           showStatus={false}
  //           showThumbs={false}
  //           showArrows={false}
  //           renderIndicator={(onClick, isSelected, index) => {
  //             return (
  //               <button
  //                 className={c(
  //                   'mx-1 h-4 w-4 rounded-full',
  //                   isSelected ? 'bg-theme-dark-gray' : 'bg-[#e8e8e8]'
  //                 )}
  //                 onClick={onClick}
  //                 key={index}
  //               />
  //             );
  //           }}
  //         >
  //           <ScorePieContainer score={score} className="py-12" />
  //           <BreakdownContainer className="h-full pb-16 md:pb-0" />
  //         </Carousel>
  //       </div>
  //     )}
  //   </>
  // );
};

export default OverviewTab;

interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  result: Result;
  weak_pass?: number;
  strong_pass?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  weak_pass,
  strong_pass,
  ...rest
}) => {
  const median: Median = (() => {
    if (!weak_pass || !strong_pass) return "average";
    else if (result.score < weak_pass) return "below";
    else if (result.score >= strong_pass) return "above";
    return "average";
  })();

  return (
    <div
      {...rest}
      className={c(
        "relative flex items-center justify-between rounded-[3px] border border-[#e9e9e9] bg-white px-4 py-1 shadow-sm",
        rest.className
      )}
    >
      <div className="flex flex-col justify-between gap-1 text-sm">
        <p className="text-left font-semibold text-[#686868]">
          {getDatePreview(result.start_time)}
        </p>
        <div className="flex items-end gap-3">
          <p className="font-semibold text-[#b7b7b7]">
            {getTime(result.start_time)} to {getTime(result.end_time)}
          </p>
          {result.mode === "training" && (
            <div className="flex items-center gap-1">
              <img
                className="h-3 w-3"
                src={p(`images/icon_mortarboard_enable.svg`)}
                alt="mortarboard"
              />
              <span className="whitespace-nowrap text-[10px] font-semibold text-theme-green">
                Training Mode
              </span>
            </div>
          )}
        </div>
      </div>
      <ScorePie
        className="h-[55px] w-[55px]"
        median={median}
        score={result.score}
        fontSize={16}
        innerRadius="85%"
        showPlane={false}
        precentage={false}
      />
      {result.mode === "training" && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[3px] bg-theme-green" />
      )}
    </div>
  );
};

// const DUMMY_RESULTS: Result[] = [
//   {
//     id: '0',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '1',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'training',
//   },
//   {
//     id: '2',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '3',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
//   {
//     id: '4',
//     score: 61,
//     start_time: 1677146566000,
//     end_time: 1677147286000,
//     mode: 'normal',
//   },
// ];
