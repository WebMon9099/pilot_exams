import { c } from '../../lib';
import { Modal, ModalProps } from '../core';

interface ImageModalProps extends ModalProps {
  image: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, ...rest }) => {
  return (
    <Modal
      {...rest}
      className={c(
        'w-[95%] !max-w-[unset] lg:h-3/4 lg:w-[unset]',
        rest.className
      )}
    >
      <img alt="featured" src={image} className="h-full w-full" />
    </Modal>
  );
};

export default ImageModal;
