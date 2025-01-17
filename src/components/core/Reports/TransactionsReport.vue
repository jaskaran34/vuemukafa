<script setup>
import { onMounted } from 'vue';
import axios from 'axios';

const callApi = async () => { 
    try { 
        const url = 'https://c21517app01p01.cloudiax.com/JSouq/api/Jumbo/JsouqPrice'; 
        const obj = {
             'AuthKey': 'SnVtYm9EZXZlbG9wV2lsc29uX0pTb3Vxe92c39f3-2ee4-4204-8726-1bea508cf9e2SW5kdXNXaWxzb25qZWJha3VtYXJfSlNvdXE=' 
            }; 
            let res = await axios.post(url, obj); 
            console.log('Response Data:', res.data); 
        } catch (error) {
             console.error('Error:', error);
             } 
            };
onMounted(async()=>{

await callApi();
 
  
});

</script>
<template>
    Transactions report
</template>