import { p } from '../../lib';
import { Button, Modal, ModalProps } from '../core';

interface CompleteRestartModalProps extends ModalProps {
  restart: () => void;
}

const CompleteRestartModal: React.FC<CompleteRestartModalProps> = ({
  restart,
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
      <b className="mb-[2vh]">Are you sure you want to restart?</b>
      <div className="flex gap-6">
        <Button onClick={rest.hideModal}>Cancel</Button>
        <Button color="gray" onClick={restart}>
          Restart
        </Button>
      </div>
    </Modal>
  );
};

export default CompleteRestartModal;
