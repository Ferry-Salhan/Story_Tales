import React, {useContext,useRef,useEffect,useState} from 'react';
import {Link, useHistory } from 'react-router-dom';
import {UserContext} from '../StoryApp';
import M from 'materialize-css'

const NavBar = () => {

   const  searchModal = useRef(null);
     const [search,setSearch] = useState('');
     const [userDetails,setUserDetails] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();

  useEffect(()=>{
     M.Modal.init(searchModal.current)
 },[])

  const renderList = () => {
    if(state){
      return [
      //   <li><b> <i className="material-icons" style ={{color:"#2d8659"}}>person</i></b></li>,
      //   <li><Link to="/myprofile"><b>MyProfile</b></Link></li>,

      //   <li><b> <i className="material-icons" style ={{color:"#2d8659"}}>border_color</i></b></li>,
      //   <li><Link to="/create"><b>Create_Post</b></Link></li>,

      //   <li><b> <i className="material-icons" style ={{color:"#2d8659"}}>assignment_returned</i></b></li>,
      //   <li> <button className="btn waves-effect waves-light #c62828 red darken-3"
      //       onClick={()=>{
      //         localStorage.clear()
      //         dispatch({type:"CLEAR"})
      //         history.push('/signin')
      //       }}
      //       >
      //           Logout
      //       </button>
      //       </li>
      // ]
      <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
            <li key="2"><Link to="/myprofile">Profile</Link></li>,
            <li key="3"><Link to="/create">Create Post</Link></li>,
            <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
            <li  key="5">
             <button className="btn #c62828 red darken-3"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/signin')
            }}
            >
                Logout
            </button>
            </li>
         
            
           ]

    }else {
    // return [
    //   <li><b> <i className="material-icons" style ={{color:"#2d8659"}}>arrow_forward</i></b></li>,
    //    <li><Link to="/signin"><b>Sign-in</b></Link></li>,

    //    <li><b> <i className="material-icons" style ={{color:"#2d8659"}}>arrow_upward</i></b></li>,
    //     <li><Link to="/signup"><b>Sign-up</b></Link></li>
    // ]

    return [
      <li  key="6"><Link to="/signin">Sign-in</Link></li>,
      <li  key="7"><Link to="/signup">Sign-up</Link></li>
     
     ]
   }

  }
  
  const fetchUsers = (query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }


    return (
<nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left" 
      style={{
        paddingLeft:"20px"
      }}><b>
      StoryTales
      </b> 
     
      </Link>
      
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>

    </div>

    <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
        </div>
  </nav>
    );
}

export default NavBar;