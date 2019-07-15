$(function(){
    $("#coefficientToggle").on("click", function(){
        if(isShowingCoef){
            $(this).text("係数ON");
        }else{
            $(this).text("係数OFF");
        }
        isShowingCoef = !isShowingCoef;
    });
});