//libs
import type { AppProps } from "next/app";

//components
import Header from "@/components/Navbar";

//styles
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div>
			<Header />
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
