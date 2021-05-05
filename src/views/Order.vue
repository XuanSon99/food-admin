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
              <!-- <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Thêm mới
                </v-btn>
              </template> -->
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
                          :items="statusList"
                          v-model="editedItem.status_id"
                          label="Trạng thái"
                          item-text="name"
                          item-value="id"
                        ></v-autocomplete>
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
        value: "bill_id",
      },
      { text: "Sản phẩm", value: "name" },
      { text: "Số lượng", value: "quantity" },
      { text: "Tổng tiền", value: "price" },
      { text: "Thời gian", value: "time" },
      { text: "Địa chỉ", value: "address" },
      { text: "Trạng thái", value: "status" },
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
      status: "",
      status_id: "",
    },
    defaultItem: {
      name: "",
      image: "",
      price: "",
      time: "",
      status: "",
      status_id: "",
    },
    show: false,
    error: "",
    url: "",
    srcImg: "",
    cateList: [],
    statusList: [
      {
        name: "Đã giao",
        id: "delivered",
      },
      {
        name: "Chưa giao",
        id: "wating",
      },
    ],
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
  },

  methods: {
    inputImage(event) {
      this.srcImg = event.target.files[0];
      this.url = URL.createObjectURL(this.srcImg);
    },
    getList() {
      this.desserts = [];
      this.CallAPI("get", "bills", {}, (response) => {
        for (let item of response.data) {
          this.desserts.push({
            id: item.products[0].id,
            bill_id: item.bill_id,
            address: item.products[0].address,
            name: this.details(item.products).name,
            quantity: this.details(item.products).quantity,
            price: this.details(item.products).price,
            time: this.formatDate2(item.products[0].time),
            status: this.status(item.products[0].status),
            status_id: item.products[0].status,
          });
        }
      });
    },
    details(list) {
      let name = "";
      let quantity = 0,
        price = 0;
      for (let [index, item] of list.entries()) {
        name +=
          index == list.length - 1
            ? item.product.name
            : item.product.name + " | ";
        quantity +=
          index == list.length - 1 ? item.quantity : item.quantity + " | ";
        price += item.price;
      }
      return {
        name: name,
        quantity: quantity,
        price: this.formatMoney(price),
      };
    },
    status(st) {
      if (st == "waiting") return "Chưa giao";
      if (st == "cancel") return "Đã hủy";
      return "Đã giao";
    },
    formatMoney(value) {
      return String(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    formatDate2(date) {
      return date.slice(0, 10).split("-").reverse().join("/");
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
        "bills/" + this.desserts[this.editedIndex].id,
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
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "bills/" + this.desserts[this.editedIndex].id,
          {
            status: this.editedItem.status_id,
          },
          (response) => {
            this.$toast.success("Sửa thành công");
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
