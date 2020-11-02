
import React,{useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './Components/Navbar';
import './App.css';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './Components/StoryScreens/Home';
import Login from './Components/StoryScreens/Signin';
import Profile from './Components/StoryScreens/Profile';
import Signup from './Components/StoryScreens/Signup';
import CreatePost from './Components/StoryScreens/CreatePost';
import {reducer, initialState} from './Reducers/userReducer';
import UserProfile from './Components/StoryScreens/UserProfile';
import SubscribedUserPosts from './Components/StoryScreens/SubscribesUserPosts';
import Reset from './Components/StoryScreens/Reset';
import NewPassword from './Components/StoryScreens/Newpassword';
export const UserContext = createContext();

//  const Routing = () => {
//   const history = useHistory();
//   const {state, dispatch} = useContext(UserContext)
//    useEffect=(()=>{
//       const user= JSON.parse(localStorage.getItem("user"));
      
//       if(user) {
//        dispatch({type:"USER", payload:user})
//         //history.push('/');
//       }else {
//         //if(!history.location.pathname.startsWith('/reset'))
//         history.push('/signin');
//       }

//   },[])

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!history.location.pathname.startsWith('/reset'))
           history.push('/signin')
    }
  },[])


  return (
    <Switch>
  <Route exact path ="/">
      <Home />
    </Route>

    <Route path ="/signin">
      <Login />
    </Route>

    <Route path ="/signup">
      <Signup />
    </Route>

    <Route path ="/myprofile">
    <Profile />
    </Route>
      
    <Route path ="/create">
    <CreatePost />
    </Route>

   <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route> 
    
    </Switch>
  )
}

function StoryApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value = {{state, dispatch}}>
    <BrowserRouter> 
    <NavBar />
    <Routing /> 

    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default StoryApp;
