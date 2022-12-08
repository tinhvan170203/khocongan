$(document).ready(function(){
      function PrintTable() {
            var printWindow = window.open('', '', 'height=200,width=400');
            printWindow.document.write('<html><head><title>In danh sách văn bản đến</title>');
     
            //Print the Table CSS.
           
            printWindow.document.write('<style>');
            printWindow.document.write(`<style>
            body{
                  font-family: 'Times New Roman', Times, serif;
            }
          @page {
            margin: 1.8cm 2cm 1.8cm 3cm;
          }
          @media print
                        {
                        table { page-break-after:auto }
                        tr    { page-break-inside:avoid; page-break-after:auto }
                        td    { page-break-inside:avoid; page-break-after:auto }
                        thead { display:table-header-group }
                        tfoot { display:table-footer-group }
                        }
          table {
                  -fs-table-paginate: paginate;
              }
            h3,h4,h5,p{
                  margin: 0;
            }
            .header{
                  display: flex;
                  justify-content: space-between;
            }
            .header-left-co-quan{
              
                  position: relative;
                  text-align: center;
                  text-transform: uppercase;
            }
            .header-left-tai-khoan::after{
                  content: '';
                  position: absolute;
                  width: 80%;
                  height: 1px;
                  bottom: -1px;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background-color: black;
            }
            .header-left-tai-khoan{
                  position: relative;
                  font-weight: bold;
                  text-transform: uppercase;
            }
            .main{
                  margin-top: 20px;
                  text-align: center;
            }
            .main-title{
                  text-align: center;
                  font-size: 14px;
                  margin-bottom: 24px;
                  font-weight: bold;
            }
            .header-right{
                  text-align: end;
            }
            .ten-phan-mem{
                  font-weight: bold;
            }
            .date{
                  font-style: italic;
            }
      </style>`);
            printWindow.document.write('</style>');
            printWindow.document.write('</head>');
            let donvi = $('.main-header-title').attr('id');
            let taikhoan = $('.account-name').text();
            const timeElapsed = new Date();
            let day = ("0" + timeElapsed.getDate()).slice(-2);
            let month = ("0" + (timeElapsed.getMonth() + 1)).slice(-2);
            let year = timeElapsed.getFullYear();
            let fromDate = $('#tungay').val()
            let toDate = $('#denngay').val()
            let data ={donvi,taikhoan,day,month,year,fromDate,toDate}
            //Print the DIV contents i.e. the HTML Table.
            printWindow.document.write('<body>');
            var divContents = bodyFnc(data, dataRender2)
            printWindow.document.write(divContents);
            printWindow.document.write('</body>');
     
            printWindow.document.write('</html>');
            printWindow.document.close();
            printWindow.print();
        }
      const bodyFnc = (data, printData) => {
            let row = `
            <div class="header">
            <div class="header-left">
                  <p class="header-left-co-quan">${data.donvi}</p>
                  <p class="header-left-tai-khoan">${data.taikhoan}</p>
            </div>
            <div class="header-right">
                  <p class="ten-phan-mem">Phần mềm chuyển nhận văn bản điện tử Công an Hà Nam</p>
                  <p class="date">Hà Nam, ngày ${data.day} tháng ${data.month} năm ${data.year}</p>
            </div>
      </div>
      <div class="main">
            <h3 class="main-title">Danh sách văn bản đến từ ngày ${data.fromDate} đến ngày ${data.toDate}</h3>
            <table class="table table-bordered">
                  <tr>
                        <th style="text-align: center">STT</th>
                        <th style="text-align: center">Số, ký hiệu</th>
                        <th style="text-align: center">Trích yếu</th>
                        <th style="text-align: center">Nơi gửi</th>
                        <th style="text-align: center">Ngày gửi</th>
                  </tr>
                  <tbody> `

            printData.forEach((item, index)=>{
                  row += `
                  <tr>
                        <td style="text-align: center">${index + 1}</td>
                        <td style="text-align: center">${item.kyhieu}</td>
                        <td>${item.trichyeu}</td>
                        <td>${item.donvigui.tenhienthi}</td>
                        <td style="text-align: center">${item.ngaygui}</td>
                  </tr>
                              `
            })
                        
            row +=`
                              </tbody>
                        </table>
                  </div>
            `
            return row
      }
})