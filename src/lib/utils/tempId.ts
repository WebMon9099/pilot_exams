import { v4 as uuidv4 } from 'uuid';

function tempId() {
  return `temp_${uuidv4()}`;
}

export default tempId;
