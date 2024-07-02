import { useEffect, useState } from 'react';
import { c } from '../../lib';
import { Customization } from '../../types';
import { Button, Modal, ModalProps } from '../core';
import LabeledBox from './LabaledBox';

interface LoadModalProps extends ModalProps {
  customizations: Customization[];
  load: (index: number) => void;
}

const LoadModal: React.FC<LoadModalProps> = ({
  customizations,
  load,
  ...rest
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    if (rest.visible) {
      return () => {
        setSelectedIndex(undefined);
      };
    }
  }, [rest.visible]);

  return (
    <Modal {...rest} className={c('flex flex-col', rest.className)}>
      <p className="text-xl font-medium text-[#555555]">Load Customization</p>
      <LabeledBox
        className="mb-[2vh] mt-[3vh] overflow-hidden"
        label="Customizations"
        noPadding
      >
        <div className="flex border-b border-b-theme-border bg-[#f7f7f7] px-[2vh] py-3 font-semibold text-[#999999]">
          <span className="flex-1">Name</span>
          <span className="flex-1">Date & Time</span>
        </div>
        <div className='max-h-[64vh] overflow-y-auto'>
          <ul>
            {customizations
              .sort(
                (cust1, cust2) =>
                  cust2.time_added.getTime() - cust1.time_added.getTime()
              )
              .map((customization, i) => (
                <li
                  className={c(i < 4 && 'border- border-b last:border-none')}
                  key={customization.id}
                >
                  <button
                    className={c(
                      'group flex w-full px-[2vh] py-4 text-left transition',
                      i === selectedIndex ? '!bg-[#33bde4]' : 'bg-white'
                    )}
                    onClick={() => setSelectedIndex(i)}
                  >
                    <span
                      className={c(
                        'flex-1 group-hover:text-white',
                        i === selectedIndex
                          ? '!text-white'
                          : '!text-theme-dark-gray'
                      )}
                    >
                      {customization.name}
                    </span>
                    <span
                      className={c(
                        'flex-1 text-theme-light-gray group-hover:text-white',
                        i === selectedIndex
                          ? '!text-white'
                          : '!text-theme-dark-gray'
                      )}
                    >
                      {customization.time_added
                        .toLocaleTimeString()
                        .replace(/(.*)\D\d+/, '$1')}{' '}
                      on {customization.time_added.toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </LabeledBox>
      <div className="ml-auto flex gap-6">
        <Button color="gray" onClick={rest.hideModal}>
          Cancel
        </Button>
        <Button
          disabled={selectedIndex === undefined}
          onClick={() => {
            if (selectedIndex !== undefined) load(selectedIndex);
          }}
        >
          Load
        </Button>
      </div>
    </Modal>
  );
};

export default LoadModal;
