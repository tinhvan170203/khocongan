$(document).ready(async () => {
    const id = $(".main-top").attr("id");

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

    const getThongtinHangBangiao = async (data) => {
      let res = await axios.get(`/quan-tri/${id}/thu-hoi/hang-da-ban-giao`,{params: data})
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
        
        donvi = $('#donvi').val();
        donvitiepnhan = $('#donvitiepnhan').val();
        tungay = $('#tungay').val();
        thoigianthuhoi = $('#thoigianthuhoi').val();
        nguoncap = $('#nguoncap').val();
        danhmuc = $('#danhmuc').val();
        mark = $('#mark').val();
        loaihanghoa = $('#loaihanghoa').val();
        if(tungay === ""){
          tungay = "1970-01-01T00:00"
        }

        let query = {
          donvi,donvitiepnhan,tungay,thoigianthuhoi,nguoncap,danhmuc,mark, loaihanghoa
        }
        
        // console.log(query)
        let data = await getThongtinHangBangiao(query);
        $('.spinner').removeClass('visiable');
        $('.spinner').fadeOut();
        let donviTitle = $('#donvi option:selected').text();
        $('#donvi-title').html(donviTitle)

        if(data && data.hanghoaNoneSeriBangiao.length > 0){
          data.hanghoaNoneSeriBangiao.forEach((item, index) => {
            $('#table-body').append(`
              <tr id="${item._id}" class="no-seri">
                <td style="text-align: center;font-weight: bold">${index + 1}</td>
                <td style="text-align: center;font-weight: bold">${item.loaihanghoa}</td>
                <td style="text-align: center">${item.nguoncap}</td>
                <td style="text-align: center">${item.mark}</td>
                <td style="text-align: center;font-weight: bold">${item.kho}</td>
                <td style="text-align: center;font-weight: bold">${item.tongsoluongbangiao}</td>
                <td style="text-align: center;"><input type="number" style="text-align:center" min="1" value="0" max="${item.tongsoluongbangiao}" /></td>
                <td><button style="text-align: center;width: 100%;padding: 2px" class="btn btn-success export" title="Th??m v??o danh s??ch thu h???i"><i class="fas fa-sync"></i></i></button></td>
                </tr>
            `)
          })
        };

        if(data && data.hanghoaCoSeriBangiao.length > 0){
          data.hanghoaCoSeriBangiao.forEach((item, index) => {
            $('#table-body').append(`
            <tr id="${item._id}" class="seri">
              <td style="text-align: center;font-weight: bold">${data.hanghoaNoneSeriBangiao.length + index +  1}</td>
              <td style="text-align: center;font-weight: bold">${item.loaihanghoa}</td>
              <td style="text-align: center">${item.nguoncap}</td>
              <td style="text-align: center">${item.mark}</td>
              <td style="text-align: center;font-weight: bold">${item.kho}</td>
              <td style="text-align: center;font-weight: bold">${item.tongsoluongbangiao}</td>
              <td style="text-align: center;"><input type="number" style="text-align:center" min="1" value="0" max="${item.tongsoluongbangiao}" /></td>
              <td><button style="text-align: center;width: 100%;padding: 2px" class="btn btn-success export" title="Th??m v??o danh s??ch thu h???i"><i class="fas fa-sync"></i></button></td>
            </tr>
            `)
          })
        };

      table = $("#table").DataTable({
          lengthMenu: [10],
          // "scrollY": "400px",
          "scrollCollapse": true,
          // "paging": false,
          // searching: false,
          language: {
          search: "T??m ki???m",
          sInfoEmpty: "",
          sEmptyTable: "Kh??ng c?? d??? li???u h??ng h??a ???? b??n giao",
          sInfoFiltered: "",
          sInfo: "",
          sLengthMenu: "",
          },
          destroy: true, // cho ph??p h???y b??? table t???o table m???i v???i c??ng id table
      });

        // $('#khobandau').html($('#khoxuathang option:selected').text());
    });

    let table1;
    table1 = $("#table1").DataTable({
      lengthMenu: [100000000000],
      "scrollY": "400px",
      "scrollCollapse": true,
      "paging": false,
      language: {
        search: "T??m ki???m",
        sInfoEmpty: "",
        sEmptyTable: "Kh??ng c?? d??? li???u h??ng h??a thu h???i",
        sInfoFiltered: "",
        sInfo: "T???ng c???ng  _TOTAL_ lo???i h??ng h??a thu h???i",
        sLengthMenu: "",
      },
      destroy: true, // cho ph??p h???y b??? table t???o table m???i v???i c??ng id table
    });

    const addRowNoneSeri = (newItem) => {
        table1.row
          .add([
            function (data, type, dataToSet) {
              return `<p class="loaihanghoa" id="${newItem.idHanghoa}" style="text-align: center">${newItem.loaihanghoa}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="nguoncap" style="text-align: center">${newItem.nguoncap}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="seri" id='no-seri' style="text-align:center">${newItem.mark}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center">${newItem.kho}</p>`;
            },
            function (data, type, dataToSet) {
              return `<input class="soluong" style="text-align:center" type="number" max="${newItem.tongsoluong}" min="0" value='${newItem.soluongthuhoi}'/>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center"><button class="btn1 btn-delete delete-row" title="X??a"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
            },
          ])
          .draw();
    };

    const addRowCoSeri = (newItem) => {
        table1.row
          .add([
            function (data, type, dataToSet) {
              return `<p class="loaihanghoa" id="${newItem.idHanghoa}" style="text-align: center">${newItem.loaihanghoa}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="nguoncap" style="text-align: center">${newItem.nguoncap}</p>`;
            },
            function (data, type, dataToSet) {
              return `<p class="seri" id='co-seri' style="text-align:center">${newItem.mark}</p>`
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center">${newItem.kho}</p>`;
            },
            function (data, type, dataToSet) {
              return `<input class="soluong" style="text-align:center" max="${newItem.tongsoluong}" type="number" min="0" value='${newItem.soluongthuhoi}'/>`;
            },
            function (data, type, dataToSet) {
              return `<p style="text-align: center"><button class="btn1 btn-delete delete-row" title="X??a"><i class="far fa-trash-alt btn-icon"></i></button></p>`;
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
        let kho = row[0].cells[4].innerText
        let tongsoluong = row[0].cells[5].innerText
        let soluongthuhoi= row[0].cells[6].children[0].value
        let data = {
            idHanghoa,loaihanghoa,nguoncap,mark,tongsoluong,soluongthuhoi,kho
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
      await axios.post(`/quan-tri/${id}/thu-hoi`,data)
    };

    $("#export").on("submit", async function (e) {
        e.preventDefault();
        var tb = $("#table1 tbody");
        
        let hanghoaNoneSeri = [];
        let hanghoaCoSeri = [];

        let thoigianthuhoi = $("#thoigianthuhoi").val();
        let canbothuhoi = $("#canbothuhoi").val();
        let canbobangiao = $("#canbobangiao").val();
        let donvi = $("#donvi").val();
        let khothuhoi = $("#khothuhoi").val();
        let ghichu = $("#ghichu").val();
       
        tb.find("tr").each(function (index, element) {
          if(element.cells[0].children[0]){
            let idHanghoa = element.cells[0].children[0].getAttribute("id");
            let checkedSeri = element.cells[2].children[0].getAttribute("id");
            let soluong = element.cells[4].children[0].value;
            if(checkedSeri === 'co-seri'){
              hanghoaCoSeri.push({idHanghoa,soluong})
          }else{
              hanghoaNoneSeri.push({idHanghoa,soluong})
            }
          }
        });
        let data = {
          thoigianthuhoi,canbothuhoi,canbobangiao,ghichu,
          hanghoaCoSeri,hanghoaNoneSeri,donvi, khothuhoi
        }
        // console.log(hanghoaNoneSeri)
        // console.log(data)
        await exportKho(data);
        $('#addForm')[0].reset();
        $('#export')[0].reset();

        table1 = $("#table1").DataTable({
            lengthMenu: [100000000000000000000000000],
            searching: false,
            paging: false,
            data: [],
            language: {
            search: "T??m ki???m",
            sInfoEmpty: "",
            sEmptyTable: "Kh??ng c?? d??? li???u h??ng h??a thu h???i",
            sInfoFiltered: "",
            sInfo: "T???ng c???ng  _TOTAL_ lo???i h??ng h??a thu h???i",
            sLengthMenu: "",
            },
            destroy: true, // cho ph??p h???y b??? table t???o table m???i v???i c??ng id table
        });
        
        $("#table").DataTable({
            lengthMenu: [10],
            searching: false,
            data: [],
            language: {
            search: "T??m ki???m",
            sInfoEmpty: "",
            sEmptyTable: "Kh??ng c?? d??? li???u h??ng h??a thu h???i",
            sInfoFiltered: "",
            sInfo: "T???ng c???ng  _TOTAL_ lo???i h??ng h??a thu h???i",
            sLengthMenu: "",
            },
            destroy: true, // cho ph??p h???y b??? table t???o table m???i v???i c??ng id table
        });

        toast('Thu h???i th??nh c??ng')
    });
    
    const fetchDonviTructhuoc = async (id1) => {
      let res = await axios.get(`/quan-tri/${id}/don-vi-truc-thuoc/${id1}/fetch`);
      return res.data
    };

    const fetchLoaihanghoa = async (id1) => {
      let res = await axios.get(`/quan-tri/${id}/ten-loai-hang-hoa/${id1}/fetch`);
      return res.data
    };

    $('#donvi').on('change', async function(){
      let id1 = $(this).val();

      $('#donvitiepnhan').html('')
      let data = await fetchDonviTructhuoc(id1);
      $('#donvitiepnhan').append(`
        <option value="">-- Ch???n t???t c??? --</option>
      `)
      if(data && data.length > 0){
        data.forEach(i => {
          $('#donvitiepnhan').append(`
            <option value="${i._id}">${i.tendonvi}</option>
          `)
        })
      }
    });

    $('#danhmuc').on('change', async function(){
      let id1 = $(this).val();
      $('#loaihanghoa').html('');
      let data;
      if(id1 !== ''){
        let data = await fetchLoaihanghoa(id1);
    }
      $('#loaihanghoa').append(`
        <option value="">-- Ch???n t???t c??? --</option>
      `);

      if(data && data.length > 0){
        data.forEach(i => {
          $('#loaihanghoa').append(`
            <option value="${i._id}">${i.tenloaihanghoa}</option>
          `)
        })
      }
    });


  });
  