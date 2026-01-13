import {createPortal} from 'react-dom';
import type {PropsWithChildren} from 'react';
import {ModalContextProvider, useModal, useModalStack} from '../contexts/ModalContext';

const ModalStack = () => {
	const modals = useModalStack();
	const {closeModal} = useModal();
	if (typeof document === 'undefined') return null;

	return createPortal(
		<>
			{modals.map((modal, index) => {
				const isTop = index === modals.length - 1;
				return (
					<div key={modal.id}>
						{modal.render({
							id: modal.id,
							close: () => closeModal(modal.id),
							zIndex: 50 + index * 10,
							isTop,
						})}
					</div>
				);
			})}
		</>,
		document.body
	);
};

const ModalProvider = ({children}: PropsWithChildren) => {
	return (
		<ModalContextProvider>
			{children}
			<ModalStack />
		</ModalContextProvider>
	);
};

export default ModalProvider;
