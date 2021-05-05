<template>
  <div class="signup">
    <form action="">
      <label for="">Họ tên</label>
      <input type="text" v-model="name" required />
      <label for="">Email</label>
      <input type="email" v-model="email" required />
      <label for="">Mật khẩu</label>
      <input type="password" v-model="password" required />
      <label for="">Xác nhận mật khẩu</label>
      <input type="password" v-model="repassword" required />
      <button type="submit" @click="login">Đăng ký</button>
      <router-link tag="a" to="/login">Đăng nhập ngay?</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      name: "",
      repassword: "",
    };
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.CallAPI(
        "post",
        "auth/signup",
        {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.repassword,
          level: "reader",
        },
        (res) => {
          this.$toast.success("Đăng ký thành công");
        }
      );
    },
  },
};
</script>

<style>
.signup {
  width: 100%;
  height: 100vh;
  background: url("../assets/login2.jpg") center;
  background-size: cover;
  padding: 7vh 0;
}
.signup form {
  margin: 0 auto;
  background: url("../assets/login5.gif") center;
  background-size: cover;
  width: 400px;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 4px 4px 15px 3px #000;
}
.signup label {
  display: block;
  color: #fff;
  margin-bottom: 5px;
}
.signup input {
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
.signup input:hover,
.signup button:hover {
  box-shadow: 4px 4px 15px 3px #000;
}
.signup button {
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
.signup a{
  display: block;
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  text-decoration: none;
  transition: all 300ms ease;
}
.signup a:hover{
  color: #fff;
}
</style>