import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import useContactForm from '../../hooks/useContactForm';
import ChamferCard from '../ui/ChamferCard';
import DrsButton from '../ui/DrsButton';
import Toast from '../ui/Toast';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', maxLength: 80 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'message', label: 'Message', multiline: true, maxLength: 2000 },
];

const INPUT =
  'w-full border bg-black/60 px-4 py-3 text-ink transition-colors placeholder:text-muted/60 hover:border-muted';

function Field({ field, value, error, onChange, inputRef }) {
  const { name, label, multiline, ...attrs } = field;
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const Control = multiline ? 'textarea' : 'input';

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.25em] text-muted"
      >
        {label}
      </label>
      <Control
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        rows={multiline ? 6 : undefined}
        className={`${INPUT} ${multiline ? 'resize-y' : ''} ${error ? 'border-danger' : 'border-line'}`}
        {...attrs}
      />
      {error && (
        <p
          id={errorId}
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const { values, errors, status, formError, handleChange, handleSubmit, resetStatus } =
    useContactForm();
  const fieldRefs = useRef({});
  const submitting = status === 'submitting';

  useEffect(() => {
    const firstInvalid = FIELDS.find(({ name }) => errors[name]);
    if (firstInvalid) fieldRefs.current[firstInvalid.name]?.focus();
  }, [errors]);

  return (
    <>
      <ChamferCard className="mx-auto max-w-2xl" bodyClassName="p-6 sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <span className="text-red">Radio</span>
          <span aria-hidden="true" className="mx-2 text-line">
            /
          </span>
          Open channel
        </p>
        <p className="mt-4 text-lg text-ink/90">
          Have a project, a role, or an idea worth building? Send a message and I will get back to
          you.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          {FIELDS.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={handleChange}
              inputRef={(node) => {
                fieldRefs.current[field.name] = node;
              }}
            />
          ))}

          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.company}
              onChange={handleChange}
            />
          </div>

          {formError && (
            <p
              role="alert"
              className="border-l-2 border-danger bg-danger/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink"
            >
              {formError}
            </p>
          )}

          <DrsButton type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting && <Loader2 aria-hidden="true" size={16} className="animate-spin" />}
            {submitting ? 'Transmitting' : 'Send Message'}
          </DrsButton>
        </form>
      </ChamferCard>

      <Toast
        message={status === 'success' ? 'Message received. I will be in touch soon.' : ''}
        onDismiss={resetStatus}
      />
    </>
  );
}
