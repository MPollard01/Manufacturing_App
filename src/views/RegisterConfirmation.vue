<template>
  <div class="page">
    <div class="wrapper">
        <el-card shadow="never">
      <h1>Thank you for registering!</h1>
      <p class="mg-none">To continue, please verify your account by</p>
      <p class="mg-none">
        clicking the link in the email we just sent you before logging in.
      </p>
      <div class="bar"></div>
      <div v-if="user">
        <p class="mg-none mg-top-4rem">Haven't received an email?</p>
        <p class="mg-none">
          Please check your spam or click the button below to have another email
          sent to you...
        </p>
        <el-button @click="sendEmail" type="primary">Send again</el-button>
      </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import firebase from "firebase";

export default {
  name: "RegisterConfirmation",
  props: {
    user: {
      type: Object,
    },
  },
  setup() {
    const email = ref("");
    const password = ref("");

    async function sendEmail() {
      var domain = "https://" + firebase.remoteConfig().app.options.authDomain;

      var actionCodeSettings = {
        url: domain + "/login",
      };

      await this.user
        .sendEmailVerification(actionCodeSettings)
        .then(function() {
          // Email sent.
          alert("Email sent");
        })
        .catch(function(error) {
          // An error happened.
          alert(error);
        });
    }

    return { email, password, sendEmail };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>