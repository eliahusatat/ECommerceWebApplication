
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export const showModal = (modalType, title, message) => ({
  type: SHOW_MODAL,
  payload: { modalType, title, message },
});

export const hideModal = () => ({
  type: HIDE_MODAL,
});
