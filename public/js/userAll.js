!function(){var t=$(".article-btn"),e=$(".article"),n=($(".posted_edit"),$(".title-item")),r=$(".operation-group .edit"),i=($(".operation-group .delete"),$("<div></div>"),$("#articleId").val()),a=function(t){$.ajax({type:"get",url:t,cache:!0,success:function(t){return"string"==typeof t?!1:($(".popover").remove(),e.html('<h1 class="t-c">'+t.title+"</h1>"+t.post),r.prop("href","/edit/"+t._id),i=t._id,void 0)}})};t.click(function(){var t=$(this).data("id"),e=$(this).data("name"),r="/posted/"+e+"/"+t;n.removeClass("active"),$(this).parent("div").addClass("active"),a(r)}),$(".delete").click(function(){var t="/delete/"+i;console.log(t),$.ajax({type:"post",url:t,success:function(){location.reload()}})})}();