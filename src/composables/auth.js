
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';


export default function login_code(){

    const router = useRouter();
    const authStore = useAuthStore();


    const getsuperadminstaff= async()=>{
      try{
      let url =`${authStore.baseURL}/partner/super/staff`;
      let res = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      
      if(res.status==200){
        return res.data;
      }
      else{
        return "Error";
      }
    }catch(error){
      
      return "Error";
    }
      
    }

    const redeempoints= async(order_amt,order_no,memberuid,carduid)=>{
      try{
        let setstaffid;
                if(authStore.user_type=='P'){
  
                 let getstaffid= await getsuperadminstaff();
                 if(getstaffid=='Error'){
                  throw new Error('No Superadmin Staff Added');
                 }
                 setstaffid=getstaffid.id;
                }

        let url =`${authStore.baseURL}/partner/cards/${carduid}/${memberuid}/transactions/points/redeem`;
        let pts= parseInt(order_amt)* 100;
      let  obj={
        points:pts,
          note:order_no,
          staffId:setstaffid
      }
      let res = await axios.post(url,obj,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      if(res.status==200){
        console.log(res);
        return res.data;
      }
      else{
        throw new Error('Error to Add Transaction');
      }
    }catch (error) {
      if (error.response?.status === 422) {
        // Extract validation error messages
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(', ');
        throw new Error(errorMessages || 'Validation error occurred');
      }
      if (error.response?.status === 404) {
        // Extract validation error messages
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(', ');
        throw new Error(errorMessages || 'Validation error occurred');
      }
      throw new Error(error?.response?.data?.message || error.message || 'Network error');
    }
  
  
    }
    const addtransaction = async(order_amt,order_no,memberuid,carduid)=>{

      try{
      let setstaffid;
              if(authStore.user_type=='P'){

               let getstaffid= await getsuperadminstaff();
               if(getstaffid=='Error'){
                throw new Error('No Superadmin Staff Added');
               }
               setstaffid=getstaffid.id;
              }

      let url =`${authStore.baseURL}/partner/cards/${carduid}/${memberuid}/transactions/purchases`;
    let  obj={
        purchase_amount:order_amt,
        note:order_no,
        staffId:setstaffid
    }
    //console.log(url);
    //console.log(obj);
    let res = await axios.post(url,obj,{
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    if(res.status==200){
      return res.data;
    }
    else{
      throw new Error('Error to Add Transaction');
    }
  }catch (error) {
    if (error.response?.status === 422) {
      // Extract validation error messages
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(', ');
      throw new Error(errorMessages || 'Validation error occurred');
    }
    if (error.response?.status === 404) {
      // Extract validation error messages
      const validationErrors = error.response.data.errors;
      const errorMessages = Object.values(validationErrors).flat().join(', ');
      throw new Error(errorMessages || 'Validation error occurred');
    }
    throw new Error(error?.response?.data?.message || error.message || 'Network error');
  }


    }


    const findmember = async (memberuid) => {
      try {
        let url = `${authStore.baseURL}/partner/member/${memberuid}`;
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    
        if (res.status === 200) {
          return res.data;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    };
    

    const member_tran_history = async (memberuid) => {
      try {
        let url = `${authStore.baseURL}/partner/transaction/member/${memberuid}`;
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    
        if (res.status === 200) {
         //console.log(res.data);
          return res.data.data;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    };


const all_members= async()=>{
  let url =`${authStore.baseURL}/partner/member/get/all`;

  let res = await axios.get(url,{
    headers: {
      Authorization: `Bearer ${authStore.token}`
    }
  });

  if(res.status==200){
    return res.data;
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

try{

let obj={
        "name":user.staffname,
        "email":user.staffemail,
        "password":user.staffpassword,
        "staff_type":user.stafftype
      }

if(obj.staff_type=="1"){
let getstaffid= await getsuperadminstaff();

if(getstaffid!="Error"){

  throw new Error('Superadmin Staff Already exist. Email: '+ getstaffid.email);
}
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
          else{
            throw new Error('Error:'+ res.status);
          }

        
        }
        catch(error){
          throw new Error(error?.response?.data?.message || error.message || 'Network error');
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

    const cancel_transaction = async (id,remarks) => {
      try {
        const url = `${authStore.baseURL}/partner/transactions/${id}`;
        const res = await axios.delete(url, {
          data: {
            remarks: remarks, 
          },
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        console.log(res);
    
        if (res.status === 200) {
        return res.data;
        }
        
      } catch (error) {
        console.error('Error cancelling transaction:', error.response?.data || error.message);
      }
    };
    
    const alltransactions= async (pageurl = null,params) =>{
      try {
        let baseUrl =`${authStore.baseURL}/partner/transactions`;
        if(pageurl){
          //console.log(url);console.log(params);
        }
        const url = pageurl ||`${baseUrl}?${params.toString()}`;
     
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    

        if (res.status === 200) {
         
          return res;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    }

    const register_member= async(member)=>{
      let url =`${authStore.baseURL}/member/register`;

     let obj={
            "email":member.member_email,
            "password":member.member_password,
            "name":member.member_name,
            "phone":member.member_phone,
            "phone_prefix":member.member_countryCode,
            "partner_id":authStore.user.id.toString()
              }

     
      let res = await axios.post(url,obj,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      if(res.status==201){
        alert('Success');
   return res.data;
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
        findmember,
        addtransaction,
        redeempoints,
        member_tran_history,
        alltransactions,
        cancel_transaction,
        register_member,
        all_members
      };
}