$(function(){
    document.addEventListener('touchmove', function(e){
        e.preventDefault();
    }, 
    {
        passive: false
    });

    $("#coefficientToggle").on("click", function(){
        if(isShowingCoef){
            $(this).text("係数OFF");
            $(this).css("background-color", "blue");
        }else{
            $(this).text("係数ON");
            $(this).css("background-color", "#e8822a");
        }
        isShowingCoef = !isShowingCoef;
    });
});