//style
import './GeneralModal.css';

//store
import { connect } from 'react-redux';
import { hideModal } from '../../redux/actions/modalActions';




const GeneralModal = ({ modal, hideModal }) => {
  if (!modal.isVisible) return null;

  const getModalClass = () => {
    switch (modal.modalType) {
      case 'success':
        return 'modal-success';
      case 'error':
        return 'modal-error';
      case 'warning':
        return 'modal-warning';
      case 'info':
        return 'modal-info';
      default:
        return '';
    }
  };

  return (
    <div className="modal">
      <div className={`modal-content ${getModalClass()}`}>
        <span className="close" onClick={hideModal}>&times;</span>
        <h2>{modal.title}</h2>
        <p>{modal.message}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modal: state.modal,
});

const mapDispatchToProps = {
  hideModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralModal);
