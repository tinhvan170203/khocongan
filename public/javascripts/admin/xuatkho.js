$(document).ready(async () => {
    const id = $(".main-top").attr("id");
    let khochuyendi = null;
    let thoigianchuyenkho = null;

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

    const getThongtinHang = async (data) => {
      let res = await axios.get(`/quan-tri/${id}/chuyen-kho/lay-thong-tin`,{params: data})
      return res.data
    };

    let table;
    $('#addForm').on('submit', async(e)=>{
        e.preventDefault();
        $('#table-body').html('');
        $("#table").DataTable().clear();
        $("#table").DataTable().destroy();
        $('.spinner').addClass('visiable');
        $('.spinner').fadeIn();
        $('.khochuyenden').fadeIn();
        
        khochuyendi = $('#khoxuathang').val();
        thoigianchuyenkho = $('#thoigianxuatkho').val();
       
    
        let data = await getThongtinHang({khochuyendi, thoigianchuyenkho});
        $('.spinner').removeClass('visiable');
        $('.spinner').fadeOut();

        if(data && data.hanghoaNoneSeriInKho.length > 0){
          data.hanghoaNoneSeriInKho.forEach((item, index) => {
            $('#table-body').append(`
              <tr id="${item._id}" class="no-seri">
                <td style="text-align: center;font-weight: bold">${index + 1}</td>
                <td style="text-align: center;font-weight: bold">${item.loaihanghoa.tenloaihanghoa}</td>
                <td style="text-align: center">${item.nguoncap.tennguoncap}</td>
                <td style="text-align: center">${item.mark}</td>
                <td style="text-align: center;font-weight: bold">${item.hanghoacotrongkho}</td>
                <td style="text-align: center;"><input type="number" style="text-align:center" min="1" value="1" max="${item.hanghoacotrongkho}" /></td>
                <td><button style="text-align: center;width: 100%;padding: 2px" class="btn btn-success export" title="Thêm vào danh sách xuất kho"><i class="fas fa-shopping-cart"></i></button></td>
                </tr>
            `)
          })
        };

        if(data && data.hanghoaCoSeriInKho.length > 0){
          data.hanghoaCoSeriInKho.forEach((item, index) => {
            $('#table-body').append(`
              <tr id="${item._id}" class="seri">
              <td style="text-align: center;font-weight: bold">${data.hanghoaNoneSeriInKho.length + index + 1}</td>
                <td style="text-align: center;font-weight: bold">${item.loaihanghoa.tenloaihanghoa}</td>
                <td style="text-align: center">${item.nguoncap.tennguoncap}</td>
                <td style="text-align: center">${item.mark}</td>
                <td style="text-align: center;font-weight: bold">${item.hanghoacotrongkho}</td>
                <td style="text-align: center;"><input type="number" style="text-align:center" min="1" value="1" max="${item.hanghoacotrongkho}" /></td>
                <td><button style="text-align: center;width: 100%;padding: 2px" class="btn btn-success export" title="Thêm vào danh sách xuất kho"><i class="fas fa-shopping-cart"></i></button></td>
                </tr>
            `)
          })
        };

        table = $("#table").DataTable({
          lengthMenu: [10],
          "scrollY": "400px",
          "scrollCollapse": true,
          // "paging": false,
          // searching: false,
          language: {
          search: "Tìm kiếm",
          sInfoEmpty: "",
          sEmptyTable: "Không có dữ liệu hàng hóa trong kho",
          sInfoFiltered: "",
          sInfo: "",
          sLengthMenu: "",
          },
          destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
      });

        $('#khobandau').html($('#khoxuathang option:selected').text());
    });

    let table1;
    table1 = $("#table1").DataTable({
      lengthMenu: [100000000000],
      "scrollY": "400px",
      "scrollCollapse": true,
      "paging": false,
      language: {
        search: "Tìm kiếm",
        sInfoEmpty: "",
        sEmptyTable: "Không có dữ liệu hàng hóa xuất kho",
        sInfoFiltered: "",
        sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa xuất kho",
        sLengthMenu: "",
      },
      destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
    });

    const addRowNoneSeri = (newItem) => {
      let kho = $('#khobandau').html()
        table1.row
          .add([
            function (data, type, dataToSet) {
              return `<p class="loaihanghoa" id="${newItem.idHanghoa}" style="text-align: center">${newItem.loaihanghoa}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="nguoncap" style="text-align: center">${newItem.nguoncap}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center">${kho}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="seri" id='no-seri' style="text-align:center">${newItem.mark}</p>`;
            },
            function (data, type, dataToSet) {
              return `<input class="soluong" style="text-align:center" type="number" max="${newItem.tongsoluong}" min="0" value='${newItem.soluongxuatkho}'/>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center"><button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn1 btn-delete delete-row" title="Xóa"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
            },
          ])
          .draw();
      };

    const addRowCoSeri = (newItem) => {
      let kho = $('#khobandau').html()
        table1.row
          .add([
            function (data, type, dataToSet) {
              return `<p class="loaihanghoa" id="${newItem.idHanghoa}" style="text-align: center">${newItem.loaihanghoa}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="nguoncap" style="text-align: center">${newItem.nguoncap}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center">${kho}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="seri" id='co-seri' style="text-align:center">${newItem.mark}</p>`
            },
            function (data, type, dataToSet) {
              return `<input class="soluong" style="text-align:center" max="${newItem.tongsoluong}" type="number" min="0" value='${newItem.soluongxuatkho}'/>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center"><button class="btn1 btn-delete delete-row" title="Xóa"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
            },
          ])
          .draw();
    };


    $(document).on('click', '.export', function(){
        let row = $(this).closest('tr');
        let classRow = row.attr('class');
        let checkedPhanloai = classRow.includes('no-seri')
        let idHanghoa = row.attr('id');
        let loaihanghoa = row[0].cells[1].innerText;
        let nguoncap = row[0].cells[2].innerText
        let mark = row[0].cells[3].innerText
        let tongsoluong = row[0].cells[4].innerText
        let soluongxuatkho = row[0].cells[5].children[0].value
        let data = {
            idHanghoa,loaihanghoa,nguoncap,mark,tongsoluong,soluongxuatkho
        };

        if(checkedPhanloai){
            addRowNoneSeri(data)
        }else{
            addRowCoSeri(data)
        };
        $(this).attr('disabled','disabled')
    });


    $(document).on("click", ".delete-row", function () {
      let row = null;
      row = $(this).parents("tr");
      $("#table1").DataTable().row(row).remove().draw();
    });

    const exportKho = async (data) => {
      await axios.post(`/quan-tri/${id}/xuat-kho`,data)
    };

    $("#export").on("submit", async function (e) {
        e.preventDefault();
        var tb = $("#table1 tbody");
       
        let hanghoaNoneSeri = [];
        let hanghoaCoSeri = [];

        let thoigianxuatkho = $("#thoigianxuatkho").val();
        let canboxuatkho = $("#canboxuatkho").val();
        let canbotiepnhan = $("#canbotiepnhan").val();
        let donvitiepnhan = $("#donvitiepnhan").val();
        let donvi = $("#donvi").val();
        let ghichu = $("#ghichu").val();
       
        tb.find("tr").each(function (index, element) {
          if(element.cells[0].children[0]){
            let idHanghoa = element.cells[0].children[0].getAttribute("id");
            let checkedSeri = element.cells[3].children[0].getAttribute("id");
            let soluong = element.cells[4].children[0].value;
            if(checkedSeri === 'co-seri'){
              hanghoaCoSeri.push({idHanghoa,soluong})
          }else{
              hanghoaNoneSeri.push({idHanghoa,soluong})
            }
          }
        });
        let data = {
          thoigianxuatkho,canboxuatkho,canbotiepnhan,ghichu,
          hanghoaCoSeri,hanghoaNoneSeri,donvitiepnhan,donvi
        }
        // console.log(hanghoaNoneSeri)
        // console.log(data)
        await exportKho(data);
        $('#addForm')[0].reset();
        $('#export')[0].reset();

        table1 = $("#table1").DataTable({
            lengthMenu: [100000000000000000000],
            searching: false,
            paging: false,
            data: [],
            language: {
            search: "Tìm kiếm",
            sInfoEmpty: "",
            sEmptyTable: "Không có dữ liệu hàng hóa xuất kho",
            sInfoFiltered: "",
            sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa xuất kho",
            sLengthMenu: "",
            },
            destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
        });
        
        $("#table").DataTable({
            lengthMenu: [10],
            searching: false,
            data: [],
            language: {
            search: "Tìm kiếm",
            sInfoEmpty: "",
            sEmptyTable: "Không có dữ liệu hàng hóa xuất kho",
            sInfoFiltered: "",
            sInfo: "Tổng cộng  _TOTAL_ loại hàng hóa xuất kho",
            sLengthMenu: "",
            },
            destroy: true, // cho phép hủy bỏ table tạo table mới với cùng id table
        });

        toast('Xuất kho thành công')
    });
    
    const fetchDonviTructhuoc = async (id1) => {
      let res = await axios.get(`/quan-tri/${id}/don-vi-truc-thuoc/${id1}/fetch`);
      return res.data
    };

    $('#donvi').on('change', async function(){
      let id1 = $(this).val();

      $('#donvitiepnhan').html('')
      let data = await fetchDonviTructhuoc(id1);

      if(data && data.length > 0){
        data.forEach(i => {
          $('#donvitiepnhan').append(`
            <option value="${i._id}">${i.tendonvi}</option>
          `)
        })
      }
    });
  });
  