
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
        order_id:order_no,
        integration_id:setstaffid
      }

      //console.log(obj);
      //console.log(url);
      let res = await axios.post(url,obj,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      if(res.status==201){
        
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
        order_id:order_no,
        integration_id:setstaffid
    }
   
    let res = await axios.post(url,obj,{
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    if(res.status==201){
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

    const verify_otp_backend= async (message_id,mukafa_no,request_type,otp) => {

      try {
        let url = `${authStore.baseURL}/partner/verify_otp/${message_id}/${mukafa_no}/${request_type}/${otp}`;
      
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
      // console.log(res.data);
        if (res.status === 200) {
         
          return res.data.message;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    
    };

    const sendotp = async (message_id,mukafa_no,request_type) => {
    
      try {
        let url = `${authStore.baseURL}/partner/otp/${message_id}/${mukafa_no}/${request_type}`;
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    
        if (res.status === 200) {
       //   console.log(res);
          return res.data;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    };

    

const all_members= async(pageurl = null,params)=>{

  if (pageurl && pageurl.includes('http://dev-mukafa.js.qa/api/en-us/v1')) {
    pageurl = pageurl.replace('http://dev-mukafa.js.qa/api/en-us/v1', authStore.baseURL);
  }
  let baseUrl =`${authStore.baseURL}/partner/member/get/all`;
  const url = pageurl ||`${baseUrl}?${params.toString()}`;
  //let url =`${authStore.baseURL}/partner/member/get/all`;
  //console.log(url);

  let res = await axios.get(url,{
    headers: {
      Authorization: `Bearer ${authStore.token}`
    }
  });
  //console.log(res.data);

  if(res.status==200){
   // console.log(res.data);
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

    const cancel_transaction = async (id, data) => {
      try {
        const url = `${authStore.baseURL}/partner/transactions/${id}`;
        
        const res = await axios.delete(url, {
          data: data,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        console.log(res);
    
        if (res.status === 200) {
          return res.data; // Successful response
        } else {
          throw new Error('Unexpected status: ' + res.status);
        }
      } catch (error) {
        if (error.response) {
          // Throw the error message from the backend or fallback to a default message
          throw new Error(error.response.data?.Error || 'Request failed with status ' + error.response.status);
        } else {
          // Throw the general error message if no response exists (e.g., network error)
          throw new Error(error.message || 'Network error');
        }
      }
    };
    
    
    const alltransactions= async (pageurl = null,params) =>{
      try {
        //console.log(params.toString());
        let baseUrl =`${authStore.baseURL}/partner/transactions`;
        if(pageurl){
          //console.log(url);console.log(params);
        }
        const url = pageurl ||`${baseUrl}?${params.toString()}`;
       // console.log(url);
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    

        if (res.status === 200) {
         
          //console.log(res);
          return res;
        } else {
          throw new Error('Failed to find member');
        }
      } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Network error');
      }
    }



    const allorders= async (pageurl = null,params) =>{
      try {
        //console.log(params.toString());
        let baseUrl =`${authStore.baseURL}/partner/orders`;
        if(pageurl){
          //console.log(url);console.log(params);
        }
        const url = pageurl ||`${baseUrl}?${params.toString()}`;
       // console.log(url);
        let res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
    

        if (res.status === 200) {
         
          //console.log(res);
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
            "name":member.member_name,
            "phone":member.member_phone,
            "phone_prefix":member.member_countryCode,
            "partner_id":authStore.user.id.toString(),
            "birthday":member.member_dob,
            "anniversary_date":member.member_ad
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

    
    const member_status_update = async (mukafa_no,active) => {

      let   url =`${authStore.baseURL}/partner/member_status_update`;

      try {
        let res = await axios.post(url,{mukafa_no,active},{
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
  
console.log(res.data);

        
        }
        catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
          }
    }
    const cancel_completed_transaction = async (tran) => {

     // console.log(tran);
     let   url =`${authStore.baseURL}/partner/cancel_completed_transaction`;
      try {
        let res = await axios.post(url,tran,{
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
  

          console.log(res.data);

        
        }
        catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
          }


    }
    const findtransaction= async (tranid) => {

      let url =`${authStore.baseURL}/partner/findtransaction/${tranid}`;
      let res = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      return res.data
    }
    const search_member= async (phone,phone_prefix) => {

      let url =`${authStore.baseURL}/partner/findmember/${phone}/${phone_prefix}`;

      
      let res = await axios.get(url,{
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        

       return res.data

        

    }
    
    const dashboard_info= async () => {

      let url =`${authStore.baseURL}/partner/dashboard/info`;

      
      let res = await axios.get(url,{
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        
       //console.log(res.data)


       return res.data

        

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
        search_member,
        member_tran_history,
        
        
        alltransactions,
        allorders,
        cancel_transaction,

        register_member,
        all_members,
        sendotp,
        verify_otp_backend,
        dashboard_info,
        findtransaction,
        cancel_completed_transaction,
        member_status_update
      };
}