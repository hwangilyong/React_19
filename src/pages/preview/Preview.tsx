import { useEffect, useState } from 'react';
import { icons } from '@/shared/assets/images';
import BtnBasic from '@/shared/ui/buttons/Basic/BtnBasic.tsx';
import BtnToggle from '@/shared/ui/buttons/Toggle/BtnToggle';
import Input from '@/shared/ui/inputs/Input';
import DatePicker from '@/shared/ui/date-picker/DatePicker';
import TableTemplate from '@/shared/ui/templates/TableTemplate/TableTemplate';
import tableStyles from '@/shared/ui/templates/TableTemplate/TableTemplate.module.scss';
import {type ColumnDef} from '@tanstack/react-table';
import Select from '@/shared/ui/select/Select';
import CheckBox from '@/shared/ui/checkbox/CheckBox';
import EditableTable from '@/shared/ui/tables/EditableTable';
import TemplateCodePopup from '@/shared/ui/popups/TemplateCodePopup/TemplateCodePopup';
import {useModal} from '@/app/contexts/ModalContext';
import clsx from "clsx";

const btnIcons = icons.btn;
const inputIcons = icons.input;

type TableRow = {
	name: string;
	location: string;
	operator: string;
	area: string;
	length: string;
};

type EditableTableRow = {
	item: string;
	category: string;
	qty: string;
	owner: string;
};

const tableData: TableRow[] = [
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
	{
		name: '부산 에코델타시티지하매설관 공사',
		location: '전라북도 전주시 화전동 54-1번지 외 4개소 일원',
		operator: '한국수자원공사 금강사업권',
		area: '100 ㎢',
		length: '250 km',
	},
];

const editableTableData: EditableTableRow[] = [
	{item: '관로 점검', category: '점검', qty: '3', owner: '김영수'},
	{item: '현장 사진 업로드', category: '기록', qty: '12', owner: '박지민'},
	{item: '측량 데이터 정리', category: '정리', qty: '5', owner: '이수진'},
	{item: '측량 데이터 정리', category: '정리', qty: '5', owner: '이수진'},
	{item: '측량 데이터 정리', category: '정리', qty: '5', owner: '이수진'},
];

const tableColumns: ColumnDef<TableRow>[] = [
	{
		header: '현장명',
		accessorKey: 'name',
		cell: ({getValue}) => (
			<div className="flex items-center gap-[8px]">
				<img alt="" className="h-[20px] w-[20px]" src={inputIcons.calendar} />
				<span className="text-mws-blue-600">{getValue<string>()}</span>
			</div>
		),
		size: 300,
	},
	{
		header: '측량위치',
		accessorKey: 'location',
		size: 360,
	},
	{
		header: '시행자',
		accessorKey: 'operator',
		size: 220,
	},
	{
		header: '사업량(면적)',
		accessorKey: 'area',
		size: 160,
	},
	{
		header: '사업량(길이)',
		accessorKey: 'length',
		size: 160,
	},
];

const editableTableColumns: ColumnDef<EditableTableRow>[] = [
	{
		header: '작업 항목',
		accessorKey: 'item',
		size: 260,
	},
	{
		header: '카테고리',
		accessorKey: 'category',
		size: 160,
	},
	{
		header: '수량',
		accessorKey: 'qty',
		size: 120,
	},
	{
		header: '담당자',
		accessorKey: 'owner',
		size: 160,
	},
];

const THEME_STORAGE_KEY = 'theme';
type ThemeMode = 'light' | 'dark';

const applyTheme = (nextTheme: ThemeMode) => {
	const root = document.documentElement;
	root.setAttribute('data-theme', nextTheme);
	root.classList.toggle('dark', nextTheme === 'dark');
};

const ColorGuide = () => (
	<section className="flex flex-col gap-[28px]">
		<h2 className="text-[40px] font-bold text-mws-black"># Color Guide</h2>
		<div className="flex flex-wrap gap-0">
			<div className="flex h-[150px] w-[264px] items-end border border-mws-gray-300 bg-mws-white p-[20px]">
				<span className="text-[14px] font-medium text-mws-ink-600">#FFFFFF</span>
			</div>
			<div className="flex h-[150px] w-[264px] items-end border border-mws-gray-300 bg-mws-gray-100 p-[20px]">
				<span className="text-[14px] font-medium text-mws-ink-600">#EEF0F8</span>
			</div>
			<div className="flex h-[150px] w-[264px] items-end bg-mws-blue-500 p-[20px]">
				<span className="text-[14px] font-medium text-mws-white">#4880FF</span>
			</div>
			<div className="flex h-[150px] w-[264px] items-end bg-mws-blue-400 p-[20px]">
				<span className="text-[14px] font-medium text-mws-white">#49AEFF</span>
			</div>
		</div>
	</section>
);

const FontGuide = () => (
	<section className="flex flex-col gap-[44px]">
		<h2 className="text-[40px] font-bold text-mws-black"># Font Guide</h2>

		<div className="flex flex-col gap-[20px]">
			<h3 className="text-[32px] font-bold text-mws-black">Font Style</h3>
			<div className="flex items-center gap-[12px] text-[14px] text-mws-black">
				<span className="h-[2px] w-[2px] bg-mws-ink-650" />
				<span className="font-medium">폰트는 프리텐다드 폰트를 기본으로 사용합니다.</span>
			</div>
			<div className="flex flex-wrap items-end gap-[32px]">
				<span className="text-[48px] font-bold text-mws-black">프리텐다드</span>
				<div className="flex flex-col gap-[6px] text-[14px] text-mws-black">
					<span>Regular</span>
					<span className="text-[16px]">abcdefghijklmnopqrstuvwxyz</span>
					<span className="text-[16px]">ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ</span>
					<span className="text-[16px]">아야어여오요우유으이</span>
				</div>
				<div className="flex items-start gap-[24px] text-[14px] text-mws-black">
					<span>Medium</span>
					<span className="font-semibold">SemiBold</span>
				</div>
			</div>
		</div>

		<div className="flex flex-col gap-[20px]">
			<h3 className="text-[32px] font-bold text-mws-black">Font Color</h3>
			<div className="flex items-center gap-[12px] text-[14px] text-mws-black">
				<span className="h-[2px] w-[2px] bg-mws-ink-650" />
				<span className="font-medium">
					폰트 컬러는 <span className="font-bold">비활성화 포함 4가지</span>로 최소화 시킵니다.
				</span>
			</div>
			<div className="rounded-[4px] border border-mws-gray-250 p-[32px]">
				<div className="grid gap-[16px] lg:grid-cols-5">
					<div className="flex h-[150px] flex-col justify-between bg-mws-ink-900 p-[20px] text-mws-white">
						<div className="text-[15px] font-medium">
							<p>Headline</p>
							<p>본문</p>
						</div>
						<p className="text-[14px]">#242628</p>
					</div>
					<div className="flex h-[150px] flex-col justify-between bg-mws-gray-600 p-[20px] text-mws-white">
						<div className="text-[15px] font-medium">
							<p>Sub Headline</p>
							<p>본문</p>
						</div>
						<p className="text-[14px]">#797A7C</p>
					</div>
					<div className="flex h-[150px] flex-col justify-between bg-mws-ink-900 p-[20px] text-mws-white">
						<div className="text-[15px] font-medium">
							<p>Body</p>
							<p>본문</p>
						</div>
						<p className="text-[14px]">#242628</p>
					</div>
					<div className="flex h-[150px] flex-col justify-between bg-mws-blue-600 p-[20px] text-mws-white">
						<div className="text-[15px] font-medium">
							<p>Body</p>
							<p>본문</p>
						</div>
						<p className="text-[14px]">#0076FF</p>
					</div>
					<div className="flex h-[150px] flex-col justify-between bg-mws-gray-500 p-[20px] text-mws-white">
						<div className="text-[15px] font-medium">
							<p>Disabled</p>
							<p>비활성화</p>
						</div>
						<p className="text-[14px]">#9095AC</p>
					</div>
				</div>
				<div className="mt-[12px] grid text-[14px] font-medium text-mws-ink-500 lg:grid-cols-5">
					<p>계층구조에서 상위 컬러입니다.</p>
					<p>계층구조에서 중간 컬러입니다.</p>
					<p>계층구조에서 하위 컬러입니다.</p>
					<p>계층구조에서 중간 컬러입니다.</p>
					<p>비활성화에서 사용 하는 컬러입니다.</p>
				</div>
			</div>
		</div>

		<div className="flex flex-col gap-[16px]">
			<h3 className="text-[32px] font-bold text-mws-black">Font Guide</h3>
			<div className="overflow-hidden rounded-[4px] border border-mws-gray-250">
				<div className="grid grid-cols-[280px_1fr_120px_120px_120px] bg-mws-gray-75 px-[32px] py-[18px] text-[15px] font-bold text-mws-black">
					<span>Scale Category</span>
					<span>Typeface</span>
					<span className="text-center">Size</span>
					<span className="text-center">Leading</span>
					<span className="text-center">Spacing</span>
				</div>
				<div className="grid grid-cols-[280px_1fr_120px_120px_120px] bg-mws-gray-50 px-[32px] py-[18px] text-mws-black">
					<span className="text-[28px]">타이틀</span>
					<span className="text-[28px]">Pretendard</span>
					<span className="text-center text-[15px]">28</span>
					<span className="text-center text-[15px]">62</span>
					<span className="text-center text-[15px]">-20</span>
				</div>
				<div className="grid grid-cols-[280px_1fr_120px_120px_120px] bg-mws-white px-[32px] py-[18px] text-mws-black">
					<span className="text-[16px]">일반 폰트</span>
					<span className="text-[16px]">Pretendard</span>
					<span className="text-center text-[15px]">16</span>
					<span className="text-center text-[15px]">23</span>
					<span className="text-center text-[15px]">-20</span>
				</div>
				<div className="grid grid-cols-[280px_1fr_120px_120px_120px] bg-mws-gray-50 px-[32px] py-[18px] text-mws-black">
					<span className="text-[14px]">일반 폰트</span>
					<span className="text-[14px]">Pretendard</span>
					<span className="text-center text-[15px]">14</span>
					<span className="text-center text-[15px]">21</span>
					<span className="text-center text-[15px]">-20</span>
				</div>
				<div className="grid grid-cols-[280px_1fr_120px_120px_120px] bg-mws-white px-[32px] py-[18px] text-mws-black">
					<span className="text-[12px]">최소 폰트</span>
					<span className="text-[12px]">Pretendard</span>
					<span className="text-center text-[15px]">12</span>
					<span className="text-center text-[15px]">18</span>
					<span className="text-center text-[15px]">-20</span>
				</div>
			</div>
		</div>
	</section>
);

const ButtonGuide = () => (
	<section className="flex flex-col gap-[24px]">
		<h2 className="text-[40px] font-bold text-mws-black"># Button Guide</h2>
		<h3 className="text-[24px] font-bold text-mws-black">Button States</h3>
		<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[40px]">
			<div className="grid gap-[24px] lg:grid-cols-4">
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="white" leftIco={btnIcons.buttonIconDefault}>
						전체 통계 보기
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Default</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="white" state="hover" leftIco={btnIcons.buttonIconDefault}>
						전체 통계 보기
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Hover</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="white" state="pressed" leftIco={btnIcons.buttonIconDefault}>
						전체 통계 보기
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Pressed</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="white" disabled leftIco={btnIcons.buttonIconDefault}>
						전체 통계 보기
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Disabled</span>
				</div>
			</div>
			<div className="mt-[30px] grid gap-[24px] lg:grid-cols-4">
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="dark">전체 통계 보기</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Default</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="dark">디자인 가이드입니다</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Hover</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="dark">전체 통계 보기</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Pressed</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="dark" disabled>
						조회
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Disabled</span>
				</div>
			</div>
			<div className="mt-[30px] grid gap-[24px] lg:grid-cols-4">
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="blue">조회</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Default</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="blue" state="hover">
						조회
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Hover</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="blue" state="pressed">
						조회
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Pressed</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<BtnBasic theme="blue" disabled>
						조회
					</BtnBasic>
					<span className="text-[14px] text-mws-ink-600">Disabled</span>
				</div>
			</div>
		</div>

		<div className="flex flex-col gap-[8px]">
			<h3 className="text-[24px] font-bold text-mws-black">40px Button</h3>
			<p className="text-[14px] text-mws-black">좌/우 마진 12px</p>
			<div className="flex flex-wrap gap-[12px] rounded-[4px] bg-mws-gray-75 p-[20px]">
				<BtnBasic theme="dark">전체 통계 보기</BtnBasic>
				<BtnBasic theme="dark">디자인 가이드입니다</BtnBasic>
			</div>
		</div>
	</section>
);

const SelectBoxGuide = () => {
	const [status, setStatus] = useState('option-1');

	return (
		<section className="flex flex-col gap-[20px]">
			<h2 className="text-[40px] font-bold text-mws-black"># Select Box Guide</h2>
			<h3 className="text-[24px] font-bold text-mws-black">Select Box States</h3>
			<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[48px]">
				<div className="grid gap-[20px] lg:grid-cols-6">
					<div className="flex flex-col gap-[10px]">
						<Select placeholder="선택" className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Default</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select placeholder="선택" state="hover" className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Hover</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select placeholder="선택" state="focus" className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Focus</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select
							placeholder="선택"
							state="active"
							className="w-full"
						>
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Active</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select value="option-1" className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Completed</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select value="option-1" disabled className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Disabled</span>
					</div>
				</div>
			</div>
			<h3 className="text-[24px] font-bold text-mws-black">Live Select Examples</h3>
			<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[32px]">
				<div className="grid gap-[20px] lg:grid-cols-3">
					<div className="flex flex-col gap-[10px]">
						<Select
							value={status}
							className="w-full"
							onChange={(next) => setStatus(next)}
							placeholder="상태 선택"
						>
							<li data-value="all">전체</li>
							<li data-value="in-progress">진행중</li>
							<li data-value="done">완료</li>
							<li data-value="hold" data-disabled="true">
								보류
							</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Controlled</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select placeholder="기간 선택" className="w-full">
							<li data-value="today">오늘</li>
							<li data-value="week">이번주</li>
							<li data-value="month">이번달</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Uncontrolled</span>
					</div>
					<div className="flex flex-col gap-[10px]">
						<Select disabled placeholder="비활성 선택" className="w-full">
							<li data-value="option-1">선택항목 1</li>
							<li data-value="option-2">선택항목2</li>
							<li data-value="option-3">선택항목 3</li>
						</Select>
						<span className="text-[14px] text-mws-ink-600">Disabled</span>
					</div>
				</div>
			</div>
		</section>
	);
};

const InputBoxGuide = () => (
	<section className="flex flex-col gap-[20px]">
		<h2 className="text-[40px] font-bold text-mws-black"># Input Box Guide</h2>
		<h3 className="text-[24px] font-bold text-mws-black">Input Box States</h3>
		<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[48px]">
			<div className="grid gap-[20px] lg:grid-cols-6">
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해주세요" />
					<Input placeholder="기간 선택" rightIco={inputIcons.calendar} />
					<span className="text-[14px] text-mws-ink-600">Default</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해주세요" />
					<Input value="2024-04-01" readOnly rightIco={inputIcons.calendar} />
					<span className="text-[14px] text-mws-ink-600">Hover</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해주세요" />
					<Input value="2024-04-01" readOnly rightIco={inputIcons.calendar} />
					<span className="text-[14px] text-mws-ink-600">Focus</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해|" />
					<Input value="2024-04-01" readOnly rightIco={inputIcons.calendarActive} />
					<span className="text-[14px] text-mws-ink-600">Active</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해주세요" />
					<Input value="2024-04-01" readOnly rightIco={inputIcons.calendarActive} />
					<span className="text-[14px] text-mws-ink-600">Completion</span>
				</div>
				<div className="flex flex-col gap-[10px]">
					<Input placeholder="입력해주세요" disabled className={'w-1 h-14'}/>
					<Input value="2024-04-01" readOnly disabled rightIco={inputIcons.calendarDisabled} />
					<span className="text-[14px] text-mws-ink-600">Disabled</span>
				</div>
			</div>
		</div>
	</section>
);

type ComponentGuideProps = {
	checkboxDisabled: boolean;
	onCheckboxDisabledChange: (next: boolean) => void;
};

const ComponentGuide = ({checkboxDisabled, onCheckboxDisabledChange}: ComponentGuideProps) => (
	<section className="flex flex-col gap-[20px]">
		<h2 className="text-[40px] font-bold text-mws-black"># Component Guide</h2>
		<div className="grid gap-[32px] lg:grid-cols-2">
			<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[40px]">
				<h3 className="text-[24px] font-bold text-mws-ink-500">Check box</h3>
				<div className="mt-[20px] flex flex-col gap-[16px]">
					<CheckBox
						checked={checkboxDisabled}
						onChange={(event) => onCheckboxDisabledChange(event.target.checked)}
						label="체크박스 비활성화 토글"
					/>
					<div className="flex items-center gap-[18px]">
						<CheckBox disabled={checkboxDisabled} />
						<CheckBox indeterminate disabled={checkboxDisabled} />
						<CheckBox defaultChecked disabled={checkboxDisabled} />
						<CheckBox defaultChecked disabled />
						<CheckBox disabled />
					</div>
				</div>
			</div>
			<div className="rounded-[4px] border border-mws-gray-250 px-[40px] py-[40px]">
				<h3 className="text-[24px] font-bold text-mws-ink-500">Toggle button</h3>
				<div className="mt-[20px] flex items-center gap-[16px]">
					<BtnToggle defaultChecked />
					<BtnToggle />
				</div>
			</div>
		</div>
	</section>
);

const Preview = () => {
	const [selectedTableRowId, setSelectedTableRowId] = useState<string | null>(null);
	const [checkboxDisabled, setCheckboxDisabled] = useState(false);
	const [theme, setTheme] = useState<ThemeMode>('light');
	const {openModal} = useModal();
	const handleOpenTemplatePopup = () => {
		openModal(({close, zIndex, isTop}) => (
			<TemplateCodePopup onClose={close} zIndex={zIndex} isTop={isTop} />
		));
	};

	useEffect(() => {
		const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
		const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
		const initialTheme = saved ?? (prefersDark ? 'dark' : 'light');
		setTheme(initialTheme);
		applyTheme(initialTheme);
	}, []);

	useEffect(() => {
		applyTheme(theme);
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	return (
		<div className="min-h-screen bg-mws-white text-mws-ink-500">
			<div className="mx-auto flex w-full max-w-[1620px] flex-col gap-[96px] px-[48px] py-[80px]">
				<div className="flex items-center justify-end gap-[8px]">
					<BtnBasic
						theme={theme === 'light' ? 'blue' : 'white'}
						onClick={() => setTheme('light')}
					>
						화이트
					</BtnBasic>
					<BtnBasic
						theme={theme === 'dark' ? 'blue' : 'white'}
						onClick={() => setTheme('dark')}
					>
						다크
					</BtnBasic>
				</div>
				<ColorGuide />
				<FontGuide />
				<ButtonGuide />
				<SelectBoxGuide />
				<InputBoxGuide />
				<section className="flex flex-col gap-[20px]">
					<h2 className="text-[40px] font-bold text-mws-black"># Date Picker</h2>
					<div className="max-w-[360px]">
						<DatePicker />
					</div>
				</section>
				<section className="flex flex-col gap-[20px]">
					<div className="flex items-center justify-between">
						<h2 className="text-[40px] font-bold text-mws-black"># Table</h2>
						<BtnBasic onClick={handleOpenTemplatePopup}>
							템플릿 코드 세팅
						</BtnBasic>
					</div>
					<div className={'h-[700px]'}>
						<TableTemplate
							columns={tableColumns}
							data={tableData.slice(0, 10)}
							// data={tableData}
							rowClassName={(row) => selectedTableRowId === row.id ? tableStyles.rowPressed : undefined}
							onRowClick={(row) => setSelectedTableRowId(row.id)}
						/>
					</div>
					<TableTemplate
						columns={tableColumns}
						headerRowHeight={48}
						data={[]}
						emptyText="등록된 데이터가 없습니다." wrapperHeight={420}
					/>
					<EditableTable
						columns={editableTableColumns}
						data={editableTableData}
						wrapperHeight={320}

						history
					/>
				</section>
				<ComponentGuide
					checkboxDisabled={checkboxDisabled}
					onCheckboxDisabledChange={setCheckboxDisabled}
				/>
			</div>
		</div>
	);
};

export default Preview;
