import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../components/FireBase-config";
import { MdDelete, MdSave, MdEdit } from "react-icons/md";

const Home = ({ isAuth }) => {
  const [postLists, setPostList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState({ title: "", postText: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const postsCollectionRef = collection(db, "Posts");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Authentication check is complete
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, []); // Add a missing dependency array to avoid infinite useEffect loop

  // Editing functions
  const startEdit = (post) => {
    setEditMode(post.id);
    setEditContent({ title: post.title, postText: post.postText });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditContent({ title: "", postText: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditContent((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    const postDoc = doc(db, "Posts", id);
    await updateDoc(postDoc, editContent);
    setPostList(
      postLists.map((post) => (post.id === id ? { ...post, ...editContent } : post))
    );
    setEditMode(null);
  };

  // Deleting function
  const deletePost = async (id) => {
    const postDoc = doc(db, "Posts", id);
    await deleteDoc(postDoc);
    setPostList(postLists.filter((post) => post.id !== id));
  };

  // Show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homePage">
      {postLists.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                {editMode === post.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editContent.title}
                    onChange={handleEditChange}
                  />
                ) : (
                  <h1>{post.title}</h1>
                )}
              </div>
              <div className="postActions">
                {isAuth && user && post.author.id === user.uid && (
                  <>
                    {editMode === post.id ? (
                      <>
                        <button onClick={() => saveEdit(post.id)}>
                          <MdSave size={20} color="brown"/>
                        </button>
                        <button onClick={cancelEdit} >Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => deletePost(post.id)}>
                          <MdDelete size={20} color="red"/>
                        </button>
                        <button onClick={() => startEdit(post)}>
                          <MdEdit size={20} color="blue" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="postTextContainer">
              {editMode === post.id ? (
                <textarea
                  name="postText"
                  value={editContent.postText}
                  onChange={handleEditChange}
                />
              ) : (
                post.postText
              )}
            </div>
            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
