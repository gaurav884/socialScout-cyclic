import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import App from "../ImageCrop/App -cover";


import RenderSnackbar from "../ImageCrop/components/snackbar/snackbar";
import SimpleBackdrop from "../ImageCrop/components/backdrop/backdrop";


const ChangeCoverPic = () => {
    const { state, dispatch } = useContext(UserContext)
    const [photo, setPhoto] = useState("");
    const [url, setUrl] = useState()
    const history = useHistory();



    useEffect(() => {
        if (url) {
            changePic()
        }
    }, [url])

    useEffect(() => {
        if (photo) {
            uploadPic()
        }
    }, [photo])


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
                    setUrl(data.url)




                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })

    }

    function changePic() {

        fetch("/change-cover", {

            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                newUrl: url
            })
        }).then(res =>
            res.json().then(data => {

                localStorage.setItem("user", JSON.stringify(data));
                dispatch({ type: "USER", payload: data })
                history.push("/profile")

            }).catch(err => {
                console.log(err)
                history.push("/ERROR500/sadfijsoaidfjosidjfoi34234242423sdfsdf")
            }
            )
        )

    }

    return (
        <div>

            <RenderSnackbar>
                <SimpleBackdrop>
                    <App
                        selectedFile={(file) => {

                            setPhoto(file)


                        }}

                        closeModal={(close) => {
                            history.push("/profile")
                        }}
                    />
                </SimpleBackdrop>
            </RenderSnackbar>

        </div>
    )
}

export default ChangeCoverPic
