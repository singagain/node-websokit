define(function() {
          var detailExplain = function(){
              $(".icon-yellow-error ").find(".fc-org-text").mouseenter(function(){
                console.log($(this));
                $(this).find(".layer-tip-yellow-top").css("display","block");
              }).mouseleave(function(){
                $(this).find(".layer-tip-yellow-top").css("display","none");
              })
              $(".js-tip-icon4 ").mouseenter(function(){
                $(this).find(".layer-tip").css("display","block");
              }).mouseleave(function(){
                $(this).find(".layer-tip").css("display","none");
                console.log($(this));
              })


              var  showExplain = function(node1,node2) {
                node1.mouseenter(function(){
                  node2.css("display","block");
                }).mouseleave(function(){
                  node2.css("display","none");
                  console.log($(this));
                })
              }
              showExplain($(".js-tip-icon1"),$(".js-layer-tip1"));
              showExplain($(".js-tip-icon3"),$(".js-layer-tip3"));
              showExplain($(".js-askcar1"),$(".js-askcar1 span"));
              var node2 = $(this).find("span");
              showExplain($(".js-askcar"),$(".js-askcar span"));
              showExplain($(".js-tip-icon"),$(".js-layer-tip2"));
          }
          return{
            detailExplain:detailExplain
          }
})
