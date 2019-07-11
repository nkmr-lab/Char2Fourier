var spline;
var fourierViewer;

var W = 600;
var k_MAX = 50;

function setup(){
    createCanvas( W, W );
    noFill();
    textSize(40);
    textAlign(CENTER, CENTER);

    spline = new Spline();
    fourierViewer = new FourierViewer();
}

function draw(){
    background(255);

    if( fourierViewer.p_list.length == 0 && fourierViewer.p_list2.length == 0 ){
        fill(153);
        noStroke();
        text("Draw here!!", width/4, height/4);
    }

    noStroke();
    fill(205, 222, 255);
    rect(W/2, W/2, W/2, W/2);
    fill(255, 204, 255);
    rect(0, W/2, W/2, W/2);
    fill(204, 255, 255);
    rect(W/2, 0, W/2, W/2);

    stroke(0);
    strokeWeight(1);
    line(W/2, 0, W/2, W/2);
    line(0, W/2, W/2, W/2);
    fourierViewer.draw();
}

function mousePressed(){
    fourierViewer.beginSketch();
}

function mouseDragged(){
    fourierViewer.dragSketch();
}

function mouseReleased(){
    fourierViewer.endSketch();

    for( var i = 1 ; i <= 10 ; i ++ ){
        var coefficient = fourierViewer.m_aX[i];
        var coefficient_abs = Math.abs(coefficient);
        var maxValue = coefficient_abs * 2;
        var minValue;
        /*
        if( coefficient >= 0 ){
            maxValue = coefficient * 2;
            minValue = 0;
        }else{
            maxValue = 0;
            minValue = coefficient * 2;
        }
        */

        $( "#slider"+i ).slider({
            /*
            max: maxValue,
            min: minValue,
            */
            max: maxValue,
            min: 0,
            value: coefficient_abs,
            step: coefficient_abs/10,
            slide: function(){
                if( coefficient >= 0 ){
                    fourierViewer.m_aX[i] = $(this).slider("value");
                }else{
                    fourierViewer.m_aX[i] = - $(this).slider("value");
                }
                console.log(fourierViewer.m_aX);
                fourierViewer.restorePoints();
            }
        });
    }
}

function Point( x, y ){
    this.x = x;
    this.y = y;
}