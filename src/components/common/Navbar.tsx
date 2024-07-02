import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useExam, useSelector } from "../../hooks";
import { c, p } from "../../lib";
import { togglePaused } from "../../redux";
import { ToggleButton } from "../core";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  minified?: boolean;
  endButtons?: boolean | "exit" | "restart" | "help" | "performance";
  hideMode?: boolean;
  mobileBackButton?: boolean;
  showExitModal?: () => void;
  showRestartModal?: () => void;
  showTrainingModeModal?: () => void;
  helpHyperlink: string;
  performanceUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({
  minified = false,
  endButtons = false,
  hideMode = false,
  mobileBackButton = false,
  showExitModal,
  showRestartModal,
  showTrainingModeModal,
  helpHyperlink,
  performanceUrl,
  ...rest
}) => {
  const navigate = useNavigate();

  const { exam } = useExam();

  const dispatch = useDispatch();
  const {
    time: t,
    trainingMode,
    score,
    mode,
    customization,
  } = useSelector((state) => state.exam);

  const [showRemaining, setShowRemaining] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", onBackgroundClick);

    return () => document.removeEventListener("click", onBackgroundClick);

    function onBackgroundClick() {
      setMenuOpen(false);
    }
  }, []);

  const modeLabel = (() => {
    switch (mode) {
      case "normal":
        return "Normal";
      case "copilot":
        return "CoPilot";
      case "customization":
        return "Customisation";
    }
  })();

  const exam_duration = exam 
    ? ((mode === "customization" && customization) 
      ? customization.duration * 60 
      : exam.duration) 
    : 0
  const time = exam ? (showRemaining ? exam_duration - t : t) : 0;

  const questionQuantity = exam
    ? mode === "customization" && customization
      ? customization.question_quantity
      : exam.question_quantity
    : 0;

  if (!exam) return null;

  return (
    <nav
      {...rest}
      className={c(
        "sticky left-0 right-0 top-0 z-20 flex select-none font-inter text-white",
        trainingMode && !minified ? "bg-[#82dd47]" : "bg-[#3793d1]",
        rest.className
      )}
    >
      {mobileBackButton && (
        <button
          className="flex h-full shrink-0 items-center gap-2 bg-theme-dark-blue px-4 transition hover:brightness-95 lg:hidden"
          onClick={() => navigate(`/${exam.id}`, { replace: true })}
        >
          <img
            alt="back icon"
            src={p("images/icon_back.svg")}
            className="h-4"
          />
          Back
        </button>
      )}
      <div className="flex min-w-0 flex-1 basis-0 items-center gap-[10px] px-2 py-2 md:px-3">
        <button
          className="h-full shrink-0 transition hover:scale-105 hover:brightness-105 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();

            setMenuOpen(!menuOpen);
          }}
        >
          <img
            alt="roundel logo"
            src={p("images/logo_roundel.svg")}
            className="h-4/5"
            draggable={false}
          />
        </button>
        <div className="flex flex-1 items-baseline gap-[5px] overflow-hidden">
          <span className="truncate text-[17px] tracking-[0.3px] lg:text-xl">
            {exam.name}
          </span>
          {!hideMode && (
            <span
              className={c(
                "hidden truncate text-sm sm:block lg:text-lg",
                !minified && "hidden",
                trainingMode ? "text-white opacity-50" : "text-white opacity-50"
              )}
            >
              {modeLabel} Mode
            </span>
          )}
        </div>
      </div>
      {!minified && (
        <>
          <div
            className={c(
              "hidden shrink-0 items-center px-[1vw] py-2 lg:flex",
              trainingMode ? "bg-[#74d73c]" : "bg-theme-dark-blue"
            )}
          >
            <img
              alt="training mode icon"
              src={p("images/icon_mortarboard.svg")}
              className="mr-4 w-9"
              draggable={false}
            />
            <span className="mr-8">Training Mode</span>
            <ToggleButton
              className="shrink-0"
              color={trainingMode ? "green" : "blue"}
              isChecked={trainingMode}
              onClick={(e) => {
                e.stopPropagation();

                if (showTrainingModeModal) showTrainingModeModal();
              }}
            />
          </div>
          <div className="flex items-center gap-[2vw] px-3 py-2 lg:bg-[#232323]">
            <div className="hidden h-full lg:flex">
              <ActionButton
                className="h-full"
                icon="icon_playpause.svg"
                onClick={() => dispatch(togglePaused())}
                disabled={!trainingMode}
              />
              <ActionButton
                className="h-full"
                icon="icon_settings.svg"
                disabled
              />
              <ActionButton
                className="h-full"
                icon="icon_performance.svg"
                onClick={() => window.open(performanceUrl)}
                disabled
              />
              <ActionButton
                className="h-full"
                icon="icon_help.svg"
                onClick={() => window.open(helpHyperlink)}
              />
              <ActionButton
                className="h-full"
                icon="icon_exit.svg"
                onClick={(e) => {
                  e.stopPropagation();

                  if (showExitModal) showExitModal();
                }}
              />
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <span>
                <span className="hidden opacity-40 lg:inline-block">
                  {showRemaining ? "Remaining" : "Elapsed"}:
                </span>
                <span className="opacity-40 lg:hidden">
                  {showRemaining ? "R" : "E"}:
                </span>{" "}
                <span>
                  {Math.floor(time / 60) < 10 && "0"}
                  {Math.floor(time / 60)}:{time % 60 < 10 && "0"}
                  {time % 60}
                </span>
              </span>
              <span>
                <span className="hidden opacity-50 lg:inline-block">
                  Score:
                </span>
                <span className="opacity-50 lg:hidden">S:</span>{" "}
                <span>
                  {score}{" "}
                  <span className="hidden md:inline-block">
                    of {questionQuantity}
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div
            className={c(
              "absolute bottom-0 left-0 right-0 top-full bg-black/40 transition-all",
              menuOpen ? "visible opacity-100" : "invisible opacity-0"
            )}
          >
            <div
              className="flex w-5/6 flex-col bg-[#e0e0e0] text-theme-dark-gray shadow-lg lg:w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <NavbarMenuButton
                onClick={() => {
                  setMenuOpen(false);

                  if (showTrainingModeModal) showTrainingModeModal();
                }}
              >
                {trainingMode ? "Disable" : "Enable"} Training Mode
              </NavbarMenuButton>
              <NavbarMenuButton disabled={!trainingMode} onClick={() => dispatch(togglePaused())}>
                Play/Pause
              </NavbarMenuButton>
              <p className="px-6 py-4 font-extralight">Font Size:</p>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Increase
              </NavbarMenuButton>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Decrease
              </NavbarMenuButton>
              <NavbarMenuButton
                onClick={() => setShowRemaining(!showRemaining)}
              >
                Switch Elapsed/Remaining
              </NavbarMenuButton>
              <p className="px-6 py-4 font-extralight">Go to:</p>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                Performance
              </NavbarMenuButton>
              <NavbarMenuButton className="py-3 text-xs" disabled>
                User Guide
              </NavbarMenuButton>
              <NavbarMenuButton
                onClick={() => {
                  setMenuOpen(false);

                  if (showExitModal) showExitModal();
                }}
              >
                Exit to Main Menu
              </NavbarMenuButton>
            </div>
          </div>
        </>
      )}
      {endButtons && (
        <div className="flex">
          {(endButtons === true || endButtons === "performance") && (
            <button
              className="hidden h-full shrink-0 bg-theme-dark-blue px-4 hover:brightness-95 sm:block"
              onClick={() => {}}
            >
              <img
                alt="restart icon"
                src={p("images/performance.svg")}
                className="h-5 w-5"
              />
            </button>
          )}
          {(endButtons === true || endButtons === "help") && (
            <button
              className="hidden h-full shrink-0 bg-theme-dark-blue px-4 hover:brightness-95 sm:block"
              onClick={() => window.open(helpHyperlink)}
            >
              <img
                alt="restart icon"
                src={p("images/help.svg")}
                className="h-5 w-5"
              />
            </button>
          )}
          {(endButtons === true || endButtons === "restart") && (
            <button
              className="h-full shrink-0 bg-theme-dark-blue px-4 hover:brightness-95"
              onClick={showRestartModal}
            >
              <img
                alt="restart icon"
                src={p("images/icon_restart.svg")}
                className="h-6 w-6"
              />
            </button>
          )}
          {(endButtons === true || endButtons === "exit") && (
            <button
              className="h-full shrink-0 bg-theme-dark-blue px-4 hover:brightness-95"
              onClick={showExitModal}
            >
              <img
                alt="exit icon"
                src={p("images/icon_exit_white.svg")}
                className="h-6 w-6"
              />
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const ActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: string }
> = ({ icon, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        "flex h-full w-10 items-center justify-center transition",
        rest.disabled
          ? "opacity-30"
          : "hover:scale-105 hover:brightness-125 active:scale-95 active:brightness-95",
        rest.className
      )}
    >
      <img
        alt="action button"
        src={p(`images/${icon}`)}
        className="w-5"
        draggable={false}
      />
    </button>
  );
};

const NavbarMenuButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        "group px-6 py-4 text-left",
        rest.disabled ? "opacity-30" : "hover:bg-theme-blue hover:text-white",
        rest.className
      )}
    >
      <span>{children}</span>
    </button>
  );
};
