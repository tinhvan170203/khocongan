$(document).ready(async() =>{
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
      // Form thêm tài khoản khi submit
      const addTaikhoan = async (data) => {
        try {
             let res = await axios.post(`/quan-tri/${id}/tai-khoan/add`, data);
            await tableTaikhoan();
            toast(`Thêm mới tài khoản ${res.data} thành công !`);
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
        await addTaikhoan(data);
      });
    
      //Fetch bảng các đơn vị
      let table;
      const tableTaikhoan = async () => {
         table = await $("#table").DataTable({
          ajax: {
            url: `/quan-tri/${id}/tai-khoan/fetch`,
            dataSrc: "",
          },
          bSort: false,
          lengthMenu: [10],
          language: {
            search: "Tìm kiếm",
            sInfoEmpty: "",
            sEmptyTable: "Không có dữ liệu trong mục này",
            sInfoFiltered: "",
            sInfo: "Tổng cộng  _TOTAL_ tài khoản",
            sLengthMenu: "",
          },
          destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
          aoColumns: [
            {
                  "mData": function(data, type, dataToSet) {
                        return `<td></td>`
                    },
                    "width": "5%"
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="tentaikhoan" id=${data._id}>${data.tentaikhoan}</p>`;
              },
            },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center" class="tenhienthi">${data.tenhienthi}</p>`;
              },
            },
            {
                  mData: function (data, type, dataToSet) {
                    return `<p style="text-align: center" class="donvicaptren" id=${data.matkhau}>${data.matkhau}</p>`;
                  },
                },
            {
                  mData: function (data, type, dataToSet) {
                    return `<p style="text-align: center" class="role">${data.role}</p>`;
                  },
                },
            {
              mData: function (data, type, dataToSet) {
                return `<p style="text-align: center"><button data-bs-toggle="modal" data-bs-target="#editModal" class="btn1 btn-edit" title="Sửa"><i class="fas fa-edit btn-icon"></i></button><button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn1 btn-delete" title="Xóa"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
              },
            },
          ],
        });
        table.on('order.dt search.dt', function() {
            table.column(0).nodes().each(function(cell, i) {
                cell.innerHTML = `<p style="text-align:center">${i+1}</p>`
            });
        }).draw();
      };
      await tableTaikhoan()
      //   Xóa tài khoản
      let id_Delete;
      table.on("click", ".btn-delete", function () {
        let row = $(this).closest("tr");
        id_Delete = row.find(".tentaikhoan").attr("id");
      });
    
      const deleteTaikhoan = async (id1) => {
        await axios.delete(`/quan-tri/${id}/tai-khoan/${id1}`);
        await tableTaikhoan();
        toast("Xóa tài khoản thành công !");
      };
    
      $("#confirm").on("click", async () => {
        await deleteTaikhoan(id_Delete);
        $(".close").click();
      });
    
      //Edit tài khoản
      let id_Edit;
    
      const editTaikhoan = async (data) => {
        await axios.put(`/quan-tri/${id}/tai-khoan/${id_Edit}`, data);
        await tableTaikhoan();
        toast("Cập nhật thành công !");
      };
    
      table.on("click", ".btn-edit", function () {
        let row = $(this).closest("tr");
        id_Edit = row.find(".tentaikhoan").attr("id");
        $("#tenhienthiEdit").val(`${row.find(".tenhienthi").text()}`);
        $("#roleEdit").val(`${row.find(".role").text()}`);
      });
    
      $("#editForm").on("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const json = JSON.stringify(Object.fromEntries(formData));
        const data = JSON.parse(json);
        await editTaikhoan(data);
        $(".btn-close").click();
      });
    });
    