import {useState} from 'react';
import LoginInput from '@/shared/ui/inputs/LoginInput/LoginInput';
import styles from './Login.module.scss';

const maskGroup = 'https://www.figma.com/api/mcp/asset/a8e1a373-1654-4fc9-8e39-54a9b5d8f72f';
const emailIcon = 'https://www.figma.com/api/mcp/asset/489c10ad-0797-4a4e-81a2-4f702e5dcb33';
const lockIcon = 'https://www.figma.com/api/mcp/asset/da40065c-5ad7-4586-aba3-a16495490abd';
const eyeIcon = 'https://www.figma.com/api/mcp/asset/3638dea4-7fc0-4e81-89a9-b8b3cb6eebfb';
const sigmaLogo = 'https://www.figma.com/api/mcp/asset/96ad26cd-11af-4c7f-b74a-032d76217bfe';
const badgeLogo = 'https://www.figma.com/api/mcp/asset/1b009c62-cbf3-4997-a0b4-9c11b975ee3c';

const Login = () => {
	const [email, setEmail] = useState('movements@gmail.com');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	return (
		<div className={styles.page}>
			<div className={styles.shell}>
				<div
					className={styles.leftPanel}
					style={{ backgroundImage: `url(${maskGroup})` }}
				>
					<div className={styles.brandTop}>
						<img alt="SIGMA" className={styles.brandLogo} src={sigmaLogo} />
					</div>
					<div className={styles.leftContent}>
						<div className={styles.badge}>
							<img alt="SIGMA" className={styles.badgeLogo} src={badgeLogo} />
						</div>
						<div className={styles.leftText}>
							<p className={styles.leftTitle}>언제 어디서나 한눈에 확인</p>
							<p className={styles.leftSubtitle}>
								공공 측량도 스마트하게 처리할 시간입니다
							</p>
						</div>
					</div>
				</div>
				<div className={styles.rightPanel}>
					<div className={styles.form}>
						<p className={styles.title}>환영합니다!</p>
						<div className={styles.inputGroup}>
							<LoginInput
								value={email}
								placeholder="ID를 입력해주세요"
								leftIcon={emailIcon}
								onChange={setEmail}
							/>
							<LoginInput
								value={password}
								placeholder="비밀번호를 입력해주세요"
								leftIcon={lockIcon}
								rightIcon={eyeIcon}
								type={isPasswordVisible ? 'text' : 'password'}
								onRightIconClick={() =>
									setIsPasswordVisible((prev) => !prev)
								}
								onChange={setPassword}
							/>
						</div>
						<div className={styles.divider} />
						<button className={styles.button} type="button">
							로그인
						</button>
					</div>
					<p className={styles.copy}>
						Copyright 2024. Movements All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
