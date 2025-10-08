import { useContext } from 'react';
import { MessageContext } from '../context/MessageContext';

export const useMessage = () => useContext(MessageContext);
