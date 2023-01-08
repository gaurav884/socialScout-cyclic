import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from '../../contexts/UserContext';
import { MdDelete } from "react-icons/md";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdSend } from "react-icons/md";
import { RiCameraOffLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import { BiCommentDots } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { AiOutlineCamera } from "react-icons/ai";
import PropagateLoader from "react-spinners/PropagateLoader";
import { IoClose } from "react-icons/io5";
import Navbar from "../navbar/Navbar"
import LeftSideBar from "../leftSideBar/LeftSideBar"




const Profile = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext)
    const [posts, setPosts] = useState();
    const [userData, setUserData] = useState()
    const [comment, setCommnent] = useState("");
    const commentField = useRef();
    const modalCommentField = useRef();
    const [showPhotos, setShowPhotos] = useState(true);
    const [showPosts, setshowPosts] = useState(false);
    const [isModal, setIsModal] = useState(false)

    const [showFollowers, setShowFollowers] = useState()
    const [showFollowing, setShowFollowing] = useState()

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([])

    const [isPostModal, setIsPostModal] = useState(false);
    const [modalpost, setModalPost] = useState();
    const scrollerDiv = useRef();
    const [ProfilePicModal, setProfilePicModal] = useState(false);
    const [coverPicModal, setCoverPicModal] = useState(false);
    const [modalpostLikes, setModalPostLikes] = useState(false);
    const [modalpostComments, setModalPostComments] = useState(true);
    const [modalpostLiCom, setModalPostLiCom] = useState();





    useEffect(() => {
        fetchposts();

        if (state) {
            fetchposts2()
        }

    }, [state])

    function fetchposts() {
        fetch("/post//view-my-posts", {
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
                    setUserData(data.user);
                    setPosts(data.found)
                }



            }).catch(err => {
                console.log(err);
                history.push("/ERROR500/sadfijsoaidfjosidjfoi34234242423sdfsdf")
            }
            )
        )

    }

    function fetchposts2() {
        fetch(`/user/${state._id}/influence`, {
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
                    setFollowers(data.user.followers)
                    setFollowing(data.user.following)
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
                fetchposts()
                liComInfo(postID)



            }).catch(err => {
                console.log(err);
            })
        })
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
                liComInfo(postId)

            }).catch(err => {
                console.log(err);
            })
        })
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
                window.location.reload();

            }).catch(err =>
                console.log(err)

            )
        )

    }

    function returnPhotosSection() {
        return <div className="profile-photos-container" style={posts.length === 0 ?{display: 'block', marginTop:"0"}:{}}>

            {(posts.length === 0) ? noPosts() : posts.map((each, index) => {
                if (each.photo) {
                    return <div className="profile-photo-wrapper" key={index}>
                        <img onClick={() => {
                            setIsPostModal(true)
                            setModalPost(each)
                        }}
                            src={each.photo}></img>
                    </div>
                }
                else {
                    return null;
                }


            })}
        </div>
    }

    function returnPostsSection() {
        return <>{(posts.length === 0) ? noPosts() : posts.map((each, index) => {
            return <div key={index}>


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
                    <img onClick={() => {
                        setIsPostModal(true)
                        liComInfo(each._id)
                        setModalPost(each)
                    }} className="post-card-img" src={each.photo} />


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

                            <p className="postModal-post-title">{modalpost.title}</p>


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

                            {(modalpostLikes  && modalpostLiCom) ? <div ref={scrollerDiv} className="scrolling-container" id="comments-holder" >
                                {modalpostLiCom.likes.map((eachL, index) => {

                                    return <div className="comment-wrapper" key={index}>
                                        <div className="comment-wrapper-image-container">
                                            <img src={eachL.profilePhoto} />
                                        </div>
                                        <label><Link to={`/${eachL._id}`}>{eachL.name}</Link> </label>

                                    </div>

                                })}

                            </div> : null}





                            {(modalpostComments  && modalpostLiCom) ? <div ref={scrollerDiv} className="scrolling-container" id="comments-holder" >


                                {modalpostLiCom.comments.map((eachC, index) => {

                                    return <div className="comment-wrapper" key={index}>
                                        <div className="comment-wrapper-image-container">
                                            <img src={eachC.postedBy.profilePhoto} />
                                        </div>
                                        <label><Link to={`/${eachC.postedBy._id}`} target="_blank">{eachC.postedBy.name} : </Link> </label>
                                        <p className="postModal-each-comment">{eachC.text}</p>
                                        {eachC.postedBy._id === state._id ? <IoClose className="postModal-delete-comment-button" onClick={() => {

                                            deleteCommment(eachC.text, modalpost._id)

                                        }}
                                        /> :null}
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
                fetchposts()
                liComInfo(postId)


            }).catch(err =>
                console.log(err)

            )
        )

    }


    function returnFollowersSection() {
        
        return <>
            {followers.length===0? noPosts():followers.map((each, index) => {
                return <div className="followers-list-container" key={index}>
                    <div className="followers-profile-img-container">
                        <img src={each.profilePhoto} />
                    </div>
                    <Link to={`/${each._id}`} target="_blank">{each.name}</Link>
                </div>
            })}
        </>
    }
    function returnFollowingSection() {
       return <>
            {following.length===0? noPosts():following.map((each, index) => {
                return <div className="followers-list-container" key={index}>
                    <div className="followers-profile-img-container">
                        <img src={each.profilePhoto} />
                    </div>
                    <Link to={`/${each._id}`} target="_blank">{each.name}</Link>
                </div>
            })}
        </>
    }

    function ProfilePicModalHandler() {
        if (!ProfilePicModal) {
            return null;
        }

        return <div className="coverProfilePicModal-container">
            <div className="coverProfilePicModal-container-img-wrapper">
                <IoClose onClick={() => { setProfilePicModal(false) }} />
                <img src={state.profilePhoto} />
            </div>

        </div>
    }

    function coverPicModalHandler() {
        if (!coverPicModal) {
            return null;
        }

        return <div className="coverProfilePicModal-container">
            <div className="coverProfilePicModal-container-img-wrapper">
                <IoClose onClick={() => { setCoverPicModal(false) }} />
                <img src={state.coverPhoto} />

            </div>
        </div>
    }


    if (posts == undefined) {
        return <div className="Loader"><PropagateLoader /></div>
    }

    function noPosts() {
        return <div className="nothing-to-show-container">
            <p>Nothing to show</p>
            <div className="nothing-to-show-svg-container">
                <RiCameraOffLine />
            </div>
        </div>
    }

    return (
        <>
            <Navbar />
            <div className="layout-container">
                {(state) ? <LeftSideBar /> : null}
            </div>
            {coverPicModalHandler()}
            {ProfilePicModalHandler()}
            {postModal()}

            <div className="cover-photo-container">
                <img className="cover-photo" src={state.coverPhoto} onClick={() => { setCoverPicModal(true) }} />
                <Link to="/change-cover-picture"><AiOutlineCamera /></Link>

                <div className="profile-img-reference">
                    <div className="profile-img-wrapper">
                        <img src={state.profilePhoto} onClick={() => { setProfilePicModal(true) }} />

                    </div>
                    <Link to="/change-profile-picture"><AiOutlineCamera /></Link>

                </div>
            </div>



            <div className="profile-container">

                <div className="profile-info-container">

                    <div className="profile-details-container">
                        <p>{userData.name}</p>
                        <div className="profile-details-container-spans">
                            <span class={showPhotos?"tabActive":""} onClick={() => {
                                setShowPhotos(true)
                                setshowPosts(false)
                                setShowFollowing(false)
                                setShowFollowers(false)
                            }}>Gallery</span>

                            <span class={showPosts?"tabActive":""} onClick={() => {
                                setShowPhotos(false)
                                setshowPosts(true)
                                setShowFollowing(false)
                                setShowFollowers(false)
                            }}>({posts.length}) Posts</span>
                            <span class={showFollowers?"tabActive":""} onClick={() => {
                                setShowPhotos(false)
                                setshowPosts(false)
                                setShowFollowing(false)
                                setShowFollowers(true)
                            }} > ({userData.followers.length}) Followers</span>
                            <span class={showFollowing?"tabActive":""} onClick={() => {
                                setShowPhotos(false)
                                setshowPosts(false)
                                setShowFollowing(true)
                                setShowFollowers(false)
                            }} >({userData.following.length}) Following</span>

                        </div>
                    </div>
                </div>

                {showPhotos ? returnPhotosSection() : null}

                {showPosts ? returnPostsSection() : null}

                {showFollowers ? returnFollowersSection() : null}

                {showFollowing ? returnFollowingSection() : null}


            </div>
        </>
    )
}

export default Profile
