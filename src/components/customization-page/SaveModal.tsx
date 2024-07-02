import { useState } from 'react';
import { c } from '../../lib';
import { Button, Input, Modal, ModalProps } from '../core';

interface SaveModalProps extends ModalProps {
  save: (name: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ save, ...rest }) => {
  const [name, setName] = useState('');

  return (
    <Modal
      {...rest}
      className={c('flex flex-col bg-[#eaeaea]', rest.className)}
    >
      <p className="text-xl font-medium text-[#555555]">Save Customization</p>
      <Input
        className="mb-[2vh] mt-[3vh] w-full rounded-[3px] bg-[#f6f6f6] text-[#9c9c9c] placeholder:text-[#9c9c9c]"
        placeholder="Customisation Name (e.g. my first exam)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="ml-auto flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button
          color="green"
          disabled={name.length === 0}
          onClick={() => save(name)}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default SaveModal;
