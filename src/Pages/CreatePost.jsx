import React, { useEffect, useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import { db,auth } from '../components/FireBase-config';
import { useNavigate } from 'react-router-dom';


const CreatePost = ({isAuth}) => {
  const [title,setTitle]=useState("")
  const [postText, setPostText]=useState("");

  const postsCollectionRef=collection(db, "Posts")
  let navigate=useNavigate()

  const createPost=async()=>{
        await addDoc(postsCollectionRef,{title,postText, author:{name:auth.currentUser.displayName , id:auth.currentUser.uid }})
        navigate("/")
  }
  useEffect(()=>{
    if(!isAuth){
      navigate("/login")
    }
  })
  return (
    <div className="createPostPage">
      <div className='cpContainer'>
        <h1>Create A post</h1>
     
      <div className='inputGp'>
        <label htmlFor="">Title:</label>
        <input type="text" placeholder='Title..' onChange={(e)=>{
          setTitle(e.target.value)
        }}/>
      </div>
      <div className="inputGp">
        <label htmlFor="">Post:</label>
        <textarea name=""  cols="20" rows="10" placeholder='Post...' onChange={(e)=>{
          setPostText(e.target.value)
        }}></textarea>
      </div>
      <button onClick={createPost}>Submit Post</button> 
      </div>
    </div>
  )
}

export default CreatePost
