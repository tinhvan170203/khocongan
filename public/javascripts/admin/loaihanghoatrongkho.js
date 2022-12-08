$(document).ready(async()=> {
    const id = $('.main-top').attr('id');

  var checkboxFullItem_Edit = $('input[name="checkFullItem_Edit"]')
  var checkboxItemRole_Edit = $('.item-role_Edit');


  checkboxFullItem_Edit.change(function() { //checkFullItem thay đổi 
      
      //các checkbox con bên trong nó từng item-role bên trong checkFullItem
      let isCheckItem = $(this).prop('checked')
      let checkboxItem = $(this).closest('li').find('.item-role_Edit');
      checkboxItem.prop('checked', isCheckItem);
  });

  checkboxItemRole_Edit.change(function() { //thay đổi check của item-role
      let ulNode = $(this).closest('ul');
      let isCheckItemAll = ulNode.find('.item-role_Edit').length === ulNode.find('.item-role_Edit:checked').length
      let checkFullItem = ulNode.closest('li').find('input[name="checkFullItem_Edit"]');
      checkFullItem.prop('checked', isCheckItemAll) //thay đổi checkbox của checkFullItem   
  });


  let id_kho = null;
  const addTrongkho = async (data) => {
    try {
     await axios.post(`/quan-tri/${id}/loai-hang-hoa-trong-kho/${id_kho}/save`, data);
      toast(`Lưu các loại hàng hóa có chứa trong kho thành công !`);
    } catch (error) {
      console.log(error.message);
    }
  };
   
  $("#addForm").on("submit", async (e) => {
    id_kho = $('#kho').val()
    e.preventDefault();
    let data = [];
    $('.item-role_Edit:checked').each(function() {
        data.push($(this).val())
    });
    await addTrongkho(data);
  });
})