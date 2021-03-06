import { SUBJECT_TYPE, EVENTS_BY_SUBJECT_TYPE } from '../constants';

export default function(subject, { file, subjectType, force, window }) {
  const dataTransfer = new window.DataTransfer();
  dataTransfer.items.add(file);
  if (subjectType === SUBJECT_TYPE.INPUT) {
    const inputElement = subject[0];

    inputElement.files = dataTransfer.files;
  }

  if (force) {
    const events = EVENTS_BY_SUBJECT_TYPE[subjectType];
    const eventPayload = {
      bubbles: true,
      cancelable: true,
      detail: dataTransfer,
    };

    try {
      events.forEach(e => {
        const event = new CustomEvent(e, eventPayload);
        Object.assign(event, { dataTransfer });

        subject[0].dispatchEvent(event);
      });
    } catch (e) {
      // make sure event triggering won't break if subject element is not visible or in DOM anymore
    }
  }
}
