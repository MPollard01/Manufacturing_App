<template>
  <div class="page">
    <div class="wrapper">
      <el-card shadow="hover" class="box-card">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">Sign in</h2>
          </div>
        </template>
        <div class="card-body">
          <el-form status-icon label-width="10px">
            <el-form-item>
              <label for="">Email</label>
              <input type="text" v-model="email.value" :ref="email.ref">
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
              <el-button type="primary" class="login" @click="submit">Login</el-button>
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
  name: "Login",
  setup() {
    const { useField, handleSubmit } = useForm({
      defaultValues: {},
    });
    const email = useField("email", {
      rule: { required: true },
    });
    const password = useField("password", {
      rule: { required: true },
    });

    const loading = ref(false);
    const errorLogin = ref("");

    const router = useRouter();

    const submit = async () => {
      loading.value = true;
      errorLogin.value = validation.login(email.value, password.value);

      const info = {
        email: email.value,
        password: password.value,
      };

      if (!errorLogin.value) {
        const { user, error } = await authenticationService.login(info);

        loading.value = false;

        if (error) {
          errorLogin.value = error;
          ElMessage.error({
            type: "error",
            message: errorLogin.value,
            duration: 8000,
          });
        } else if (user) {
          router.replace({ name: "Lines" });
        }
      } else {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      errorLogin,
      submit: handleSubmit(submit),
    };
  },
};
</script>

<style scoped>
  .login {
    width: 70%;
  }

  .card-title {
    margin: 0;
    padding: 0;
  }

</style>
