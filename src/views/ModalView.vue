<template>
  <div id="modalEx" style="border: 1px solid">
    <table class="col" id="table_row_get" style="width: 100%">
      <thead>
        <tr>
          <th>제목: <input type="text" v-model="titleModal" /></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div>내용: <input type="text" v-model="modalContext" /></div>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <button @click="saveContext">저장</button>
      <button @click="deleteContext" v-if="action != 'I'">삭제</button>
    </div>
    <div v-if="modalDetail != ''">modalDetailName: {{ modalDetail }}</div>
    <div>
      <button @click="closeThis">close</button>
    </div>
  </div>
</template>
<style>
#modalEx {
  width: 80%;
  height: 60%;
  background: white;
}
.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(201, 204, 22, 0.5);
  position: fixed;
  padding: 20px;
}

.white-bg {
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 8px;
}
</style>
<script>
import { closeModal } from "jenesius-vue-modal";
import axios from "axios";
export default {
  props: { popUpItems: [String, Object] },
  data: function () {
    return {
      titleModal: "",
      modalContext: "",
      modalDetail: "",
      popUpObj: {},
      action: "",
      boardSeq: "",
    };
  },
  mounted() {
    this.popUpObj = this.popUpItems;
    if (this.popUpItems == "insert") {
      this.titleModal = "";
      this.action = "I";
    } else {
      this.titleModal = this.popUpItems.board_title;
      this.modalContext = this.popUpItems.board_cont;
      this.modalDetail = this.popUpItems.detail_name;
      this.boardSeq = this.popUpItems.board_seq;
      this.action = "U";
    }
  },
  methods: {
    getPopUpItems: function () {
      console.log(JSON.stringify(this.popUpItems));
    },
    closeThis: function () {
      let vm = this;
      this.emitter.emit("close", null);
      closeModal(vm);
    },
    saveContext: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append("searchType", "A");
      params.append("board_title", this.titleModal);
      params.append("board_cont", this.modalContext);
      params.append("loginID", "admin");
      params.append("board_type", "A");
      params.append("action", this.action);
      params.append("board_seq", this.boardSeq);

      axios.post("/admin/boardSave.do", params).then((res) => {
        if (res.status == 200) {
          alert("저장되었습니다");
          vm.emitter.emit("refresh", null);
          closeModal(vm);
        }
      });
    },
    deleteContext: function () {
      this.action = "D";
      let vm = this;
      let params = new URLSearchParams();
      params.append("action", this.action);
      params.append("board_seq", this.boardSeq);
      axios.post("/admin/boardSave.do", params).then((res) => {
        if (res.status == 200) {
          alert("삭제되었습니다");
          vm.emitter.emit("refresh", null);
          closeModal(vm);
        }
      });
    },
  },
};
</script>
