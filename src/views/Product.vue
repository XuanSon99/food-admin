<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      icon="mdi-account-check"
      title="Tác giả"
      class="px-5 py-3"
    >
      <!-- update: sort-desc -->
      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        :search="search"
        dark
      >
        <template v-slot:item.image="{ item }">
          <v-img
            :src="image(item.image)"
            :alt="item.name"
            height="60px"
            width="60px"
            style="object-fit: cover"
          ></v-img>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Thêm mới
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Sản phẩm"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.price"
                          label="Giá"
                          type="number"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.time"
                          label="Thời gian"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          :items="cateList"
                          v-model="editedItem.cate_id"
                          label="Danh mục"
                          item-text="name"
                          item-value="id"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <input
                          id="image"
                          type="file"
                          @change="inputImage($event)"
                          style="display: none"
                        />
                        <label for="image"
                          ><span>Chọn ảnh</span>
                          <v-icon color="success"> mdi-camera </v-icon></label
                        >
                      </v-col>
                      <v-col cols="12">
                        <v-img
                          :src="url ? url : image(editedItem.image)"
                          height="100px"
                          width="100px"
                          style="object-fit: cover"
                        ></v-img>
                      </v-col>
                    </v-row>
                    <v-alert type="warning" dense border="left" v-if="error">
                      {{ error }}
                    </v-alert>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  Bạn có chắc chắn muốn xóa?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Hủy
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    Xóa
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Mã",
        align: "start",
        value: "id",
      },
      { text: "Tên sản mục", value: "name" },
      { text: "Danh mục", value: "category.name" },
      { text: "Ảnh", value: "image" },
      { text: "Giá", value: "price" },
      { text: "Thời gian", value: "time" },
      {
        text: "Hành động",
        value: "actions",
        sortable: false,
      },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      image: "",
      price: "",
      time: "",
      cate_id: "",
    },
    defaultItem: {
      name: "",
      image: "",
      price: "",
      time: "",
      cate_id: "",
    },
    show: false,
    error: "",
    url: "",
    srcImg: "",
    cateList: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm mới" : "Sửa";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getList();
    this.CallAPI("get", "categories", {}, (response) => {
      this.cateList = response.data;
    });
  },

  methods: {
    inputImage(event) {
      this.srcImg = event.target.files[0];
      this.url = URL.createObjectURL(this.srcImg);
    },
    getList() {
      this.desserts = [];
      this.CallAPI("get", "products", {}, (response) => {
        this.desserts = response.data;
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB");
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
      this.CallAPI(
        "delete",
        "products/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getList();
        },
        (error) => {
          this.$toast.error("Tác giả này đang được sử dụng");
        }
      );
    },

    close() {
      this.error = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (
        !this.editedItem.name ||
        !this.srcImg ||
        !this.editedItem.cate_id ||
        !this.editedItem.price ||
        !this.editedItem.time
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      const data = new FormData();
      data.append("image", this.srcImg);
      data.append("name", this.editedItem.name);
      data.append("cate_id", this.editedItem.cate_id);
      data.append("price", this.editedItem.price);
      data.append("time", this.editedItem.time);

      if (this.editedIndex > -1) {
        data.append("_method", "put");
        this.CallAPI(
          "post",
          "products/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã tác giả đã tồn tại";
          }
        );
      } else {
        this.CallAPI(
          "post",
          "products",
          data,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã tác giả đã tồn tại";
          }
        );
      }
    },
  },
};
</script>
