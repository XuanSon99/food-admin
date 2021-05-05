<template>
  <div class="login">
    <form action="">
      <label for="">Email</label>
      <input type="email" v-model="email" required />
      <label for="">Mật khẩu</label>
      <input type="password" v-model="password" required />
      <button type="submit" @click="login">Đăng nhập</button>
      <router-link tag="a" to="/register">Đăng ký tài khoản?</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.CallAPI(
        "post",
        "auth/login",
        {
          email: this.email,
          password: this.password,
        },
        (res) => {
          if (res.data.data[0].level != "admin") return;
          this.$router.push("/");
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("user", JSON.stringify(res.data.data[0]));
          window.location.reload()
        },
        (error) => {
          this.$toast.error("Tài khoản mật khẩu không đúng");
        }
      );
    },
  },
};
</script>

<style>
.login {
  width: 100%;
  height: 100vh;
  background: url("../assets/login2.jpg") center;
  background-size: cover;
  padding: 25vh 0;
}
.login form {
  margin: 0 auto;
  background: url("../assets/login4.gif") center;
  background-size: cover;
  width: 400px;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 4px 4px 15px 3px #000;
}
.login label {
  display: block;
  color: #fff;
  margin-bottom: 5px;
}
.login input {
  display: block;
  width: 100%;
  height: 40px;
  outline: none;
  box-shadow: 4px 4px 15px 3px rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 0 10px;
  border-radius: 7px;
  margin-bottom: 15px;
  transition: all 300ms ease;
}
.login input:hover,
.login button:hover {
  box-shadow: 4px 4px 15px 3px #000;
}
.login button {
  display: block;
  color: #fff;
  height: 40px;
  width: 120px;
  margin: 0 auto;
  margin-top: 30px;
  border-radius: 7px;
  box-shadow: 4px 4px 15px 3px rgba(0, 0, 0, 0.6);
  outline: none;
  transition: all 300ms ease;
}
.login a {
  display: block;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  text-decoration: none;
  transition: all 300ms ease;
}
.login a:hover {
  color: #fff;
}
</style>