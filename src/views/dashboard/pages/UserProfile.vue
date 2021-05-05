<template>
  <v-container id="user-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Cập nhật thông tin</div>

            <div class="subtitle-1 font-weight-light">
              Hoàn thành thông tin của bạn
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    class="purple-input"
                    readonly
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Họ tên"
                    v-model="name"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Mật khẩu"
                    v-model="password"
                    type="password"
                    class="purple-input"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn color="success" class="mr-0" @click="update">
                    Cập nhật
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <!-- <v-col cols="12" md="4">
        <base-material-card
          class="v-card-profile"
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">CEO / CO-FOUNDER</h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              Alec Thompson
            </h4>

            <p class="font-weight-light grey--text">
              Don't be scared of the truth because we need to restart the human
              foundation in truth And I love you like Kanye loves Kanye I love
              Rick Owens’ bed design but the back is...
            </p>

            <v-btn color="success" rounded class="mr-0"> Follow </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      name: "",
      password: "",
      user: {},
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.email = this.user.email;
    this.name = this.user.name;
  },
  methods: {
    update() {
      this.CallAPI(
        "put",
        "users/" + this.user.id,
        {
          name: this.name,
          password: this.password,
        },
        (response) => {
          this.$toast.success("Cập nhật thành công");
          this.getUserList();
          this.close();
        },
        (error) => {
          // this.$toast.success("Đã xảy ra lỗi");
        }
      );
    },
  },
};
</script>
