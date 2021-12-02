import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../redux/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import OutsideClickHandler from "react-outside-click-handler";
import EditPost from "../editPost/EditPost";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [postToggle, setPostToggle] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [edit,setEdit] = useState()
 
 
  const handleEdit = async() => {
    setEditPost(!editPost);
    try{
      const res = await axios.get(`/posts/${post._id}`);
      setEdit(res.data)
    }catch(err){
      console.log(err)
    }
    setPostToggle(!postToggle);
  };

  const handleDelete = async () => {
    const userId = currentUser._id;

    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        userId: userId,
      });

      let requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`/posts/${post._id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
        window.location.reload();
      // let deletePost = await axios.delete(`/posts/${post._id}`,  userId);
      // console.log(deletePost);
    } catch (err) {
      console.log(err);
    }

    setPostToggle(!postToggle);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <OutsideClickHandler onOutsideClick={() => setPostToggle(false)}>
              <IconButton onClick={() => setPostToggle(!postToggle)}>
                <MoreVert />
              </IconButton>
              {postToggle && (
                <div className="postOption">
                  <EditIcon className="editIcon"onClick={handleEdit} />
                  <DeleteIcon className="deleteIcon" onClick={handleDelete} />
                </div>
              )}
            </OutsideClickHandler>
          </div>
        </div>
        {editPost && 
            <div className="editpost">
              <div className="overlay"></div>
              <div className="updatePost">
            <OutsideClickHandler onOutsideClick={() => setEditPost(false)}>
              <EditPost  setEdit={setEdit} edit={edit}  editPost={editPost}  setEditPost={setEditPost} />
            </OutsideClickHandler>
            </div>
            </div>
        }
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.image} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
