import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomizations, postCustomization } from "../api";
import {
  Button,
  CategoriesBox,
  ExitModal,
  HorizontalRadio,
  LabeledBox,
  LoadModal,
  Navbar,
  SaveModal,
  Slider,
} from "../components";
import { useDispatch, useExam, useLoadingScreen } from "../hooks";
import { p, tempId } from "../lib";
import { setCustomization } from "../redux";
import { Customization } from "../types";

const CustomizationPage: React.FC = () => {
  const { exam } = useExam();

  const client = useQueryClient();

  const { isLoading: customizationsLoading, data: customizations } = useQuery(
    ["customizations"],
    () => (exam ? getCustomizations(exam.id) : null),
    {
      retry: 0,
      staleTime: Infinity,
    }
  );
  const {
    mutate: mutateCustomizations,
    isLoading: mutateCustomizationsLoading,
  } = useMutation(
    (customization: Customization) => postCustomization(customization),
    {
      onSuccess: () => client.invalidateQueries(["customizations"]),
    }
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const [loadedCustomization, setLoadedCustomization] = useState<
    Customization | undefined
  >();

  const [duration, setDuration] = useState(15);
  const [questionQuantity, setQuestionQuantity] = useState(() => {
    if (exam && exam.min_questions !== null && exam.max_questions !== null) {
      return Math.round((exam.min_questions + exam.max_questions) / 2);
    }

    return 20;
  });
  const [coPilotActivated, setCoPilotActivated] = useState(true);

  const [disabledCateogiresIds, setDisabledCateogriesIds] = useState<string[]>(
    []
  );

  useLoadingScreen(customizationsLoading || mutateCustomizationsLoading);

  if (!exam) return null;

  return (
    <main className="flex flex-1 flex-col">
      <Navbar
        className="h-14 w-full"
        minified
        endButtons="exit"
        helpHyperlink=""
        performanceUrl=""
        showExitModal={() => setExitModalOpen(true)}
      />
      <button
        className="my-2 hidden items-center gap-2 px-6 py-2 text-sm font-semibold !text-theme-medium-gray hover:brightness-95 lg:flex"
        onClick={() => navigate(`/${exam.id}`, { replace: true })}
      >
        <img
          alt="arrow icon"
          src={p("images/light_grey_arrow.svg")}
          className="h-2 rotate-90 opacity-60"
        />
        <span>Return to Main Menu</span>
      </button>
      <div className="p-[10px_15px] lg:flex lg:flex-1 lg:justify-center lg:p-[unset] lg:px-8 lg:pb-8 xl:items-center">
        <div className="w-full max-w-7xl overflow-hidden rounded-md border border-[#e3e3e3] bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-[#dfdfdf] bg-[#f7f7f7] p-8 py-[25px] lg:rounded-t-md">
            <span className="text-xl font-semibold text-theme-dark-gray">
              New Customisation
            </span>
            <a href="/user-guide/theoretical-content" target="_blank">
              <button
                className="hidden items-center gap-2 rounded-full border border-[#eee] bg-[#eeeeee87] px-6 py-2 font-inter text-sm !font-medium text-[#aaaaaa] hover:border-[#ddd] hover:!text-[#646464] lg:flex"
                color="gray"
              >
                Get help with Exam Customization{" "}
                <img
                  alt="help icon"
                  src={p("images/get_help.svg")}
                  className="h-5"
                />
              </button>
            </a>
          </div>
          <p className="p-8 text-[13px] leading-[27px] text-[#7a7a7a] lg:py-7 xl:text-sm">
            Modify the settings below to customise the duration, quantity of
            questions and the questions displayed to you within your exam.
          </p>
          <div className="flex flex-col gap-8 p-8 !pb-8 !pt-0 lg:flex-row lg:py-4">
            <div className="flex flex-1 flex-col gap-8">
              <LabeledBox label="Exam Duration" backgroundColor="#f7f7f7">
                <Slider
                  min={5}
                  max={30}
                  value={duration}
                  onValueChange={setDuration}
                  noun="minutes"
                />
                {/* <p className="mb-[2vh]">
                  Set the length of the examination, in minutes and seconds:
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={minutes}
                      onChange={(e) => {
                        setMinutes(e.target.value);

                        setLoadedCustomization(undefined);
                      }}
                    />
                    <span>minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={seconds}
                      onChange={(e) => {
                        setSeconds(e.target.value);

                        setLoadedCustomization(undefined);
                      }}
                    />
                    <span>seconds</span>
                  </div>
                </div> */}
              </LabeledBox>
              <LabeledBox label="No. of Questions" backgroundColor="#f7f7f7">
                <Slider
                  min={exam.min_questions || 1}
                  max={exam.max_questions || 40}
                  value={questionQuantity}
                  onValueChange={setQuestionQuantity}
                  noun="questions"
                />
              </LabeledBox>
              <LabeledBox label="CoPilot Mode" icon="copilot_icon.svg">
                <div className="flex flex-col items-start gap-2 sm:flex-row">
                  <p className="text-[13px] leading-[27px] text-[#7a7a7a] xl:text-sm">
                    Enable or disable CoPilot Mode to enable adjustment of
                    question category weighting, enabling you to focus on
                    particular area of weakness.
                  </p>
                  <div>
                    <HorizontalRadio
                      options={[
                        { key: "on", label: "On" },
                        { key: "off", label: "Off" },
                      ]}
                      selectedOption={coPilotActivated ? "on" : "off"}
                      onOptionChange={(value) =>
                        setCoPilotActivated(value === "on")
                      }
                    />
                    {/* <ToggleButton
                      className="mt-[1vh] !w-[80px] border border-theme-light-gray bg-[#f9f9f9] after:w-[35px] after:!bg-theme-blue"
                      color="blue"
                      isChecked={coPilotActivated}
                      onToggle={(toggled) => {
                        setCoPilotActivated(toggled);

                        setLoadedCustomization(undefined);
                      }}
                      textColor="#c6c6c6"
                      upperCase
                    /> */}
                  </div>
                </div>
              </LabeledBox>
            </div>
            <div className="flex flex-1 flex-col gap-8">
              <LabeledBox className="flex-1" label="Question Categories">
                <div className="flex h-full flex-col">
                  <p className="mb-[2vh] text-[13px] leading-[27px] text-[#7a7a7a] xl:text-sm">
                    Select the question categories to appear within your
                    examination:
                  </p>
                  <CategoriesBox
                    className="w-full flex-1 overflow-y-auto lg:basis-0"
                    disabledCateogiresIds={disabledCateogiresIds}
                    setDisabledCateogriesIds={(disabledCateogriesIds) => {
                      setDisabledCateogriesIds(disabledCateogriesIds);

                      setLoadedCustomization(undefined);
                    }}
                    categories={exam.categories}
                  />
                </div>
              </LabeledBox>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button
                  className="whitespace-nowrap"
                  disabled={!customizations || customizations.length === 0}
                  onClick={(e) => {
                    e.stopPropagation();

                    setLoadModalOpen(true);
                  }}
                >
                  Load Customization
                </Button>
                <Button
                  className="whitespace-nowrap"
                  color="green"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (loadedCustomization) {
                      loadedCustomization.duration = duration;
                      loadedCustomization.question_quantity = questionQuantity;
                      dispatch(
                        setCustomization(
                          _.omit(loadedCustomization, "time_added")
                        )
                      );

                      navigate(`/${exam.id}/run`, { replace: true });
                    } else setSaveModalOpen(true);
                  }}
                >
                  {loadedCustomization ? "Launch" : "Save & Launch"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoadModal
        className="mx-[2vw] w-full !max-w-2xl"
        customizations={customizations || []}
        visible={loadModalOpen}
        hideModal={() => setLoadModalOpen(false)}
        load={(i) => {
          if (!customizations || customizations.length === 0) return;

          const customization = customizations[i];

          setDuration(customization.duration);
          setQuestionQuantity(customization.question_quantity);
          setCoPilotActivated(customization.copilot_activated);
          setDisabledCateogriesIds(customization.disabled_categories);

          setLoadedCustomization(customization);
          setLoadModalOpen(false);
        }}
      />
      <SaveModal
        className="mx-[2vw] w-full !max-w-2xl"
        save={(name) => {
          const newCustomization = {
            id: tempId(),
            exam_id: exam.id,
            name,
            time_added: new Date(),
            duration,
            question_quantity: questionQuantity,
            copilot_activated: coPilotActivated,
            disabled_categories: disabledCateogiresIds,
          };

          mutateCustomizations(newCustomization);

          dispatch(setCustomization(_.omit(newCustomization, "time_added")));
          navigate(`/${exam.id}/run`, { replace: true });
        }}
        visible={saveModalOpen}
        hideModal={() => setSaveModalOpen(false)}
      />
      <ExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate(`/${exam.id}`)}
      />
    </main>
  );
};

export default CustomizationPage;
