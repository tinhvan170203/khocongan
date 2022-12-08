$(document).ready( async() => {

    const id = $('.main-top').attr('id');
  
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
    // Form thêm đơn vị khi submit
    const addDanhmuc = async (data) => {
      try {
        let res = await axios.post(`/quan-tri/${id}/loai-hang-hoa/add`, data);
        await tableDanhmuc();
        toast(`Thêm mới loại hàng hóa ${res.data} thành công !`);
        $("#addForm")[0].reset();
      } catch (error) {
        console.log(error.message);
      }
    };
     
    $("#addForm").on("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      const json = JSON.stringify(Object.fromEntries(formData));
      const data = JSON.parse(json);
      await addDanhmuc(data);
    });
  
    //Fetch bảng các đơn vị
    const tableDanhmuc = async () => {
      table =  await $("#table").DataTable({
        ajax: {
          url: `/quan-tri/${id}/loai-hang-hoa/fetch`,
          dataSrc: "",
        },
        bSort: false,
        lengthMenu: [10],
        language: {
          search: "Tìm kiếm",
          sInfoEmpty: "",
          sEmptyTable: "Không có dữ liệu trong mục này",
          sInfoFiltered: "",
          sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa",
          sLengthMenu: "",
        },
        destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
        aoColumns: [
            {
              mData: function (data, type, dataToSet) {
                return `<p class="thutu" style="text-align: center">${data.thutu}</p>`;
              },
              "width": "5%"
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="kyhieu" id=${data._id}>${data.tenloaihanghoa}</p>`;
              },
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="ten">${data.danhmuc.tendanhmuc}</p>`;
              },
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="ten">${data.danhmuc.phanloai}</p>`;
              },
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="vitri">${data.nuocSX}</p>`;
              },
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center"><button data-bs-toggle="modal" data-bs-target="#editModal" class="btn1 btn-edit" title="Sửa"><i class="fas fa-edit btn-icon"></i></button><button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn1 btn-delete" title="Xóa"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
              },
            },
          ],
      });
    };
    await tableDanhmuc();
  
    //   Xóa đơn vị
    let id_Delete;
    table.on("click", ".btn-delete", function () {
      let row = $(this).closest("tr");
      id_Delete = row.find(".kyhieu").attr("id");
    });
  
    const deleteDanhmuc = async (id1) => {
      await axios.delete(`/quan-tri/${id}/loai-hang-hoa/${id1}`);
      toast("Xóa kho thành công !");
      await tableDanhmuc();
    };
  
    $("#confirm").on("click", async () => {
      await deleteDanhmuc(id_Delete);
      $(".close").click();
    });
  
    //Edit đơn vị
    let id_Edit;
  
    const editDanhmuc = async (data) => {
      await axios.put(`/quan-tri/${id}/loai-hang-hoa/${id_Edit}`, data);
      await tableDanhmuc();
      toast("Cập nhật thành công !");
    };
  
    table.on("click", ".btn-edit", function () {
      let row = $(this).closest("tr");
      id_Edit = row.find(".kyhieu").attr("id");
      $("#tenEdit").val(`${row.find(".kyhieu").text()}`);
      $("#kyhieuEdit").val(`${row.find(".vitri").text()}`);
      $("#thutuEdit").val(`${row.find(".thutu").text()}`);
      // $("#vitriEdit").val(`${row.find(".vitri").text()}`);
    });
  
    $("#editForm").on("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      const json = JSON.stringify(Object.fromEntries(formData));
      const data = JSON.parse(json);
      await editDanhmuc(data);
      $(".btn-close").click();
    });
  });
  