import { useMemo, useState, useRef, useEffect } from 'react';
import { c, p } from '../../lib';
import { Question, TemplateType } from '../../types';
import { ImageModal } from '../common';
import {useSelector} from '../../hooks';

interface ExplanationTabProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean,
  templateType: TemplateType;
  add_styling_to_images:boolean;
  question: Question;
  closeExplanationTab: () => void;
}

const ExplanationTab: React.FC<ExplanationTabProps> = ({
  isOpen,
  templateType,
  add_styling_to_images,
  question,
  closeExplanationTab,
  ...rest
}) => {
  const rightAnswer = question.answers.find((answer) => answer.is_right)!;

  const [showImageModal, setShowImageModal] = useState(false);

  const [image, setImage] = useState<string | undefined>();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const examState = useSelector((state) => state.exam);

  const answerBody = useMemo(() => {
    switch (templateType) {
      case 'horizontal-images':
        return (
          <button
            className="transition hover:scale-105 hover:brightness-90"
            onClick={() => {
              setImage(rightAnswer.body as string);
              setShowImageModal(true);
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              className="h-48 w-48 object-contain"
              src={rightAnswer.body as string}
            />
          </button>
        );
      case 'horizontal-letters':
        return String.fromCharCode(
          65 + question.answers.findIndex((answer) => answer.is_right)
        );
      default:
        return rightAnswer.body;
    }
  }, [question.answers, templateType, rightAnswer]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (examState.paused || !isOpen){
        audio.pause();
        audio.currentTime = 0; 
        setIsPlaying(false);
      } else {
        if (isPlaying){
          audio.play();
        }
      }

      audio.addEventListener('timeupdate', updateProgress);
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
    
  }, [isPlaying, question, examState.paused, isOpen]);

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      if (progress === 100){
        setIsPlaying(false);
      }
    }
  }

  var audio_file_path = null;
  if (question && question.body){
    if (question.body.includes('audio-type-question-url=')){
      audio_file_path = question.body.replace("audio-type-question-url=", "");
    }
  }

  const closeTabDrawer = () => {
    if (audioRef.current){
      if (isPlaying){
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
        setIsPlaying(false);
      }
    }
    closeExplanationTab();
  }

  return (
    <>
      <div
        {...rest}
        className={c(
          'flex flex-col bg-white px-6 py-4 transition',
          rest.className
        )}
      >
        <button className="ml-auto" onClick={closeTabDrawer}>
          <img
            alt="exit icon"
            src={p('images/icon_close.svg')}
            className="w-6"
          />
        </button>
        <div className="mb-[5vh]">
          <p className="mb-[2vh] text-[15px] font-medium text-theme-light-gray">
            Question
          </p>

          {audio_file_path !== null && audio_file_path !== "" ?(
            <div
              className={"examination-content text-center text-lg text-theme-dark-gray md:text-small-title [&>img]:mb-16 [&>img]:max-h-[50vh]"}
            >
              <audio ref={audioRef} src={audio_file_path} />
              <div className="audio-explanation">
                <label onClick={() => togglePlayPause()}>{isPlaying?"Audio Playing":"Play Audio"}</label>
                <img
                  alt="speaker icon"
                  src={p(isPlaying? "images/speaker-playing.svg" : "images/speaker-not-playing.svg")}
                  className={"w-16 cursor-pointer"}
                  onClick={() => togglePlayPause()}
                />
              </div>
            </div>
          ):(
            <div
              className={"question-text text-small-title [&>img]:max-h-64" + (add_styling_to_images?" image-exam-content":"")}
              dangerouslySetInnerHTML={{ __html: question?.body || '' }}
            ></div>
            
          )}
          
        </div>
        <div className="mb-[5vh]">
          <p className="mb-[2vh] text-[15px] font-medium text-theme-light-gray">
            Answer
          </p>
          <div className="text-small-title font-semibold text-theme-green">
            {answerBody}
          </div>
        </div>
        <div className="flex min-h-[456px] flex-1 flex-col rounded-[0.2rem] border border-[#e0e0e0] text-theme-dark-gray">
          <p className="border-b border-[#e1e1e1] px-4 py-3 text-sm font-semibold text-[#6b6b6b]">
            Explanation
          </p>
          <div className="flex flex-1 flex-col overflow-y-auto bg-[#f7f7f7] p-4 scrollbar-thin scrollbar-thumb-theme-light-gray scrollbar-thumb-rounded-none 2xs:block">
            {/* <p>{question.explanation}</p> */}
            {question.featured_image && (
              <button
                className="top-0 mb-4 mt-2 h-36 self-center transition shadow-[0px_1px_3px_#e1e1e1] hover:scale-105 hover:brightness-90 2xs:float-right 2xs:ml-4 2xs:mr-2"
                onClick={() => {
                  setImage(question.featured_image);
                  setShowImageModal(true);
                }}
              >
                <img
                  alt="featured"
                  src={question.featured_image}
                  className="h-full"
                />
              </button>
            )}
            <div
              className="text-justify text-[13px] leading-[1.7em] text-[#5a5a5a]"
              dangerouslySetInnerHTML={{ __html: question.explanation || '' }}
            ></div>
          </div>
          {question.informations.length > 0 && (
            <div className="flex flex-col border-t border-[#e0e0e0] px-6 py-4">
              <p className="mb-5 text-sm font-semibold text-[#898989]">
                Additional Information:
              </p>
              <div className="flex flex-1 flex-col justify-between gap-4 text-[13px]">
                {question.informations.map((information) => (
                  <a
                    className="flex items-center gap-2 text-[#919191] hover:underline"
                    href={information.hyperlink}
                    key={information.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      alt="information icon"
                      src={p(getInformationIcon(information.type))}
                      className="h-4 w-4"
                    />
                    <span>{information.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {image && (
        <ImageModal
          image={image}
          visible={showImageModal}
          hideModal={() => setShowImageModal(false)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </>
  );

  function getInformationIcon(type: 'hyperlink' | 'image' | 'pdf') {
    switch (type) {
      case 'hyperlink':
        return 'images/icon_hyperlink.svg';
      case 'image':
        return 'images/icon_image.svg';
      case 'pdf':
        return 'images/icon_document.svg';
    }
  }
};

export default ExplanationTab;
