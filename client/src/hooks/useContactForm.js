import { useCallback, useState } from 'react';
import { api } from '../lib/api';

const EMPTY = { name: '', email: '', message: '', company: '' };

export default function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [formError, setFormError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors(({ [name]: _cleared, ...rest }) => rest);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrors({});
    setFormError('');

    try {
      await api.sendContact(values);
      setValues(EMPTY);
      setStatus('success');
    } catch (err) {
      setErrors(err.errors ?? {});
      setFormError(err.errors ? '' : err.message);
      setStatus('error');
    }
  };

  const resetStatus = useCallback(() => setStatus('idle'), []);

  return { values, errors, status, formError, handleChange, handleSubmit, resetStatus };
}
