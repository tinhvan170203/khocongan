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
  const login = async (data) => {
    try {
      let res = await axios.post("/quan-tri/login", data);
      
      //check điều kiện respon trả vể dựa vào status
      if(res.status === 203 || res.status ===  202){
            toast(res.data);
            return
      };
      window.location.href = res.data
    } catch (error) {
      console.log(error.message);
    }
  };
  $("#loginForm").on("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const json = JSON.stringify(Object.fromEntries(formData));
    const data = JSON.parse(json);
    await login(data);
  });
});
