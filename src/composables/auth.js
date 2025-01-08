
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';


export default function login_code(){

    const router = useRouter();
    
    
    const authStore = useAuthStore();

   
    const returnUser = async()=>{
      //console.log(authStore.token);
      await getUser(authStore.token);
      let user=authStore.user;
      return user;
    }

    const logoutUser= async ()=>{
        authStore.logout();
        await router.push({name: 'userLogin'});
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
        returnUser
      };
}