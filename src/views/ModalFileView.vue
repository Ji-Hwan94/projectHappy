<template>
  <div id="modalEx" class="black-bg">
    <form id="boardform">
      <div class="white-bg">
        <table class="col" id="table_row_get" style="width: 100%">
          <thead>
            <tr>
              <th>
                제목:
                <input type="text" v-model="titleModal" name="board_title" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
                  내용:
                  <input type="text" v-model="modalContext" name="board_cont" />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="fileCss">
                  <input type="file" style="" @change="onFileChange" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-html="inserthtml" @click="fileclick()"></div>
        <div>
          <button class="btn btn-primary mx-2" @click="saveContext('save')">
            저장
          </button>
          <button @click="deleteContext" v-if="action != 'I'">삭제</button>
        </div>
        <div v-if="modalDetail != ''">modalDetailName: {{ modalDetail }}</div>
        <div>
          <button @click="closeThis">close</button>
        </div>
      </div>
    </form>
  </div>
</template>
<style>
#modalEx {
  width: 100%;
  height: 100%;
  background-color: rgba(12, 1, 1, 0.2);
}
.black-bg {
  width: 100%;
  height: 100%;

  position: fixed;
  padding: 20px;
}

.white-bg {
  width: 50%;
  background: ivory;
  border-radius: 8px;
  padding: 8px;
  margin-left: 20%;
  margin-top: 5%;
}

.fileCss {
  margin-left: 5%;
}
</style>
<script>
import axios from "axios";
import { closeModal } from "jenesius-vue-modal";
export default {
  props: { popUpItems: Object, paction: String },
  data: function () {
    return {
      titleModal: "",
      modalContext: "",
      modalDetail: "",
      popUpObj: {},
      action: "",
      boardSeq: "",
      fileSeq: "",
      files: "",
      imgSrc: "",
      inserthtml: "",
      filename: "",
      filephy: "",
    };
  },
  mounted() {
    this.popUpObj = this.popUpItems;
    this.action = this.paction;
    if (this.action == "I") {
      this.titleModal = "";
    } else {
      this.titleModal = this.popUpItems.board_title;
      this.modalContext = this.popUpItems.board_cont;
      this.modalDetail = this.popUpItems.detail_name;
      this.boardSeq = this.popUpItems.board_seq;

      this.getPopUpItems();
    }
  },
  methods: {
    getPopUpItems: function () {
      let vm = this;
      console.log(JSON.stringify(this.popUpItems));
      let params = new URLSearchParams();
      params.append("board_seq", this.boardSeq);
      this.axios.post("/admin/boardSelect.do", params).then((res) => {
        console.log("111111111111111111111111 : " + JSON.stringify(res));

        if (res.data.boardinfo.file_seq > 0) {
          //vm.imgSrc = res.data.boardinfo.file_nadd;
          let file_name = res.data.boardinfo.file_name;
          let file_namearr = file_name.split(".");

          vm.filename = res.data.boardinfo.file_name;
          vm.filephy = res.data.boardinfo.file_madd;

          if (
            file_namearr[1] == "png" ||
            file_namearr[1] == "jpg" ||
            file_namearr[1] == "jpeg" ||
            file_namearr[1] == "bmp"
          ) {
            vm.inserthtml =
              "<img src='" + res.data.boardinfo.file_nadd + "' />";
          } else {
            vm.inserthtml = res.data.boardinfo.file_name;
          }
        }
      });
    },
    closeThis: function () {
      closeModal(this);
      this.emitter.emit("close", null);
    },
    saveContext: function () {
      let vm = this;
      let formData = new FormData(document.getElementById("boardform"));
      formData.enctype = "multipart/form-data";
      formData.append("action", this.action);
      formData.append("loginID", "admin");
      formData.append("board_type", "A");
      formData.append("board_seq", this.boardSeq);
      formData.append("searchType", "A");
      formData.append("file_seq", "-1");
      formData.append("files", this.files);

      this.axios.post("/admin/boardSave.do", formData).then((res) => {
        if (res.status == 200) {
          alert("저장 되었습니다.");
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
        }
      });
    },
    onFileChange: function (e) {
      var files = e.target.files;
      var fileType = files[0].type;
      if (
        fileType == "image/png" ||
        fileType == "image/jpg" ||
        fileType == "image/jpeg" ||
        fileType == "image/bmp"
      ) {
        this.inserthtml =
          "<img src='" + window.URL.createObjectURL(e.target.files[0]) + "' />";
      }
    },
    fileclick: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("file_madd", this.filephy);
      params.append("file_name", this.filename);
      axios.post("/admin/boardDownload.do", params).then((res) => {
        if (res.status == 200) {
          console.log(res);
          var FILE = window.URL.createObjectURL(new Blob([res.data]));
          console.log("FILE : " + FILE);
          var docUrl = document.createElement("a");
          docUrl.href = FILE;
          docUrl.setAttribute("download", vm.filename);
          document.body.appendChild(docUrl);
          docUrl.click();
        }
      });
    },
  },
};
</script>
