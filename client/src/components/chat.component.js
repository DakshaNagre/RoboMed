import Moment from 'react-moment';
import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/UserList.css';
import ChatWindow from './chatwindow.component'
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { ChatkitProvider, TokenProvider, withChatkitOneToOne } from '@pusher/chatkit-client-react';
import axios from 'axios';
import { withRouter,useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';

const instanceLocator = 'v1:us1:fefd0754-abd6-4428-b293-de2be225fffa';

const tokenProvider = new TokenProvider({
//   url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/fefd0754-abd6-4428-b293-de2be225fffa/token',
url:'/authChat'
});

export function Chat(props){
    // const urlParams = new URLSearchParams(window.location.search);
    // const userId = urlParams.get('userId');
    // const otherUserId = urlParams.get('otherUserId');
    const [cookies, setCookie] = useCookies(['userName','userData','userProfile']);
    // const userId=cookies['userData']['data']['id']
    // const otherUserId=props.match.params.userId
    const [userId, setUserId] = React.useState(cookies['userData']['data']['id'])
    const [otherUserId, setOtherUserId] = React.useState(props.match.params.userId)
    useEffect(() => {
        // console.log(props.match.params.userId)
        setOtherUserId(props.match.params.userId)
    },[props.match.params.userId])
    return (
        <div className="App">
          {userId && otherUserId ? (
            <>
              <div className="App__chatwindow">
                <ChatkitProvider
                  instanceLocator={instanceLocator}
                  tokenProvider={tokenProvider}
                  userId={userId}
                >
                  <UserList userId={userId} 
                    picture={cookies['userProfile']['picture']} 
                    userName={cookies['userData']['data']["firstName"]
                  +" "+cookies['userData']['data']["lastName"]} 
                  otherUserId={otherUserId}
                  setOtherUserId={setOtherUserId}/>
                  <ChatWindow otherUserId={otherUserId} />
                </ChatkitProvider>
              </div>
            </>
          ) : ("")}
          {/* <div className="App__backdrop">
            <img
              className="App__backdrop__logo"
              src={chatkitLogo}
              alt="Chatkit logo"
            />
          </div> */}
        </div>
      );
}

export function UserList({ userId,userName,picture,otherUserId,setOtherUserId }) {
    const [userList, setUserList] = React.useState([])
    let history = useHistory();

    useEffect(() => {
        axios.post('/getUserRooms',{userId:userId}).then(res => {
            console.log(res["data"])
            setUserList(res['data'])
            })
          .catch((error)=>{
              console.error(error)
          })
    }, [])
    const switchChat=(user)=>{
        // window.location.href ='/dashboard/chat/'+user
        if(user!=otherUserId)
            {
                setOtherUserId("")
            }
        history.push('/dashboard/chat/'+user)
    }
    return (
      <div className="UserList">
        <div className="UserList__titlebar">
        <Avatar src={picture} className="Chat__titlebar__avatar">
          </Avatar>          
          <span className="UserList__titlebar__logged-in-as">{userName}</span>
        </div>
        <div className="UserList__container">
            <ul className="UserList__container__list">

            {userList.map((user, i) =>            
            <li key={user['id']} className="UserList__container__list__item" 
                onClick={()=>switchChat(user["member_user_ids"].filter(i=>i!=userId)[0])}>
              <div>
              <AccountCircleIcon className="UserList__container__list__item__avatar" />
              </div>
              <div className="UserList__container__list__item__content">
                <p className="UserList__container__list__item__content__name">
                  {user['name'].split('&').filter(item => !item.includes(userName))}
                </p>
                {/* <div className="UserList__container__list__item__time">
                    {user['updated_at']}
                </div> */}
              </div>
            </li>
            )} 

            {/* <li className="UserList__container__list__item">
              <div>
              <AccountCircleIcon className="UserList__container__list__item__avatar" />
              </div>
              <div className="UserList__container__list__item__content">
                <p className="UserList__container__list__item__content__name">
                  Alice Andrews
                </p>
              </div>
            </li>
            <li className="UserList__container__list__item">
              <div>
              <AccountCircleIcon className="UserList__container__list__item__avatar" />
              </div>
              <div className="UserList__container__list__item__content">
                <p className="UserList__container__list__item__content__name">
                  Joe Bloggs
                </p>
              </div>
            </li>
            <li className="UserList__container__list__item">
              <div>
              <AccountCircleIcon className="UserList__container__list__item__avatar" />
              </div>
              <div className="UserList__container__list__item__content">
                <p className="UserList__container__list__item__content__name">
                  Jane Smith
                </p>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    );
  }