import React from "react";
import "./cropper.css";

import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";


import getCroppedImg, { generateDownload } from "../../utils/cropImage";
import { IconButton, makeStyles } from "@material-ui/core";
import { SnackbarContext } from "../snackbar/snackbar";
import { dataURLtoFile } from "../../utils/dataURLtoFile";

import { MdClear } from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { FiUpload } from 'react-icons/fi';
import { FaCamera } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';






const useStyles = makeStyles({
	iconButton: {
		position: "absolute",
		top: "20px",
		right: "20px",
	},
	cancelIcon: {
		color: "#00a3c8",
		fontSize: "50px",
		"&:hover": {
			color: "red",
		},
	},
});

export default function RenderCropper(props) {
	const classes = useStyles();

	const inputRef = React.useRef();

	const triggerFileSelectPopup = () => inputRef.current.click();

	const setStateSnackbarContext = React.useContext(SnackbarContext);

	const [image, setImage] = React.useState(null);
	const [croppedArea, setCroppedArea] = React.useState(null);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);

	const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
		setCroppedArea(croppedAreaPixels);
	};

	const onSelectFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				setImage(reader.result);
			});
		}
	};


	const onClear = () => {
		if (!image)
			return setStateSnackbarContext(
				true,
				"select an image!",
				"warning"
			);

		setImage(null);
	};

	const onUpload = async () => {
		if (!image)
			return setStateSnackbarContext(
				true,
				"select an image!",
				"warning"
			);

		const canvas = await getCroppedImg(image, croppedArea);
		const canvasDataUrl = canvas.toDataURL("image/jpeg");
		const convertedUrlToFile = dataURLtoFile(
			canvasDataUrl,
			"cropped-image.jpeg"
		);
		props.sendFile(convertedUrlToFile)
	};

	return (
		<div className="change-pic-container">
            
			<div className="change-pic-middle-container">
			<div className="change-pic-heading">
				<AiOutlineCloseCircle onClick={()=>{
					props.close(`close`);
				}}/>
			</div>
				<div className='container-cropper-wrapper'>


					<div className='container-cropper'>
						{image ? (
							<>
								<div className='cropper'>
									<Cropper
										image={image}
										crop={crop}
										zoom={zoom}
										aspect={1}
										onCropChange={setCrop}
										onZoomChange={setZoom}
										onCropComplete={onCropComplete}
									/>
								</div>

								<div className='slider'>
									<Slider
										min={1}
										max={3}
										step={0.1}
										value={zoom}
										onChange={(e, zoom) => setZoom(zoom)}
										color='secondary'
									/>
								</div>
							</>
						) : <div className="select-img-container" onClick={triggerFileSelectPopup} >

							<div className='select-img-wrapper'>
								<FaCamera />
							</div>
							<p>Please Select an image</p>

						</div>}
					</div>


				</div>
				<div className='container-buttons'>
					<input
						type='file'
						accept='image/*'
						ref={inputRef}
						onChange={onSelectFile}
						style={{ display: "none" }}
					/>

					<button className='MdClear' onClick={() => onClear()} title="Remove Image">
						<MdClear title="Close"/>
					</button>

					<button className='CgBrowser' onClick={triggerFileSelectPopup} title="Browse Image">
						<CgBrowser />
					</button>


					<button className='FiUpload' onClick={onUpload} title="Upload">
						<FiUpload />
					</button>

				</div>
			</div>
		</div>
	);
}
