$('#logout').click(function(e){
      e.preventDefault();
      let isLogOut = confirm('Bạn có muốn đăng xuất hay không?');
      if(isLogOut){
          window.location.href = '/quan-tri/logout'
      }
  })