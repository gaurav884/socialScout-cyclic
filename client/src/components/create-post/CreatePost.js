import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { AiOutlineCamera } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import App from "../ImageCrop/App";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import RenderSnackbar from "../ImageCrop/components/snackbar/snackbar";
import SimpleBackdrop from "../ImageCrop/components/backdrop/backdrop";


const CreatePost = (props) => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");
    const [url, setUrl] = useState();
    const [photoPrev, setPhotoPrev] = useState();
    const [uploadPhotoModal, setUploadPhotoModal] = useState(false);

    useEffect(() => {
        if (photo) {
            // createPostHandler();
            uploadPic()
        }


    }, [photo])


    const notify = () => toast.error('Please enter a title or a Photo', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    function uploadPic() {
        const data = new FormData();
        data.append("file", photo)
        data.append("upload_preset", "social-photos")
        data.append("cloud_name", "dxuwjnsg5")

        fetch("https://api.cloudinary.com/v1_1/dxuwjnsg5/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => {
                res.json().then(data => {
                    if (data.error) {
                        console.log(data.error)
                    }
        
                    setPhotoPrev(data.url)
                    setUrl(data.url)




                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })

    }


    function createPostHandler() {

        fetch("/post/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify({
                title: title,
                photo: url
            })
        }).then(res => {
            res.json().then(data => {
                if (data.error) {
                    notify()
                }
                else {
           
                    window.location.reload();
                }

            }).catch(err => {
                console.log(err)
            })
        })

    }



    return <>
        
            <ToastContainer/>     

        {(uploadPhotoModal) ? <RenderSnackbar>
            <SimpleBackdrop>
                <App
                    selectedFile={(file) => {

                        setPhoto(file)
                        setUploadPhotoModal(false)

                    }}

                    closeModal={() => {
                        setUploadPhotoModal(false)
                    }}
                />
            </SimpleBackdrop>
        </RenderSnackbar> : null}

        <div className="create-post-container">
            <input
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
                type="text"
                className="create-post-title"
                placeholder="Whats on your mind ?" />

            <div className="preview-photo-container">

                {photoPrev ? <>
                    <ImCancelCircle onClick={() => {
                        setUrl()
                        setPhotoPrev()
                    }} />
                    <img className="photo-preview" src={photoPrev} /> </> : null}

            </div>
            <div className="post-file-container">

                <label onClick={() => {


                    setUploadPhotoModal(true)

                }} className="file-label"><AiOutlineCamera /></label>

                <button
                    type="submit"
                    onClick={() => {
                        createPostHandler()

                    }
                    }
                    className="create-post-submit">Post</button>
            </div>


        </div>
    </>


}

export default CreatePost
