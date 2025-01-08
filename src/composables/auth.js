
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';


export default function login_code(){

    const router = useRouter();
    const authStore = useAuthStore();


    const updateuser = async(user)=>{

      console.log(user);

      let url =`${authStore.baseURL}/partner`;

        let res = await axios.put(url,user,{
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

    const login = async (email,password) => {

        let url =`${authStore.baseURL}/partner/login`;
        
        const param={
            email,
            password
        }
        //console.log();
        try {
        let res = await axios.post(url,param)
        let token=res.data.token;
        localStorage.setItem('token',token);
        authStore.token=token;
      
       
        await router.push({name: 'Dashboard'});
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
        updateuser
      };
}