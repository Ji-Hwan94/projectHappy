<template>
  <div class="about">
    <!-- boardList 목록 Start -->
    <div id="boardList">
      <div style="text-align: center; color: darkblue">
        [ 총 글 수 : {{ totCnt }} ]
        <button style="left: 100%" @click="openModal('insert')">new</button>
      </div>
      <table
        class="col"
        id="table_row_get"
        style="width: 100%; border: 1px solid"
      >
        <caption></caption>
        <colgroup>
          <col width="10%" />
          <col width="50%" />
          <col width="10%" />
          <!-- 
                  <col width="5%">
                   -->
        </colgroup>
        <thead>
          <tr>
            <th scope="col">순번</th>
            <th scope="col">제 &emsp; 목</th>
            <th scope="col">작성일</th>
            <!--
                      <th scope="col"></th>
                      -->
          </tr>
        </thead>
        <!-- 게시판 리스트  Start -->
        <tbody id="tbodyboardlist">
          <template v-for="item in boardList" :key="item.board_seq">
            <tr @click="openModal(item)">
              <td>{{ item.board_seq }}</td>
              <td>{{ item.board_title }}</td>
              <td>{{ item.board_regdate }}</td>
            </tr>
          </template>
        </tbody>
        <!-- 게시판 리스트  End -->
      </table>
    </div>
  </div>
</template>
<script>
import { openModal } from "jenesius-vue-modal";
import modalView from "./ModalView.vue";
export default {
  data: function () {
    return {
      totCnt: 0,
      boardList: [],
      pagenum: 1,
      pageSize: 10,
      searchType: "",
      board_type: "A",
      seq: "",
      modalChk: false,
      modalNm: "",
      modalTitle: "",
    };
  },
  created: function () {
    this.emitter.on("refresh", () => {
      // this.buttonAction.actionType = "";
      this.listsearch();
    });
  },
  mounted() {
    this.listsearch();

    this.emitter.on("close", () => {
      // this.buttonAction.actionType = "";
      alert("그냥 닫힘");
    });
  },
  methods: {
    listsearch: function (pageNum = null) {
      let vm = this;
      if (pageNum) {
        this.pagenum = pageNum;
      }
      let params = new URLSearchParams();
      params.append("pagenum", this.pagenum);
      params.append("pageSize", this.pageSize);
      params.append("searchType", this.searchType);
      params.append("board_type", this.board_type);

      // vuecombiListAxios("/admin/vuecombiList.do", params)
      //   .then(function (response) {
      //     vm.boardlist = response.data.boardlist;
      //     vm.totalCnt = response.data.totalcnt;
      //     vm.items = response.data.listComnGrpCodModel;
      //     vm.totalPage = vm.page();
      //   })
      //   .catch(function (error) {
      //     alert("에러! API 요청에 오류가 있습니다. " + error);
      //   });

      this.axios
        .post("/admin/vuecombiList.do", params)
        .then(function (response) {
          vm.boardList = response.data.boardlist;
          vm.totCnt = response.data.totalcnt;
          console.log("vm.boardlist: " + JSON.stringify(response.data));
          console.log("vm.pagenum: " + vm.pagenum);
          vm.items = response.data.listComnGrpCodModel;
          vm.totalPage = vm.page();
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    openModal: async function (seq) {
      const modal = await openModal(modalView, {
        popUpItems: seq,
      });

      modal.onclose = (popupparam) => {
        console.log("Close : " + popupparam);
        // this.showLectureList();
      };
    },
  },
};
</script>
