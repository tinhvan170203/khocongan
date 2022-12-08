$(document).ready(async () => {
  const id = $(".main-top").attr("id");
  const id1 = $(".main-top-left").attr("id");

  table = $("#table").DataTable({
    lengthMenu: [1000000],
    scrollY: "400px",
    scrollCollapse: true,
    paging: false,
    // searching: false,
    language: {
      search: "Tìm kiếm",
      sInfoEmpty: "",
      sEmptyTable: "Không có dữ liệu hàng hóa chuyển kho",
      sInfoFiltered: "",
      sInfo: "",
      sLengthMenu: "",
    },
    destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
  });

  const chuyenKho = async (data) => {
    axios.put(`/quan-tri/${id}/chinh-sua-chuyen-kho/${id1}`, data);
  };

  $("#addForm").on("submit", async (e) => {
    e.preventDefault();

    let checkedItem = $(".checkItem:checked");
    let hanghoaNoneSeriChuyenkho = [];
    let hanghoaCoSeriChuyenkho = [];

    checkedItem.each((index, element) => {
      let row = element.closest("tr");
      let idHanghoa = row.getAttribute("id");
      let soluongchuyenkho = row.cells[5].children[0].value;
      let phanloai = row.getAttribute("class");
      if (phanloai === "no-seri odd" || phanloai === "no-seri even") {
        hanghoaNoneSeriChuyenkho.push({ idHanghoa, soluongchuyenkho });
      } else {
        hanghoaCoSeriChuyenkho.push({ idHanghoa, soluongchuyenkho });
      }
    });
    if (
      hanghoaCoSeriChuyenkho.length === 0 &&
      hanghoaNoneSeriChuyenkho.length === 0
    ) {
      alert(
        "Chuyển kho chưa được thực hiện do chưa có hàng hóa nào được chọn chuyển kho"
      );
      return;
    }

    let canbochuyenkho = $("#canbochuyenkho").val();
    let ghichu = $("#ghichu").val();
    let data = {
      hanghoaNoneSeriChuyenkho,
      hanghoaCoSeriChuyenkho,
      canbochuyenkho,
      ghichu,
    };
    await chuyenKho(data);
    window.location.href = `/quan-tri/${id}/lich-su-chuyen-kho`;
  });

 
  $("#checkAll").on("change", function () {
    let isCheckedAll = $(this).prop("checked");
    let checkItem = $(".checkItem");
    checkItem.prop("checked", isCheckedAll);
    if (isCheckedAll) {
      checkItem.each((index, element) => {
        let row = element.closest("tr");
        let maxSL = row.cells[5].children[0].getAttribute("max");
        row.cells[5].children[0].value = maxSL;
      });
    } else {
      checkItem.each((index, element) => {
        let row = element.closest("tr");
        row.cells[5].children[0].value = 1;
      });
    }
  });
});
