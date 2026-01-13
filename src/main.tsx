import { createRoot } from 'react-dom/client'
import setupLocatorUI from '@locator/runtime'
import './index.css'
import App from "./pages/App";
import {StrictMode} from "react";
import ModalProvider from './app/providers/ModalProvider';

if (import.meta.env.MODE === 'development') {
		setupLocatorUI({
				projectPath: "/Users/hwang-il-yong/Documents/dev/r%26d/react-19",
				templateOrTemplateId: "idea://open?file=${projectPath}${filePath}&line=${line}&column=${column}",
		});
}

createRoot(document.getElementById('root')!).render(
		<StrictMode>
				<ModalProvider>
						<App />
				</ModalProvider>
		</StrictMode>
);
