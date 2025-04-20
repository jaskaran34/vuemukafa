<script setup>
import { ref, onMounted } from 'vue';
import Papa from 'papaparse';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore'; // your pinia store

const authStore = useAuthStore();

const customerData = ref([]);
const partnerId = '248216521760768'; // fixed partner id
const uploadStatus = ref([]); // status of each upload

const loadCustomerCSV = async () => {
  try {
    const response = await fetch('/customern.csv');
    const csvText = await response.text();

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        customerData.value = result.data.map((row) => {
          let phoneRaw = row.mobile_number?.trim() || '';
          let phonePrefix = row['country code']?.trim() || '';
          let phoneNumber = phoneRaw;

          // 📌 If phone starts with 974, correct it
          if (phoneRaw.startsWith('974')) {
            phonePrefix = '+974';
            phoneNumber = phoneRaw.slice(3);
          }

          // 📌 Always add '+' if missing in prefix
          if (phonePrefix && !phonePrefix.startsWith('+')) {
            phonePrefix = `+${phonePrefix}`;
          }

          const mappedRow = {
            email: row.email?.trim() || '',
            name: row.name?.trim() || '',
            phone: phoneNumber,
            phone_prefix: phonePrefix,
            partner_id: partnerId,
            birthday: fixDate(row.dob),
            anniversary_date: fixDate(row.wed_anniversary_date),
            meta: {
              'id_entry':'jaskaran',  
              customer_id: row.customer_id,
              created_at: row.created_at
            }
          };
          return mappedRow;
        }).filter((row) => {
          if (!row.email || !row.phone || !row.phone_prefix || !row.name || !row.birthday) {
            return false;
          }
          if (!isValidDate(row.birthday)) {
            return false;
          }
          if (row.anniversary_date && !isValidDate(row.anniversary_date)) {
            return false;
          }
          return true;
        });

        console.log('✅ Valid customerData:', customerData.value);

        await sendCustomersToApi(customerData.value);
      },
      error: (error) => {
        console.error('❌ Error parsing CSV:', error);
      }
    });
  } catch (error) {
    console.error('❌ Error loading CSV:', error);
  }
};

const sendCustomersToApi = async (customers) => {
  for (let i = 0; i < customers.length; i++) {
    const member = customers[i];
    try {
      const url = `${authStore.baseURL}/member/register`;

      const obj = {
        email: member.email,
        name: member.name,
        phone: member.phone,
        phone_prefix: member.phone_prefix,
        partner_id: member.partner_id,
        birthday: member.birthday,
        anniversary_date: member.anniversary_date,
        meta: member.meta
      };

      const res = await axios.post(url, obj, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      console.log('✅ Success for:', member.email, res.data);

      

      // 🔥 Remove from customerData after success
      customerData.value.splice(i, 1);
      i--; // ⚡ Adjust the loop because we removed an item

    } catch (error) {
      console.error('❌ Failed for:', member.email, error.response?.data || error.message);

      let message = 'Unknown error';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(', ');
      }

      uploadStatus.value.push({
        email: member.email,
        status: 'Failed ❌',
        message
      });
      // ❌ Keep the failed record in customerData
    }
  }
};


// Convert date to yyyy-mm-dd if possible
const fixDate = (dateStr) => {
  if (!dateStr) return null;

  const cleaned = dateStr.trim();

  const ymdPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (ymdPattern.test(cleaned)) {
    return cleaned;
  }

  const dmyPattern = /^\d{2}-\d{2}-\d{4}$/;
  if (dmyPattern.test(cleaned)) {
    const [day, month, year] = cleaned.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null; // invalid date
};

// Validate date string
const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

onMounted(() => {
  loadCustomerCSV();
});
</script>

<template>
  <div class="container">
    <h2>Upload Status</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Email</th>
          <th>Status</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(status, index) in uploadStatus" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ status.email }}</td>
          <td>{{ status.status }}</td>
          <td>{{ status.message }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
.table {
  width: 100%;
}
</style>
