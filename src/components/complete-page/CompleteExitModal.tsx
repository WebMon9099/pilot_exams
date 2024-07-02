import { p } from '../../lib';
import { Button, Modal, ModalProps } from '../core';

interface CompleteExitModalProps extends ModalProps {
  exitToMenu: () => void;
}

const CompleteExitModal: React.FC<CompleteExitModalProps> = ({
  exitToMenu,
  ...rest
}) => {
  return (
    <Modal
      {...rest}
      className="flex flex-col items-center text-theme-dark-gray"
    >
      <img
        alt="exit icon"
        src={p('images/icon_exit.svg')}
        className="mb-[2vh] w-10"
      />
      <b className="mb-[2vh]">Are you sure you want to exit?</b>
      <div className="flex gap-6">
        <Button onClick={rest.hideModal}>Cancel</Button>
        <Button color="gray" onClick={exitToMenu}>
          Exit to Menu
        </Button>
      </div>
    </Modal>
  );
};

export default CompleteExitModal;
