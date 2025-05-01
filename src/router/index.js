// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

// Import views
import userLogin from '@/components/auth/userLogin.vue';
import Dashboard from '@/components/core/DashBoard.vue';
import IssuePoints from '@/components/core/IssuePoints.vue';
import RedumptionCase from '@/components/core/RedumptionCase.vue';
import CancelReturn from '@/components/core/CancelReturn.vue';

import orderCancel from '@/components/core/orderCancel.vue';

import AddPurchase from  '@/components/core/addPurchase.vue';

import CancellationReport from '@/components/core/Reports/CancellationReport.vue';
import RefundsReport from '@/components/core/Reports/RefundsReport.vue';
import SettlementsReport from '@/components/core/Reports/SettlementsReport.vue';
import TransactionsReport from '@/components/core/Reports/TransactionsReport.vue';

import AddStaff from '@/components/core/settings/AddStaff.vue';
import BankAccounts from '@/components/core/settings/BankAccounts.vue';
import AddMember from '@/components/core/settings/AddMember.vue';
import VerifyMobile from '@/components/core/settings/verify_mobile.vue';

import alertSettings from '@/components/core/settings/alertSettings.vue';

import RefundSetting from '@/components/core/settings/RefundSetting.vue';

import cancelCompleted from '@/components/core/cancelCompleted.vue';

import ProfileUser from '@/components/auth/ProfileUser.vue';
import TemporaryReload from '@/components/design/TemporaryReload.vue';


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'userLogin', component: userLogin },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/issue_points', name: 'issue_points', component: IssuePoints, meta: { requiresAuth: true } },
  { path: '/addPurchase', name: 'addPurchase', component: AddPurchase, meta: { requiresAuth: true } },

  { path: '/alertSettings', name: 'alertSettings', component: alertSettings, meta: { requiresAuth: true } },
  { path: '/RefundSetting', name: 'RefundSetting', component: RefundSetting, meta: { requiresAuth: true } },

  
  { path: '/redumption', name: 'redumption', component: RedumptionCase, meta: { requiresAuth: true } },
  { path: '/return', name: 'return', component: CancelReturn, meta: { requiresAuth: true } },
  { path: '/order_cancel', name: 'order_cancel', component: orderCancel, meta: { requiresAuth: true } },


  { path: '/report_transactions', name: 'report_transactions', component: TransactionsReport, meta: { requiresAuth: true } },
  { path: '/report_settle', name: 'report_settle', component: SettlementsReport, meta: { requiresAuth: true } },
  { path: '/report_refunds', name: 'report_refunds', component: RefundsReport, meta: { requiresAuth: true } },
  { path: '/report_cancel', name: 'report_cancel', component: CancellationReport, meta: { requiresAuth: true } },


  { path: '/settings_addstaff', name: 'settings_addstaff', component: AddStaff, meta: { requiresAuth: true } },
  { path: '/settings_bankaccounts', name: 'settings_bankaccounts', component: BankAccounts, meta: { requiresAuth: true } },

  { path: '/profile', name: 'profile', component: ProfileUser, meta: { requiresAuth: true } },

  { path: '/settings_addmember', name: 'settings_addmember', component: AddMember, meta: { requiresAuth: true } },

  { path: '/verify_mobile', name: 'verify_mobile', component: VerifyMobile, meta: { requiresAuth: true } },

  { path: '/cancel_completed', name: 'cancel_completed', component: cancelCompleted, meta: { requiresAuth: true } },

  { path: '/reload', name: 'reload', component: TemporaryReload },
  /*
  { path: '/reload/:routeName',name: 'reload',
    component: {render() {return null; // Empty component
      },
    },
    beforeEnter: (to, from, next) => {
      const targetRoute = { name: to.params.routeName }; // Only redirect by name
      next(targetRoute); // Redirect to the target route
    },
  },
  */
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  
 // console.log(to);
  const authStore = useAuthStore(); 
  
  let isAuthenticated = authStore.isAuthenticated; 

  if(to.fullPath=='/login' && isAuthenticated){
       next({ name: 'Dashboard' });
    return
  }
 

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if the user is not authenticated
    
    next({ name: 'userLogin' });
  } else {
    next(); // Allow navigation to the requested route
  }
});

export default router;
