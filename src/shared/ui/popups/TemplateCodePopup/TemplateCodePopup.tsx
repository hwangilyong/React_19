import {useMemo} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import BtnBasic from '@/shared/ui/buttons/Basic/BtnBasic';
import EditableTable from '@/shared/ui/tables/EditableTable';
import ModalTemplate from '@/shared/ui/templates/ModalTemplate/ModalTemplate';
import styles from './TemplateCodePopup.module.scss';

type TemplateCodeRow = {
	no: string;
	majorName: string;
	majorCode: string;
	minorName: string;
	minorCode: string;
	isPlaceholder?: boolean;
};

interface TemplateCodePopupProps {
	onClose: () => void;
	zIndex?: number;
	isTop?: boolean;
}

const TemplateCodePopup = ({onClose, zIndex, isTop}: TemplateCodePopupProps) => {
	const isPlaceholderRow = (row: TemplateCodeRow) =>
		!row.majorName && !row.majorCode && !row.minorName && !row.minorCode;
	const columns = useMemo<ColumnDef<TemplateCodeRow>[]>(
		() => [
			{
				header: 'No',
				accessorKey: 'no',
				size: 44,
				meta: {
					editable: false,
					cellClassName: (row: { original: TemplateCodeRow }) =>
						isPlaceholderRow(row.original) ? styles.noCellPlaceholder : undefined,
				},
				cell: ({row}) => (
					<div className={styles.noCell}>{String(row.index + 1)}</div>
				),
			},
			{
				header: '대분류 코드명',
				accessorKey: 'majorName',
				size: 160,
			},
			{
				header: '대분류 코드값',
				accessorKey: 'majorCode',
				size: 160,
			},
			{
				header: '소분류 코드명',
				accessorKey: 'minorName',
				size: 160,
			},
			{
				header: '소분류 코드값',
				accessorKey: 'minorCode',
				size: 150,
			},
		],
		[]
	);

	const data = useMemo<TemplateCodeRow[]>(
		() => [
			{
				no: '1',
				majorName: 'MOP_CDE',
				majorCode: '관재질',
				minorName: 'MOP049',
				minorCode: 'SP(세라믹코딩강관)',
			},
			{
				no: '2',
				majorName: 'MOP_CDE',
				majorCode: '관재질',
				minorName: 'MOP036',
				minorCode: 'PLP(폴리에틸렌피복강관)',
			},
			...Array.from({length: 14}).map(() => ({
				no: '-',
				majorName: '',
				majorCode: '',
				minorName: '',
				minorCode: '',
				isPlaceholder: true,
			})),
		],
		[]
	);

	const createRow = () => ({
		no: '-',
		majorName: '',
		majorCode: '',
		minorName: '',
		minorCode: '',
		isPlaceholder: true,
	});

	return (
		<ModalTemplate
			title="템플릿 코드 세팅"
			onClose={onClose}
			contentClassName={styles.content}
			footerClassName={styles.actions}
			zIndex={zIndex}
			isTop={isTop}
			footer={
				<>
					<BtnBasic theme="white" className={styles.actionButton} onClick={onClose}>
						취소
					</BtnBasic>
					<BtnBasic theme="white" className={styles.actionButton}>
						저장하기
					</BtnBasic>
				</>
			}
		>
			<div className={styles.notice}>
				<span className={styles.noticeBullet}>※</span>
				<span>
					아래 입력란에 <strong>‘템플릿 코드’</strong>를 등록해주세요.
				</span>
			</div>
			<div className={styles.notice}>
				<span className={styles.noticeBullet}>※</span>
				<span>
					엑셀 데이터를 <strong>‘템플릿 코드’ 그대로 붙여넣어</strong> 생성 시간을
					단축하세요!
				</span>
			</div>
			<EditableTable
				className={styles.table}
				headerClassName={styles.tableHeader}
				bodyClassName={styles.tableBody}
				columns={columns}
				data={data}
				createRow={createRow}
				wrapperHeight={505}
				history
			/>
		</ModalTemplate>
	);
};

export default TemplateCodePopup;
