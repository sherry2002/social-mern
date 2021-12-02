/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import './messenger.css';
import { useContext, useEffect, useRef, useState } from "react";
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/conversation';
import Message from '../../components/message/message';
import ChatOnline from '../../components/chatonline/chatOnline';
import { AuthContext } from '../../redux/AuthContext'
import axios from 'axios';
import { io } from 'socket.io-client'

function messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const scrollRef = useRef();
    const socket = useRef();
    const { user } = useContext(AuthContext);

    console.log(arrivalMessage)
    console.log(currentChat)

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })

    }, [arrivalMessage,messages])
   

    useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id)

        socket.current.on("getUsers", (users) => {
            setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId === f)))
        })
    }, [user])

    // useEffect(() => {
    //     socket?.on("welcome",message=>{
    //         console.log(message)
    //     })
    // }, [socket])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        }
        const recieverId = currentChat.members.find(member => member !== user._id)

        socket.current.emit("sendMessage", {
            senderId: user._id,
            recieverId,
            text: newMessage,
        });

       

        try {
            const res = await axios.post("/messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })

    }, [messages, newMessage])


    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id)
                setConversations(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getConversation();
    }, [user._id])

    useEffect( async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (err) {
                console.log(err)
            }

        }
    , [currentChat])


    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="messageLeft">
                    <div className="chatLeft">
                        <input type="text" placeholder="Search for chat" className="chatSearch" />
                        {conversations.map((c) => {
                            return <div key={c._id} onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={user} />
                            </div>
                        })}
                    </div>
                </div>
                <div className="messageMiddle">
                    <div className="chatMiddle">
                        {
                            currentChat ?
                                <>
                                    <div className='chatTop'>
                                        {messages.map(m => {
                                            return <div key={m._id} ref={scrollRef}>
                                                <Message message={m} own={m.sender === user._id} />
                                            </div>
                                        })}
                                    </div>
                                    <form className='chatbottom' onSubmit={handleSubmit}>
                                        <textarea className="chatInput" placeholder="write your message"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        >
                                        </textarea>
                                        <button type="submit" className="sendChat" disabled={!newMessage}>Send</button>
                                    </form></>
                                : <span className="noConversation">Open a chat to start conversation</span>
                        }

                    </div>
                </div>
                <div className="messageRight">
                    <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                </div>
            </div>
        </>
    )
}

export default messenger
