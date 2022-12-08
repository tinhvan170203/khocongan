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
    const addNguoncap = async (data) => {
      try {
        let res = await axios.post(`/quan-tri/${id}/nguon-cap/add`, data);
        await tableNguoncap();
        toast(`Thêm mới nguồn cấp ${res.data} thành công !`);
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
      await addNguoncap(data);
    });
  
    //Fetch bảng các đơn vị
    const tableNguoncap = async () => {
      table =  await $("#table").DataTable({
        ajax: {
          url: `/quan-tri/${id}/nguon-cap/fetch`,
          dataSrc: "",
        },
        bSort: false,
        lengthMenu: [10],
        language: {
          search: "Tìm kiếm",
          sInfoEmpty: "",
          sEmptyTable: "Không có dữ liệu trong mục này",
          sInfoFiltered: "",
          sInfo: "Tổng cộng  _TOTAL_ nguồn cấp",
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
              return `<p style="text-align: center" class="kyhieu" id=${data._id}>${data.tennguoncap}</p>`;
            },
          },
          {
            mData: function (data, type, dataToSet) {
              return `<p style="text-align: center" class="ten">${data.chitiet}</p>`;
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
    await tableNguoncap();
  
    //   Xóa đơn vị
    let id_Delete;
    table.on("click", ".btn-delete", function () {
      let row = $(this).closest("tr");
      id_Delete = row.find(".kyhieu").attr("id");
    });
  
    const deleteNguoncap = async (id1) => {
      await axios.delete(`/quan-tri/${id}/nguon-cap/${id1}`);
      toast("Xóa nguồn cấp hàng hóa thành công !");
      await tableNguoncap();
    };
  
    $("#confirm").on("click", async () => {
      await deleteNguoncap(id_Delete);
      $(".close").click();
    });
  
    //Edit đơn vị
    let id_Edit;
  
    const editNguoncap = async (data) => {
      await axios.put(`/quan-tri/${id}/nguon-cap/${id_Edit}`, data);
      await tableNguoncap();
      toast("Cập nhật thành công !");
    };
  
    table.on("click", ".btn-edit", function () {
      let row = $(this).closest("tr");
      id_Edit = row.find(".kyhieu").attr("id");
      $("#tenEdit").val(`${row.find(".kyhieu").text()}`);
      $("#kyhieuEdit").val(`${row.find(".ten").text()}`);
      $("#thutuEdit").val(`${row.find(".thutu").text()}`);
    });
  
    $("#editForm").on("submit", async (e) => {
      e.preventDefault();
      let formData = new FormData(e.target);
      const json = JSON.stringify(Object.fromEntries(formData));
      const data = JSON.parse(json);
      await editNguoncap(data);
      $(".btn-close").click();
    });
  });
  