//libs
import type { AppProps } from "next/app";

//components
import Navbar from "@/components/Navbar";

//styles
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<div>
			<Navbar />
			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
