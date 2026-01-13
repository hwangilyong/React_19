import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import type {ReactNode} from 'react';

type ModalRenderProps = {
	id: string;
	close: () => void;
	zIndex: number;
	isTop: boolean;
};

type ModalInstance = {
	id: string;
	render: (props: ModalRenderProps) => ReactNode;
};

type ModalContextValue = {
	modals: ModalInstance[];
	openModal: (render: ModalInstance['render']) => string;
	closeModal: (id: string) => void;
	closeTop: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('useModal must be used within ModalProvider');
	}
	return {
		openModal: context.openModal,
		closeModal: context.closeModal,
		closeTop: context.closeTop,
	};
};

export const useModalStack = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('useModalStack must be used within ModalProvider');
	}
	return context.modals;
};

export const ModalContextProvider = ({children}: {children: ReactNode}) => {
	const [modals, setModals] = useState<ModalInstance[]>([]);
	const idCounterRef = useRef(0);

	const openModal = useCallback((render: ModalInstance['render']) => {
		const id = `modal-${idCounterRef.current += 1}`;
		setModals((prev) => [...prev, {id, render}]);
		return id;
	}, []);

	const closeModal = useCallback((id: string) => {
		setModals((prev) => prev.filter((modal) => modal.id !== id));
	}, []);

	const closeTop = useCallback(() => {
		setModals((prev) => prev.slice(0, -1));
	}, []);

	const value = useMemo(
		() => ({
			modals,
			openModal,
			closeModal,
			closeTop,
		}),
		[modals, openModal, closeModal, closeTop]
	);

	return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
