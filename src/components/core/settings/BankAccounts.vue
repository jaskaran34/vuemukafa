<script setup>
  import { reactive,onMounted } from 'vue'
  
import login_code from '@/composables/auth.js';
const { get_bank_account_settings,set_bank_account_settings } = login_code();


import {  useRoute,useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();


  import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();
  
  const form = reactive({
    account_title: '',
    bank: '',
    branch_name: '',
    account_number: '',
    iban: ''
  })
  
  onMounted(async()=>{

if (authStore.token) {
 
    try {
    const response = await get_bank_account_settings();
    const data = response.data
    form.account_title = data.account_title
    form.bank = data.bank
    form.branch_name = data.branch_name
    form.account_number = data.account_number
    form.iban = data.iban
  } catch (error) {
    console.error('Error fetching settings:', error)
  }
} else {
  //console.log('22');
  router.push({name: 'userLogin'});
}
 
  
});

  const submitForm = async () => {
    try {
      await set_bank_account_settings(form);
      await reloadRoute();
    } catch (error) {
      alert('Failed to save bank settings.')
    }
  }

  const reloadRoute = async() => {
   const currentRoute = { name: route.name, query: route.query, params: route.params, };
    router.push({ name: 'reload', query: { targetRoute: JSON.stringify(currentRoute) } }); 
  };
  </script>
  
  <template>
    <div class="container mt-5">
      <h2 class="mb-4">Bank Account Settings</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Account Title</label>
          <input v-model="form.account_title" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Bank</label>
          <input v-model="form.bank" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Branch Name</label>
          <input v-model="form.branch_name" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Account Number</label>
          <input v-model="form.account_number" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">IBAN</label>
          <input v-model="form.iban" type="text" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>
  </template>
  
  