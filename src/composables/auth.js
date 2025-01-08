
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';


export default function login_code(){

    const router = useRouter();
    const authStore = useAuthStore();

    const findmember = async(memberuid)=>{

      let url =`${authStore.baseURL}/partner/member/${memberuid}`;
      let res = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      if(res.status==200){
        return res.data.member;
      }

    }


    const getstaff = async()=>{
      let url =`${authStore.baseURL}/partner/staff`;

        let res = await axios.get(url,{
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          });

          if(res.status==200){
            return res.data;
          }
    }
    

    const Partner_Add_Staff =async(user)=>{
//console.log(user);
let obj={
        "name":user.staffname,
        "email":user.staffemail,
        "password":user.staffpassword,
        "staff_type":user.stafftype
      }

      let url =`${authStore.baseURL}/partner/register/staff`;

        let res = await axios.post(url,obj,{
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          });

          if(res.status==201){
          
          alert('Staff Added');
          }
    }
    

    const updateuser = async(user)=>{

      let obj={
        "name":user.profilename,
        "email":user.profileemail,
        "phone":user.profilephone,
        "profilephone_prefix":user.profilephone_prefix
      }

      let url =`${authStore.baseURL}/partner`;

        let res = await axios.put(url,obj,{
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          });

          if(res.status==200){
          await getUser(authStore.token);
          alert('updated');
          }
          //console.log(res);
    }


    const returnUser = async()=>{
      //console.log(authStore.token);
      await getUser(authStore.token);
      let user=authStore.user;
      return user;
    }

    const logoutUser= async ()=>{

      let url =`${authStore.baseURL}/partner/logout`;
      
      //console.log(authStore.token);
      
      try {
      let res = await axios.post(url,{},{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      
     // console.log(res);
      
      if(res.status==200){
       await authStore.logout();
        await router.push({name: 'userLogin'});
      }
      else{
        console.log('Error Response code='+ res.status);
      }

      
      }
      catch (error) {

          console.error("error:", error);
        //await  authStore.logout();
        //await router.push({name: 'userLogin'});
         
      }

      
        
    }

    const getUser= async (token) =>{
        let url =`${authStore.baseURL}/partner`;

        let res = await axios.get(url,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          authStore.user=res.data;

          
          


    }

    const login = async (email,password,login_type) => {

      let url;
      if(login_type=='P'){
        url =`${authStore.baseURL}/partner/login`;
      }
      if(login_type=='S'){
        url =`${authStore.baseURL}/staff/login`;
      }
        
        const param={
            email,
            password
        }
        //console.log();
        try {
        let res = await axios.post(url,param);
        if(res.status==200){
          let token=res.data.token;
          localStorage.setItem('token',token);
          authStore.token=token;
          authStore.user_type=login_type;
         
          await router.push({name: 'Dashboard'});
         
        }
        else{
          throw new Error('Api Error and Status Code: '+ res.status);
        }
        }
        catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
          }

    }
   

    return {
        login,
        logoutUser,
        returnUser,
        updateuser,
        Partner_Add_Staff,
        getstaff,
        findmember
      };
}