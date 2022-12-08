$(document).ready(async()=> {

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
      //Phân trang
      let page2 = 1;
      let perPage2 = 10;
      let start2 = (page2 - 1) * perPage2;
      let end2 = page2 * perPage2;
      let totalPage2 = 0;

        const searchLichsu = async (data) => {
            try {
              let res = await axios.get(`/quan-tri/${id}/lich-su-xuat-kho/search`, {
                params: data,
              });
        
              dataRender2 = res.data;
              paginated(dataRender2, 1);     
           
            } catch (error) {
              console.log(error.message);
            }
          };

          $("#addForm").on("submit", async (e) => {
            e.preventDefault();
            $('.spinner').addClass('visiable');
            $('.spinner').fadeIn();
            let formData = new FormData(e.target);
            const json = JSON.stringify(Object.fromEntries(formData));
            const data = JSON.parse(json);
            await searchLichsu(data);
            $('.spinner').removeClass('visiable');
            $('.spinner').fadeOut();
          });

          const paginated = (dataRender2, page2) => {
            page2 = parseInt(page2);
            totalPage2 = Math.ceil(dataRender2.length / perPage2);
            start2 = (page2 - 1) * perPage2;
            end2 = page2 * perPage2;
            result = dataRender2.slice(start2, end2);
            $("#total").html(dataRender2.length);
            $("#bang2").html("");
            if (dataRender2.length > 0) {
              result.forEach((item, index) => {
                let thoigian = item.timeNumber.toString().slice(8, 10) + 'h:' +
                item.timeNumber.toString().slice(10, 12) + 'phút ' +
                item.timeNumber.toString().slice(6, 8) + '/' +
                item.timeNumber.toString().slice(4, 6) + '/' +
                item.timeNumber.toString().slice(0, 4)
                $("#bang2").append(`
                                    <tr id="${item._id}">
                                        <td style="text-align: center">${(page2 - 1) * perPage2 + index + 1}</td>
                                        <td style="font-weight:bold;text-align: center;color: red">${thoigian}</td>
                                        <td style="font-weight:bold;text-align: center">${item.donvitiepnhan.tendonvi}</td>
                                        <td style="text-align: center">${item.canboxuatkho}</td>
                                        <td style="text-align: center">${item.canbotiepnhan}</td>
                                        <td style="text-align: center;">${item.ghichu}</td>
                                        <td style="text-align: center">
                                        <button class="btn1 btn-edit"><a href="/quan-tri/${id}/xuat-kho/chi-tiet/${item._id}" target="blank"><i class="far fa-eye btn-icon" title="Xem chi tiết""></i></a></button>
                                        <button class="btn1 btn-edit"><a href="/quan-tri/${id}/chinh-sua-xuat-kho/${item._id}"><i class="far fa-edit btn-icon" title="Chỉnh sửa"></i></a></button>
                                          <button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn1 btn-delete"><i class="fas fa-trash btn-icon" title="Xóa"></i></button>
                                        </td>
                                        </tr>
                                `);
              });
            }
            // Check điều kiện trang đầu tiên
            if (totalPage2 == 0) {
              $("#pagination2").html("");
            } else if (page2 == 1 && totalPage2 == 1) {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                    <ul class="pagination">
                                        <li class="page-item2  page-current2"><a class="page-link" href="#">1</a></li>
                                    </ul>
                                `);
            } else if (page2 == 1 && totalPage2 == 2) {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                    <ul class="pagination">
                                        <li class="page-item2  page-current2"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item2"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item2-next2">
                                            <a class="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    </ul>
                                `);
            } else if (page2 == 1 && totalPage2 > 2) {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                    <ul class="pagination">
                                        <li class="page-item2  page-current2"><a class="page-link" href="#">1</a></li>
                                        <li class="page-item2"><a class="page-link" href="#">2</a></li>
                                        <li class="page-item2"><a class="page-link" href="#">3</a></li>
                                        <li class="page-item2-next2">
                                            <a class="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    </ul>
                                `);
            } else if (page2 == totalPage2 && page2 > 2) {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                <ul class="pagination">
                                    <li class="page-item2-prev2">
                                        <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    <li class="page-item2"><a class="page-link" href="#">${
                                      page2 - 2
                                    }</a></li>
                                    <li class="page-item2"><a class="page-link" href="#">${
                                      page2 - 1
                                    }</a></li>
                                    <li class="page-item2 page-current2"><a class="page-link" href="#">${page2}</a></li>
                                </ul>
                                `);
            } else if (page2 == totalPage2 && page2 <= 2) {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                <ul class="pagination">
                                    <li class="page-item2-prev2">
                                        <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    <li class="page-item2"><a class="page-link" href="#">${
                                      page2 - 1
                                    }</a></li>
                                    <li class="page-item2 page-current2"><a class="page-link" href="#">${page2}</a></li>
                                </ul>
                                `);
            } else {
              $("#pagination2").html("");
              $("#pagination2").append(`
                                <ul class="pagination">
                                <li class="page-item2-prev2">
                                    <a class="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li class="page-item2"><a class="page-link" href="#">${
                                  page2 - 1
                                }</a></li>
                                <li class="page-item2 page-current2"><a class="page-link" href="#">${page2}</a></li>
                                <li class="page-item2"><a class="page-link" href="#">${
                                  page2 + 1
                                }</a></li>
                                <li class="page-item2-next2">
                                    <a class="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                                `);
            }
          };
        
          $(document).on("click", ".page-item2.page-current2", function (event) {
            event.preventDefault();
          });
          $(document).on("click", ".page-item2:not(.page-current2)", function (event) {
            event.preventDefault();
            page2 = parseInt($(this).find(".page-link").html());
        
            paginated(dataRender2, page2);
            $(".page-current").removeClass("page-current2");
            $(this).addClass("page-current2");
          });
          $(document).on("click", ".page-item2-next2", function (event) {
            event.preventDefault();
            page2 = parseInt(page2) + 1;
            paginated(dataRender2, page2);
          });
        
          $(document).on("click", ".page-item2-prev2", function (event) {
            event.preventDefault();
            page2 = parseInt(page2) - 1;
            paginated(dataRender2, page2);
          });
        

          const fetchDonviTructhuoc = async (id1) => {
            let res = await axios.get(`/quan-tri/${id}/don-vi-truc-thuoc/${id1}/fetch`);
            return res.data
          };
      
          $('#donvi').on('change',async function(){      
            let checkedAll = $(this).val();
            if(checkedAll === ''){ // Trường hợp chọn tất cả đơn vị
                $('#donvitiepnhan').html('')
                $('#donvitiepnhan').append(`
                    <option value="">-- Tất cả --</option>
                `)
            }else{
                $('#donvitiepnhan').html('')
                let data = await fetchDonviTructhuoc(checkedAll);
        
                if(data && data.length > 0){
                    $('#donvitiepnhan').append(`
                        <option value="">-- Tất cả --</option>
                    `)
                    data.forEach(i => {
                        $('#donvitiepnhan').append(`
                        <option value="${i._id}">${i.tendonvi}</option>
                        `)
                    })
                }
            }
          })
      // Xóa lần xuất kho
      let id_Delete;
      $(document).on("click", ".btn-delete", function () {
        let row = $(this).closest("tr");
        id_Delete = row.attr("id");
      });
    
      const deleteLichsuxuatkho = async (id1) => {
        await axios.delete(`/quan-tri/${id}/lich-su-xuat-kho/${id1}`);
        $('#addForm').submit();
        toast("Xóa lần xuất kho thành công !");
      };
    
      $("#confirm").on("click", async () => {
        await deleteLichsuxuatkho(id_Delete);
        $(".close").click();
      });
      
})