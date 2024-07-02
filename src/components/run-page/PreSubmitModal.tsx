import { c } from '../../lib';
import { Button, Modal, ModalProps } from '../core';

interface PreSubmitModalProps extends ModalProps {
  onSubmit: () => void;
}

const PreSubmitModal: React.FC<PreSubmitModalProps> = ({
  onSubmit,
  ...rest
}) => {
  return (
    <Modal {...rest} className={c('flex flex-col gap-4', rest.className)}>
      <b className="text-theme-dark-gray">
        Are you sure you want to submit the exam?
      </b>
      <div className="ml-auto flex gap-6">
        <Button onClick={rest.hideModal}>Cancel</Button>
        <Button color="gray" onClick={onSubmit}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default PreSubmitModal;
