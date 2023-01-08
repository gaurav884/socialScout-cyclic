import React, { useEffect, useState, useContext, useRef } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import { MdDelete } from "react-icons/md";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import { ImQuotesLeft } from "react-icons/im";
import { MdPhotoCamera } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";
import CreatePost from "../create-post/CreatePost"
import { BiCommentDots } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import PropagateLoader from "react-spinners/PropagateLoader";
import { RiCameraOffLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import Navbar from "../navbar/Navbar"
import LeftSideBar from "../leftSideBar/LeftSideBar"
import RightSideBar from "../rightSideBar/RightSideBar"





const Home = () => {
    const history = useHistory();
    const { state } = useContext(UserContext)
    const [posts, setPosts] = useState([]);
    const [comment, setCommnent] = useState("");
    const [isPostModal, setIsPostModal] = useState(false);
    const [modalpost, setModalPost] = useState();
    const [modalpostLiCom, setModalPostLiCom] = useState();
    const [modalpostLikes, setModalPostLikes] = useState(false);
    const [modalpostComments, setModalPostComments] = useState(true);
    const [isModal, setIsModal] = useState(false)
    const scrollerDiv = useRef();


    const commentField = useRef();
    const modalCommentField = useRef();

    useEffect(() => {
        fetchPosts();

    }, [])


    function fetchPosts() {
        fetch("/post/view-all-posts", {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res =>
            res.json().then(data => {
                if (data.error) {
                    console.log(data.error);
                    history.push("/ERROR500/sadfijsoaidfjosidjfoi34234242423sdfsdf")
                }
                else {
                    setPosts(data)
                    console.log(data)
                }
            }).catch(err => {
                console.log(err)
                history.push("/ERROR500/sadfijsoaidfjosidjfoi34234242423sdfsdf")
            }
            )
        )

    }

    function liComInfo(postID) {
        fetch(`/post/li-com-info/${postID}`, {
            method: 'GET',
            headers: {
                'contentType': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {
            res.json().then(data => {
                setModalPostLiCom(data.post)

            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    function likeDisLikePost(postID, what) {
        fetch(`./post/${what}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postID
            })
        }).then(res => {
            res.json().then(data => {
                setModalPost(data)

                const newPosts = posts.map(each => {
                    if (each._id === data._id) {

                        return data
                    }
                    else {
                        return each
                    }

                })
                setPosts(newPosts)
                fetchPosts()
                liComInfo(postID)



            }).catch(err => {
                console.log(err);
            })
        })
    }



    function makeComment(text, postId) {


        fetch("./post/comment", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => {
            res.json().then(data => {
                setCommnent("")
                setModalPost(data)
                const newPosts = posts.map(each => {

                    if (each._id === data._id) {
                        return data
                    }
                    else {
                        return each
                    }
                })
                setPosts(newPosts)
                fetchPosts()
                liComInfo(postId)


            }).catch(err => {
                console.log(err);
            })
        })
    }

    function deleteCommment(text, postId) {

        fetch(`./post/delete-comment/${postId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res =>
            res.json().then(data => {

                setModalPost(data)
                fetchPosts();
                liComInfo(postId)

            }).catch(err =>
                console.log(err)

            )
        )

    }



    function likeOrDislike(each) {


        if (each.likes.includes(state._id)) {
            return <button className="post-card-like-button" onClick={() => {
                likeDisLikePost(each._id, "dislike")

            }} ><AiFillDislike /></button>
        }
        else {

            return <button className="post-card-like-button" onClick={() => {
                likeDisLikePost(each._id, "like")

            }} ><AiFillLike /></button>


        }
    }


    function deletePost(postId) {

        fetch(`./post/delete/${postId}`, {
            method: 'delete',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res =>
            res.json().then(data => {


                const newData = posts.filter((each) => {
                    return data._id != each._id
                })
                setPosts(newData)

            }).catch(err =>
                console.log(err)

            )
        )

    }

    function postModal() {
        if (modalpost && isPostModal) {
            liComInfo(modalpost._id)
            return <>
                <div className="postModal-container">
                    <div className="postModal-image-info-container">
                        <div className="post-modal-cancel-button">
                            <GrClose onClick={() => {
                                setIsPostModal(false)
                                setModalPost()
                            }} />
                        </div>
                        {(modalpost.photo) ? <div className="postModal-image">
                            <img src={modalpost.photo} />
                        </div> : null}


                        <div className="postModal-info-container">


                            <div className="name-photo-container">
                                <div className="postModal-postedby-photo-container"><img src={modalpost.postedBy.profilePhoto} /></div>
                                <label className="postModal-post-by"><Link to={(state.id === modalpost.postedBy._id) ? `./profile` : `/${modalpost.postedBy._id}`}>{modalpost.postedBy.name}</Link></label>

                                {(state._id === modalpost.postedBy._id) ? <div className="postModal-delete-post-button" onClick={() => setIsModal(modalpost._id)}><button  ><MdDelete /></button> </div> : null}
                            </div>

                            {modalpost.title && <p className="postModal-post-title">{modalpost.title}</p>}


                            <div className="post-modal-li-com-toggle-container">
                                <button className={(modalpostLikes) ? "postModal-comments-heading active-li-com" : "postModal-comments-heading"} onClick={() => {
                                    setModalPostComments(false)
                                    setModalPostLikes(true)
                                }}>Likes</button>

                                <button className={(modalpostComments) ? "postModal-comments-heading active-li-com" : "postModal-comments-heading"} onClick={() => {
                                    setModalPostComments(true)
                                    setModalPostLikes(false)
                                }}>Comments</button>

                            </div>

                            {(modalpostLikes && modalpostLiCom) ? <div ref={scrollerDiv} className="scrolling-container" id="comments-holder" >
                                {modalpostLiCom.likes.map((eachL, index) => {

                                    return <div className="comment-wrapper" key={index}>
                                        <div className="comment-wrapper-image-container">
                                            <img src={eachL.profilePhoto} />
                                        </div>
                                        <label><Link to={`/${eachL._id}`}>{eachL.name}</Link> </label>

                                    </div>

                                })}

                            </div> : null}





                            {(modalpostComments && modalpostLiCom) ? <div ref={scrollerDiv} className="scrolling-container" id="comments-holder" >


                                {modalpostLiCom.comments.map((eachC, index) => {

                                    return <div className="comment-wrapper" key={index}>
                                        <div className="comment-wrapper-image-container">
                                            <img src={eachC.postedBy.profilePhoto} />
                                        </div>
                                        <label><Link to={`/${eachC.postedBy._id}`} target="_blank">{eachC.postedBy.name} </Link> </label>
                                        <p className="postModal-each-comment">{eachC.text}</p>

                                        {eachC.postedBy._id === state._id ? <IoClose className="postModal-delete-comment-button" onClick={() => {

                                            deleteCommment(eachC.text, modalpost._id)

                                        }}
                                        /> : null}
                                    </div>

                                })
                                }


                            </div> : null}

                            <div className="postModal-li-com-container">
                                {likeOrDislike(modalpost)}
                                <span className="postModal-likes-number">{modalpost.likes.length} Likes</span>
                                <span> <BiCommentDots /></span>
                                <label className="postModal-likes-number">{modalpost.comments.length} Comments</label>

                            </div>
                            <div className="postModal-comment-section">
                                <input ref={modalCommentField} type="text" className="postModal-comment-input" placeholder="add you comment here" value={comment} onChange={(e) => setCommnent(e.target.value)} />

                                {(/\S/.test(comment)) ? <button className="postModal-comment-button" onClick={() => {

                                    makeComment(modalCommentField.current.value, modalpost._id);
                                }}><MdSend /></button> : null}

                            </div>


                        </div>

                    </div>

                </div>
            </>
        }
        else {
            return null;
        }
    }


    function noPosts() {
        return <div className="nothing-to-show-container">
            <p>Nothing to show</p>
            <div className="nothing-to-show-svg-container">
                <RiCameraOffLine />
            </div>
        </div>
    }



    if (posts == undefined) {
        return <div className="Loader"><PropagateLoader /></div>
    }


    return (
        <>

            <Navbar />
            <div className="layout-container">
                {(state) ? <LeftSideBar /> : null}

            </div>
            {postModal()}
            <div className="createPost-header">
                <div className="createPost-header-containers">
                    <ImQuotesLeft className=" cp-one" />
                    <p>Share an update</p>
                </div>
                <div className="createPost-header-containers ">
                    <MdPhotoCamera className=" cp-two " />
                    <p>Upload a photo</p>
                </div>

                <div className="createPost-header-containers ">
                    <RiShareForwardFill className=" cp-three" />
                    <p>Share a Post</p>
                </div>
            </div>
            <CreatePost
            />

            {(posts.length === 0) ? noPosts() : posts.map((each, index) => {

                return <div className="home-container" key={index}>

                    {isModal ? <div className="modal-background">

                        <div className="modal-container">
                            <h4>Delete Post </h4>

                            <button className="modal-cancel" onClick={() => {
                                setIsModal(false)
                            }}><ImCancelCircle /></button>

                            <p>Are you sure you want to delete this post ?</p>
                            <div className="modal-buttons">
                                <button onClick={() => {
                                    deletePost(each._id)
                                    setIsModal(false)
                                }}
                                >Yes</button>
                                <button onClick={() => {
                                    setIsModal(false)
                                }}
                                >No</button>
                            </div>
                        </div>

                    </div> : null}
                    <div className="post-card" key={index}>



                        <div className="postedby-photo-container"><img src={each.postedBy.profilePhoto} /></div>

                        <p className="post-card-by"><Link to={(state.id === each.postedBy._id) ? `./profile` : `/${each.postedBy._id}`}>{each.postedBy.name}</Link></p>


                        <p className="post-card-title">{each.title}</p>
                        {(state._id === each.postedBy._id) ? <button className="delete-post-button" onClick={() => setIsModal(true)}><MdDelete /></button> : null}
                        {each.photo && <div className="post-card-img-container">
                            <img onClick={() => {
                                setIsPostModal(true)
                                liComInfo(each._id)
                                setModalPost(each)
                            }} className="post-card-img" src={each.photo} />
                        </div>}


                        <div className="li-com-container">
                            {likeOrDislike(each)}
                            <span className="likes-number" onClick={() => {
                                setModalPostComments(false)
                                setModalPostLikes(true)
                                setIsPostModal(true)
                                setModalPost(each)
                            }}>{each.likes.length} Likes</span>
                            <span> <BiCommentDots /></span>
                            <label className="likes-number" onClick={() => {
                                setModalPostComments(true)
                                setModalPostLikes(false)
                                setIsPostModal(true)
                                setModalPost(each)
                            }}>{each.comments.length} Comments</label>
                        </div>


                        <div className="comment-section">
                            <input ref={commentField} type="text" className="comment-input" placeholder="add you comment here" value={comment} onChange={(e) => setCommnent(e.target.value)} />

                            {(/\S/.test(comment)) ? <button className="comment-button" onClick={() => {

                                if (commentField.current) {

                                    (makeComment(commentField.current.value, each._id));

                                }


                            }}><MdSend /></button> : null}

                        </div>

                    </div>
                </div>

            })}



        </>
    )
}

export default Home
