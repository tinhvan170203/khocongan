$(document).ready(async () => {
    const id = $(".main-top").attr("id");
    let idHanghoaDeleteNoneSeri = [];
    let idHanghoaDeleteCoSeri = [];
  
    const toast = (data) => {
      return Toastify({
        text: `${data}`,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: " linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    };
  
    let table;
    table = $("#table").DataTable({
      lengthMenu: [100000000000000],
      searching: false,
      paging: false,
      language: {
        search: "Tìm kiếm",
        sInfoEmpty: "",
        sEmptyTable: "Không có dữ liệu hàng hóa nhập kho",
        sInfoFiltered: "",
        sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa nhập kho",
        sLengthMenu: "",
      },
      destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
    });
  
    $('select[name="loaihanghoa"]').on("change", function () {
      let phanloai = $('select[name="loaihanghoa"] option:selected').attr("id");
      $("#phanloai").val(phanloai);
  
      if (
        phanloai ===
        "Có số seri, mã vạch và được cấp phát, quản lý, thu hồi và thanh lý"
      ) {
        $('input[name="soluong"]').val(1);
        $('input[name="soluong"]').attr("max", 1);
      } else {
        $('input[name="soluong"]').val(1);
        $('input[name="soluong"]').removeAttr("max");
      }
    });
  
    $("#addForm").on("submit", (e) => {
      e.preventDefault();
      let data = {};
      const loaihanghoa = $("#loaihanghoa option:selected").text();
      const loaihanghoaId = $("#loaihanghoa option:selected").val();
      const nguoncap = $("#nguoncap option:selected").text();
      const nguoncapId = $("#nguoncap option:selected").val();
      const soluong = $("#soluong").val();
      const mark = $("#mark").val();
      const phanloai = $("#phanloai option:selected").val();
      data = {
        loaihanghoa,
        nguoncap,
        soluong,
        mark,
        phanloai,
        nguoncapId,
        loaihanghoaId,
      };
      addRow(data);
      $("#mark").val("");
    });
  
    const addRow = (newItem) => {
      table.row
        .add([
          function (data, type, dataToSet) {
            return `<p class="loaihanghoa" id="${newItem.loaihanghoaId}" style="text-align: center">${newItem.loaihanghoa}</p>`;
          },
          function (data, type, dataToSet) {
            return `<p class="nguoncap" id="${newItem.nguoncapId}" style="text-align: center">${newItem.nguoncap}</p>`;
          },
          function (data, type, dataToSet) {
            return `<input class="seri change" id='${newItem.phanloai}' required value='${newItem.mark}'/>`;
          },
          function (data, type, dataToSet) {
            return `<input class="soluong change" ${
              newItem.phanloai ===
              "Có số seri, mã vạch và được cấp phát, quản lý, thu hồi và thanh lý"
                ? "max=1"
                : ""
            } type="number" min="1" value='${newItem.soluong}'/>`;
          },
          function (data, type, dataToSet) {
            return `<p style="text-align: center"><button class="btn1 btn-delete delete-row" title="Xóa"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
          },
        ])
        .draw();
    };
  
    $(document).on("click", ".delete-row", function () {
      let row = null;
      row = $(this).parents("tr");
      $("#table1").DataTable().row(row).remove().draw();
    });
  
    let idLichsunhapkho;
    const importKho = async (data) => {
      idLichsunhapkho = $('.tenhienthi').attr('id');
      try {
        await axios.put(`/quan-tri/${id}/chinh-sua-lich-su-nhap-kho/${idLichsunhapkho}/edit`, data);
      } catch (error) {
        console.log(error.message);
      }
    };
  
    $("#importForm").on("submit", async function (e) {
      e.preventDefault();
      let data = { kho: {}, hanghoacapnhat: [],hanghoabosung: [], idHanghoaDeleteNoneSeri,idHanghoaDeleteCoSeri };
      let tb = $("#table1 tbody");
      let thoigiannhapkho = $("#thoigiannhapkho").val();
      let canbonhapkho = $("#canbonhapkho").val();
      let ghichu = $("#ghichu").val();
      data.kho = { thoigiannhapkho,canbonhapkho,ghichu };
      tb.find("tr:not('.tr-title')").each(function (index, element) {
        let idItem = element.getAttribute('id');
        let phanloai = element.cells[1].getAttribute('id')
        let mark = element.cells[2].children[0].value;
        let soluong = element.cells[3].children[0].value;
        data.hanghoacapnhat.push({ idItem, mark, soluong,phanloai });
      });

      
      //   $('#importForm')[0].reset();
      
      let tb2 = $("#table tbody");
      tb2.find("tr").each(function (index, element) {

        if(element.children[0].getAttribute('class') !== 'dataTables_empty'){
          let loaihanghoa = element.cells[0].children[0].getAttribute("id");
          let nguoncap = element.cells[1].children[0].getAttribute("id");
          let phanloai = element.cells[2].children[0].getAttribute('id')
          let mark = element.cells[2].children[0].value.trim();
          let soluong = element.cells[3].children[0].value;
          data.hanghoabosung.push({ loaihanghoa, nguoncap, mark, soluong,phanloai });
        }
      });
      
      // console.log(data)
      await importKho(data);
      window.location.href = `/quan-tri/${id}/lich-su-nhap-kho`
      // table = $("#table").DataTable({
        // lengthMenu: [10],
      // searching: false,
      // data: [],
      // language: {
      //   search: "Tìm kiếm",
      //   sInfoEmpty: "",
      //   sEmptyTable: "Không có dữ liệu hàng hóa nhập kho",
      //   sInfoFiltered: "",
      //   sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa nhập kho",
      //   sLengthMenu: "",
      // },
      // destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
      // })
    });

    $('table tbody tr .delete-row1').on('click', function(){
        let isDelete = confirm('Đồng ý xóa loại hàng hóa này khỏi danh sách hàng đã nhập kho?');

        if(isDelete){
            let idHanghoaDel = $(this).closest('tr').attr('id');
            idHanghoaDeleteNoneSeri.push(idHanghoaDel) 
            $(this).closest('tr').remove()
        };

    });

    $('table tbody tr .delete-row2').on('click', function(){
        let isDelete = confirm('Đồng ý xóa loại hàng hóa này khỏi danh sách hàng đã nhập kho?');
        if(isDelete){
            let idHanghoaDel = $(this).closest('tr').attr('id');
            idHanghoaDeleteCoSeri.push(idHanghoaDel) 
            $(this).closest('tr').remove()
        };
    });
  });
  