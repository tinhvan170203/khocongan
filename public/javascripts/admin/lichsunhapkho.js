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
              let res = await axios.get(`/quan-tri/${id}/lich-su-nhap-kho/search`, {
                params: data,
              });
              dataRender2 = res.data.lichsunhapkhoList;
              paginated(dataRender2, 1);     
            $("#tonghanghoa").html(res.data.tongsohang);
            } catch (error) {
              console.log(error.message);
            }
          };

          $("#addForm").on("submit", async (e) => {
            e.preventDefault();
            let formData = new FormData(e.target);
            const json = JSON.stringify(Object.fromEntries(formData));
            const data = JSON.parse(json);
            await searchLichsu(data);
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
                let thoigian = item.thoigiannhapkho.slice(11, 13) + 'h:' +
                item.thoigiannhapkho.slice(14, 16) + 'phút ' +
                item.thoigiannhapkho.slice(8, 10) + '/' +
                item.thoigiannhapkho.slice(5, 7) + '/' +
                item.thoigiannhapkho.slice(0, 4)
                $("#bang2").append(`
                                    <tr id="${item._id}">
                                        <td style="text-align: center">${(page2 - 1) * perPage2 + index + 1}</td>
                                        <td style="font-weight:bold;text-align: center">${item.kho.tenkho}</td>
                                        <td style="font-weight:bold;text-align: center">${thoigian}</td>
                                        <td style="font-weight:bold;text-align: center">${item.canbonhapkho}</td>
                                        <td style="font-weight:bold;text-align: center;color:red">${item.tongsoluonghangnhap}</td>
                                        <td style="text-align: center"><button class="btn1 btn-edit"><a href="/quan-tri/${id}/chinh-sua-lich-su-nhap-kho/${item._id}"><i class="fas fa-pen-alt btn-icon" title="Sửa"></i></a></button>
                                        <button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn1 btn-delete"><i class="fas fa-trash btn-icon" title="Xóa"></i></button></td>
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
        

           // Xóa lần nhập kho kho
      let id_Delete;
      $(document).on("click", ".btn-delete", function () {
        let row = $(this).closest("tr");
        id_Delete = row.attr("id");
        console.log(id_Delete)
      });
    
      const deleteLichsunhapkho = async (id1) => {
        await axios.delete(`/quan-tri/${id}/lich-su-nhap-kho/${id1}`);
        $('#addForm').submit();
        toast("Xóa lần nhập kho thành công !");
      };
    
      $("#confirm").on("click", async () => {
        await deleteLichsunhapkho(id_Delete);
        $(".close").click();
      });
      
})