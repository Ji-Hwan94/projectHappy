<template>
  <div class="about">
    <!-- 모달 등록 1 Start -->
    <div id="modalEx" class="black-bg" v-if="modalChk == true">
      <div class="white-bg">
        <div>modal</div>
        <table class="col" id="table_row_get" style="width: 100%">
          <thead>
            <tr>
              <th>{{ modalTitle }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                작성자
                <div><input type="text" v-model="modalNm" /></div>
              </td>
            </tr>
            <tr>
              <td>
                내용
                <div><input type="textarea" v-model="modalContext" /></div>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="closeModal">close</button>
      </div>
    </div>
    <!-- 모달 등록 1 End -->

    <!-- boardList 목록 Start -->
    <div id="boardList">
      <div style="text-align: center; color: darkblue">
        [ 총 글 수 : {{ totCnt }} ]
        <button style="left: 100%" @click="openModal('open')">new</button>
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
          <col width="10%" />
          <col width="15%" />
          <!-- 
                  <col width="5%">
                   -->
        </colgroup>
        <thead>
          <tr>
            <th scope="col">순번</th>
            <th scope="col">제 &emsp; 목</th>
            <th scope="col">작성자</th>
            <th scope="col">조회수</th>
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
              <td>{{ item.loginName }}</td>
              <td>{{ item.board_view }}</td>
              <td>{{ item.board_regdate }}</td>
            </tr>
          </template>
        </tbody>
        <!-- 게시판 리스트  End -->
      </table>
    </div>
  </div>
</template>
<style>
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
      modalContext: "",
    };
  },
  mounted() {
    this.listsearch();
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
    openModal: function (seq) {
      this.modalChk = true;
      this.seq = seq;

      if (seq == "open") {
        this.modalNm = "";
        this.modalContext = "";
        this.modalTitle = "신규등록";
      } else {
        this.modalNm = seq.loginName;
        this.modalContext = seq.board_cont;
        this.modalTitle = seq.board_title;
      }
    },
    closeModal: function () {
      this.modalChk = false;
    },
  },
};
</script>
