<template>
  <div class="page">
    <div class="wrapper">
      <el-card shadow="hover" class="box-card">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">Register</h2>
          </div>
        </template>
        <div>
          <el-form status-icon label-width="10px">
            <el-form-item>
              <label for="">Username</label>
              <input v-model="username.value" :ref="username.ref">
              <span class="error" v-if="username.error">{{
                username.error.message
              }}</span>
            </el-form-item>
            <el-form-item>
              <label for="">Email</label>
              <input v-model="email.value" :ref="email.ref">
              <span class="error" v-if="email.error">{{
                email.error.message
              }}</span>
            </el-form-item>
            <el-form-item>
              <label for="">Password</label>
              <input type="password" v-model="password.value" :ref="password.ref">
              <span class="error" v-if="password.error">{{
                password.error.message
              }}</span>
            </el-form-item>
            <el-form-item>
              <label for="">Confirm Password</label>
              <input
                type="password"
                v-model="confirmPassword.value"
                :ref="confirmPassword.ref"
              >
              <span class="error" v-if="confirmPassword.error">{{
                confirmPassword.error.message
              }}</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="register" @click="register"
                >Register</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import validation from "@/utils/Validation";
import authenticationService from "@/services/AuthenticationService";
import { ElMessage } from "element-plus";
import { useForm } from "vue-hooks-form";

export default {
  name: "Register",
  setup() {
    const { useField, handleSubmit } = useForm({
      defaultValues: {},
    });
    const email = useField("email", {
      rule: { required: true },
    });
    const username = useField("username", {
      rule: { required: true },
    });
    const password = useField("password", {
      rule: { required: true, min: 6 },
    });
    const confirmPassword = useField("confirm password", {
      rule: {
        required: true,
        asyncValidator: async (rule, value) =>
          new Promise((resolve, reject) => {
            if (value !== password.value) {
              return reject(new Error("Passwords must match!"));
            }
            return resolve();
          }),
      },
    });

    const loading = ref(false);
    const errorRegistration = ref(null);

    const router = useRouter();

    const register = async () => {
      errorRegistration.value = validation.continueRegister(
        email.value,
        password.value,
        confirmPassword.value
      );
      const info = {
        email: email.value,
        password: password.value,
        username: username.value,
      };

      if (!errorRegistration.value) {
        const { user, error } = await authenticationService.register(info);

        loading.value = false;

        if (error) {
          errorRegistration.value = error;
          ElMessage.error({
            type: "error",
            message: errorRegistration.value,
            duration: 5000,
          });
        } else if (user) {
          router.replace({
            name: "Lines",
            params: {
              user,
            },
          });
        }
      } else {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      username,
      loading,
      errorRegistration,
      register: handleSubmit(register),
    };
  },
};
</script>

<style scoped>
  .register {
    width: 70%;
  }

  .card-title {
    margin: 0;
    padding: 0;
  }

  .box-card {
    margin-bottom: 30px;
  }
</style>
