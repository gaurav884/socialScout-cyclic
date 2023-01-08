import React from "react";

import RenderCropper from "./components/cropper/cropper"
export default function App(props) {
	return <RenderCropper

		sendFile={(file) => {
			props.selectedFile(file)
		}}

		close={(close) => {
			props.closeModal(close)
		}}

	/>;
}
