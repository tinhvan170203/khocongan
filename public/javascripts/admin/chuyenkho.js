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
    const getKhochuyenden = async (id) => {
      let res = await axios.get(`/quan-tri/${id}/chuyen-kho/list-kho-chuyen-den`,{params: {idkho: id}})
      return res.data
    }

    let table;
    $('#addForm').on('submit', async(e)=>{
        e.preventDefault();
        $('#table-body').html('');
        $("#table").DataTable().clear();
        $("#table").DataTable().destroy();
        $('.spinner').addClass('visiable');
        $('.spinner').fadeIn();
        $('#khochuyenden').html('');
        
        khochuyendi = $('#khochuyendi').val();
        thoigianchuyenkho = $('#thoigianchuyenkho').val();
    
        const khoList = await getKhochuyenden(khochuyendi);

        if(khoList && khoList.length > 0){
          khoList.forEach( kho=>{
            $('#khochuyenden').append(`
            <option value="${kho._id}">${kho.tenkho}</option>
            `)
          })
        }
        
        $('.khochuyenden').fadeIn();
    
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
                <td style="text-align: center;"><input type="checkbox" class="checkItem" /> Chọn</td>
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
                <td style="text-align: center;"><input type="checkbox" class="checkItem" /> Chọn</td>
                </tr>
            `)
          })
        };

        table = $("#table").DataTable({
          lengthMenu: [100000000000],
          "scrollY": "400px",
          "scrollCollapse": true,
          "paging": false,
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

        
        $('#thoigianChuyenkho').html("ngày " + $('#thoigianchuyenkho').val().split("-").reverse().join("-"))
        $('#khobandau').html($('#khochuyendi option:selected').text());


        $('#checkAll').on('change', function(){
          let isCheckedAll = $(this).prop('checked');
          let checkItem = $('.checkItem');
          checkItem.prop('checked', isCheckedAll)
          if(isCheckedAll){
            checkItem.each((index, element)=>{
              let row = element.closest('tr');
              let maxSL = row.cells[5].children[0].getAttribute('max');
              row.cells[5].children[0].value = maxSL
            });
          }else{
            checkItem.each((index, element)=>{
              let row = element.closest('tr');
              row.cells[5].children[0].value = 1
            });
          }
        });
      });

      const chuyenKho = async (data) => {
        axios.post(`/quan-tri/${id}/chuyen-kho`, data);
      };

      $('#importForm').on('submit', async (e) => {
        e.preventDefault();
        let checkedItem = $('.checkItem:checked');
        let hanghoaNoneSerichuyenkho = [];
        let hanghoaCoSerichuyenkho = [];
        checkedItem.each((index, element) => {
          let row = element.closest('tr');
          let idHanghoa = row.getAttribute('id');
          let soluongchuyenkho = row.cells[5].children[0].value
          let phanloai = row.getAttribute('class');
          if(phanloai === 'no-seri odd' || phanloai === 'no-seri even' ){
            hanghoaNoneSerichuyenkho.push({idHanghoa, soluongchuyenkho})
          }else{
            hanghoaCoSerichuyenkho.push({idHanghoa, soluongchuyenkho})
          };
        });
        if(hanghoaCoSerichuyenkho.length === 0 && hanghoaNoneSerichuyenkho.length === 0){
          alert('Chuyển kho chưa được thực hiện do chưa có hàng hóa nào được chọn chuyển kho')
          return;
        }
        let khochuyenden = $('#khochuyenden').val();
        let canbochuyenkho = $('#canbochuyenkho').val();
        let ghichu = $('#ghichu').val();
        let data = {khochuyendi,khochuyenden,hanghoaNoneSerichuyenkho,hanghoaCoSerichuyenkho,canbochuyenkho,thoigianchuyenkho,ghichu};

        await chuyenKho(data)
        toast('Chuyển kho thành công...');
        $('#table-body').html('');
        $('#addForm')[0].reset();
        $('#importForm')[0].reset()
      });   
  });
  