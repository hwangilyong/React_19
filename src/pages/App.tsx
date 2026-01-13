import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {useAppStore} from "../app/store/useAppStore.ts";
import useGlobalStore from "@/app/store/useGlobalStore.ts";
import Preview from "@/pages/preview/Preview.tsx";
import Login from "@/pages/auth/Login";

const  App = () => {
	const count = useAppStore((state) => state.count)
	const increment = useAppStore((state) => state.increment)
	const [value, setValue] = useGlobalStore('TEST');

	return (
		<BrowserRouter>
			<div id={'wrap'}>
				<Routes>
					<Route path="/" element={<Navigate to="/preview" replace />} />
					<Route path="/preview" element={<Preview />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
