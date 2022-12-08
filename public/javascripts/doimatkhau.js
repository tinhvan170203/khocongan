$(document).ready(async () => {
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
      const changePass = async (data) => {
        try {
          let res = await axios.post("/quan-tri/doi-mat-khau", data);
          
          //check điều kiện respon trả vể dựa vào status
          if(res.status === 203 || res.status ===  202){
                toast(res.data);
                return
          };
          toast('Đổi mật khẩu thành công! Quay trở lại trang đăng nhập sau 1s')
          setTimeout(()=>{
            window.location.href = "/quan-tri/login"
          },1000)
        } catch (error) {
          console.log(error.message);
        }
      };
      $("#loginForm").on("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const json = JSON.stringify(Object.fromEntries(formData));
        const data = JSON.parse(json);
        await changePass(data);
      });
    });
    