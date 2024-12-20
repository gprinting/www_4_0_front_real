var monoYn = null;
var prdtDvs = null;
var sortcode = null;
var cateName = null;
var amtUnit = null;

$(document).ready(function () {

});


/**
 * @brief 화면에 출력되는 가격 및 빠른견적서 내용 수정
 *
 * @param flag = 옵션가격 재검색 후 무한루프방지
 */
var calcPrice = function (flag) {

};

    
var setSubmitParam = function() {
    


    return true;

};

/**
 * @brief 관심상품 등록이나 장바구니 전에 데이터 세팅
 */
var setEstimateSubmitParam = function (opt, cal) {

    $frm = $("#frm");

    let paperName = "아트지";

    $frm.find("input[name='dt_cate_name']").val(cateName);
    $frm.find("input[name='dt_amt_unit']").val(amtUnit);
    $frm.find("input[name='dt_paper_name']").val(paperName);
    //$frm.find("input[name='dt_bef_tmpt_name']").val(tmptName);
    //$frm.find("input[name='dt_size_name']").val(sizeName);

    //$frm.find("input[name='dt_sell_price']").val(sellPrice);
    //$frm.find("input[name='dt_sale_price']").val(salePrice);
    //$frm.find("input[name='dt_after_price']").val(afterPrice);
    //$frm.find("input[name='opt_price']").val(optPrice);



    //--------------- order_detail 정보 값 정의 /s -----------------/

    var work_size_wid = opt.work_width.value; //작업사이즈 가로
    var work_size_vert = opt.work_length.value; //작업사이즈 세로
    var cut_size_wid = opt.cut_width.value; //재단사이즈 가로
    var cut_size_vert = opt.cut_length.value;; //재단사이즈 세로
    var receipt_size_wid = work_size_wid; //접수사이즈 가로
    var receipt_size_vert = work_size_vert; //접수사이즈 세로

    var printing_color_options = JSON.parse(opt.printing_color.options);
    var spot_color_options = JSON.parse(opt.spot_color.options);
    
     //인쇄_도수_이름  전면 / 후면 / 추가
    var print_tmpt_name = "전면 " + printing_color_options.front + "/ 후면 " + printing_color_options.back;
    if(spot_color_options.color_amount > 0) {
        print_tmpt_name += " / 추가 " + spot_color_options.color_amount;
    }

    var spc_dscr = ""; //별색설명
    var print_purp_dvs = "디지털인쇄"; //인쇄용도
    var side_dvs = (printing_color_options.side == 2) ? "양면" : "단면"; //면_구분 양면/단면
    var tomson_yn = "N"; //도무송여부
    var typset_way = ""; //조판방식 ( MOAMOA / CYPRESS )
    var tot_tmpt = parseInt(printing_color_options.color_amount) + parseInt(spot_color_options.color_amount); //인쇄도수


    $("#work_size_wid").val(work_size_wid); //작업사이즈 가로
    $("#work_size_vert").val(work_size_vert); //작업사이즈 세로
    $("#cut_size_wid").val(cut_size_wid); //재단사이즈 가로
    $("#cut_size_vert").val(cut_size_vert); //재단사이즈 세로
    $("#receipt_size_wid").val(receipt_size_wid); //접수사이즈 가로
    $("#receipt_size_vert").val(receipt_size_vert); //접수사이즈 세로
    $("#print_tmpt_name").val(print_tmpt_name); //인쇄_도수_이름  전면 / 후면 / 추가
    $("#spc_dscr").val(spc_dscr); //별색설명
    $("#print_purp_dvs").val(print_purp_dvs); //인쇄용도
    $("#side_dvs").val(side_dvs); //면_구분 양면/단면
    $("#tomson_yn").val(tomson_yn); //도무송여부
    $("#typset_way").val(typset_way); //조판방식 ( MOAMOA / CYPRESS )
    $("#tot_tmpt").val(tot_tmpt); //인쇄도수

    //--------------- order_detail 정보 값 정의 /e -----------------/




    //---------- 후가공정보 order_after_history 정보 값 정의 /s ------------/

    var arr_after_code = [];
    var arr_after_name = [];
    var arr_after_depth1 = [];
    var arr_after_depth2 = [];
    var arr_after_depth3 = [];
    var arr_after_detail = [];
    var arr_after_info = [];
    var arr_after_price = [];

    //console.log('cal', cal);

    //접지
    if(typeof opt.postpress.folding !== "undefined") {
        
        var folding_type = opt.postpress.folding.folding_type.name;
        var folding_direction = opt.postpress.folding.folding_direction.name;
        var folding_detail = folding_type + ' - ' + folding_direction;

        arr_after_code.push('foldline');
        arr_after_name.push('접지');
        arr_after_depth1.push(folding_type);
        arr_after_depth2.push(folding_direction);
        arr_after_depth3.push('');
        arr_after_detail.push(folding_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.folding.price);

    }

    //오시
    if(typeof opt.postpress.scoring !== "undefined") {
        
        var score_line = opt.postpress.scoring.score_line.name;
        var score_direction = opt.postpress.scoring.score_direction.name;
        var scoring_detail = score_line + ' - ' + score_direction;

        arr_after_code.push('impression');
        arr_after_name.push('오시');
        arr_after_depth1.push(score_line);
        arr_after_depth2.push(score_direction);
        arr_after_depth3.push('');
        arr_after_detail.push(scoring_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.scoring.price);

    }

    //미싱
    if(typeof opt.postpress.perforating !== "undefined") {

        var perforate_line = opt.postpress.perforating.perforate_line.name;
        var perforate_direction = opt.postpress.perforating.perforate_direction.name;
        var perforate_detail = perforate_line + ' - ' + perforate_direction;

        arr_after_code.push('dotline');
        arr_after_name.push('미싱');
        arr_after_depth1.push(perforate_line);
        arr_after_depth2.push(perforate_direction);
        arr_after_depth3.push('');
        arr_after_detail.push(perforate_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.perforating.price);

    }

    //박
    if(typeof opt.postpress.foiling !== "undefined") {
        
        var order_section = opt.postpress.foiling.order_section.name;
        var foil_position = opt.postpress.foiling.foil_position.name;
        var foil_type = opt.postpress.foiling.foil_type.name;
        var foil_area = opt.postpress.foiling.foil_area.name;
        var foil_width = opt.postpress.foiling.foil_width.name;
        var foil_length = opt.postpress.foiling.foil_length.name;
        var foil_detail = order_section + ' ' + foil_position + ' ' + foil_type + ' ' + foil_area + ' ' + foil_width + ' ' + foil_length;

        arr_after_code.push('foil');
        arr_after_name.push('박');
        arr_after_depth1.push(foil_type);
        arr_after_depth2.push(foil_area);
        arr_after_depth3.push(foil_width + ' * ' + foil_length);
        arr_after_detail.push(foil_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.foiling.price);

        if(opt.postpress.foiling2){
            
            var order_section2 = opt.postpress.foiling2.order_section.name;
            var foil_position2 = opt.postpress.foiling2.foil_position.name;
            var foil_type2 = opt.postpress.foiling2.foil_type.name;
            var foil_area2 = opt.postpress.foiling2.foil_area.name;
            var foil_width2 = opt.postpress.foiling2.foil_width.name;
            var foil_length2 = opt.postpress.foiling2.foil_length.name;
            var foil_detail2 = order_section2 + ' ' + foil_position2 + ' ' + foil_type2 + ' ' + foil_area2 + ' ' + foil_width2 + ' ' + foil_length2;
    
            arr_after_code.push('foil');
            arr_after_name.push('박');
            arr_after_depth1.push(foil_type2);
            arr_after_depth2.push(foil_area2);
            arr_after_depth3.push(foil_width2 + ' * ' + foil_length2);
            arr_after_detail.push(foil_detail2);
            arr_after_info.push('');
            arr_after_price.push(cal.foiling2.price);

        }

        if(opt.postpress.foiling3){
        
            var order_section3 = opt.postpress.foiling3.order_section.name;
            var foil_position3 = opt.postpress.foiling3.foil_position.name;
            var foil_type3 = opt.postpress.foiling3.foil_type.name;
            var foil_area3 = opt.postpress.foiling3.foil_area.name;
            var foil_width3 = opt.postpress.foiling3.foil_width.name;
            var foil_length3 = opt.postpress.foiling3.foil_length.name;
            var foil_detail3 = order_section3 + ' ' + foil_position3 + ' ' + foil_type3 + ' ' + foil_area3 + ' ' + foil_width3 + ' ' + foil_length3;
    
            arr_after_code.push('foil');
            arr_after_name.push('박');
            arr_after_depth1.push(foil_type3);
            arr_after_depth2.push(foil_area3);
            arr_after_depth3.push(foil_width3 + ' * ' + foil_length3);
            arr_after_detail.push(foil_detail3);
            arr_after_info.push('');
            arr_after_price.push(cal.foiling3.price);

        }

    }

    //형압
    if(typeof opt.postpress.pressing !== "undefined") {

        var order_section = opt.postpress.pressing.order_section.name;        
        var press_type = opt.postpress.pressing.press_type.name;
        var press_area = opt.postpress.pressing.press_area.name;
        var press_width = opt.postpress.pressing.press_width.name;
        var press_length = opt.postpress.pressing.press_length.name;
        var press_detail = order_section + ' ' + press_type + ' ' + press_area + ' ' + press_width + ' ' + press_length;

        arr_after_code.push('press');
        arr_after_name.push('형압');
        arr_after_depth1.push(press_type);
        arr_after_depth2.push(press_area);
        arr_after_depth3.push(press_width + ' * ' + press_length);
        arr_after_detail.push(press_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.pressing.price);

        if(opt.postpress.pressing2) {

            var order_section2 = opt.postpress.pressing2.order_section.name;        
            var press_type2 = opt.postpress.pressing2.press_type.name;
            var press_area2 = opt.postpress.pressing2.press_area.name;
            var press_width2 = opt.postpress.pressing2.press_width.name;
            var press_length2 = opt.postpress.pressing2.press_length.name;
            var press_detail2 = order_section2 + ' ' + press_type2 + ' ' + press_area2 + ' ' + press_width2 + ' ' + press_length2;
    
            arr_after_code.push('press');
            arr_after_name.push('형압');
            arr_after_depth1.push(press_type2);
            arr_after_depth2.push(press_area2);
            arr_after_depth3.push(press_width2 + ' * ' + press_length2);
            arr_after_detail.push(press_detail2);
            arr_after_info.push('');
            arr_after_price.push(cal.pressing2.price);

        }

        if(opt.postpress.pressing3) {

            var order_section3 = opt.postpress.pressing3.order_section.name;        
            var press_type3 = opt.postpress.pressing3.press_type.name;
            var press_area3 = opt.postpress.pressing3.press_area.name;
            var press_width3 = opt.postpress.pressing3.press_width.name;
            var press_length3 = opt.postpress.pressing3.press_length.name;
            var press_detail3 = order_section3 + ' ' + press_type3 + ' ' + press_area3 + ' ' + press_width3 + ' ' + press_length3;
    
            arr_after_code.push('press');
            arr_after_name.push('형압');
            arr_after_depth1.push(press_type3);
            arr_after_depth2.push(press_area3);
            arr_after_depth3.push(press_width3 + ' * ' + press_length3);
            arr_after_detail.push(press_detail3);
            arr_after_info.push('');
            arr_after_price.push(cal.pressing3.price);

        }

    }

    //도무송
    if(typeof opt.postpress.diecutting !== "undefined") {

        var order_section = opt.postpress.diecutting.order_section.name;
        var diecut_type = opt.postpress.diecutting.diecut_type.name;
        var diecut_number = opt.postpress.diecutting.diecut_number.name;
        var diecut_detail = order_section + ' - ' + diecut_type + ' - ' + diecut_number;

        arr_after_code.push('thomson');
        arr_after_name.push('도무송');
        arr_after_depth1.push(order_section);
        arr_after_depth2.push(diecut_type);
        arr_after_depth3.push(diecut_number);
        arr_after_detail.push(diecut_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.diecutting.price);

    }

    //코팅
    if(typeof opt.postpress.coating !== "undefined") {

        var coating_type = opt.postpress.coating.coating_type.name;
        var coating_detail = coating_type;

        arr_after_code.push('coating');
        arr_after_name.push('코팅');
        arr_after_depth1.push(coating_type);
        arr_after_depth2.push('');
        arr_after_depth3.push('');
        arr_after_detail.push(coating_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.coating.price);

    }

    //타공
    if(typeof opt.postpress.punching !== "undefined") {

        var punching_number = opt.postpress.punching.punching_number.name;
        var punching_detail = punching_number;

        arr_after_code.push('punching');
        arr_after_name.push('타공');
        arr_after_depth1.push(punching_number);
        arr_after_depth2.push('');
        arr_after_depth3.push('');
        arr_after_detail.push(punching_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.punching.price);

    }

    //접착
    if(typeof opt.postpress.gluing !== "undefined") {

        var gluing_type = opt.postpress.gluing.gluing_type.name;
        var gluing_detail = gluing_type;

        arr_after_code.push('bonding');
        arr_after_name.push('접착');
        arr_after_depth1.push(gluing_type);
        arr_after_depth2.push('');
        arr_after_depth3.push('');
        arr_after_detail.push(gluing_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.gluing.price);

    }

    //라미넥스
    if(typeof opt.postpress.laminating !== "undefined") {

        var laminating_amount = opt.postpress.laminating.laminating_amount.name;
        var laminating_detail = laminating_amount;

        arr_after_code.push('laminex');
        arr_after_name.push('라미넥스');
        arr_after_depth1.push(laminating_amount);
        arr_after_depth2.push('');
        arr_after_depth3.push('');
        arr_after_detail.push(laminating_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.laminating.price);

    }

    //에폭시
    if(typeof opt.postpress.epoxing !== "undefined") {

        var epoxy_type = opt.postpress.epoxing.epoxy_type.name;
        var epoxing_detail = epoxy_type;

        arr_after_code.push('embossing');
        arr_after_name.push('엠보싱');
        arr_after_depth1.push(epoxy_type);
        arr_after_depth2.push('');
        arr_after_depth3.push('');
        arr_after_detail.push(epoxing_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.epoxing.price);

    }

    //재단
    if(typeof opt.postpress.cutting !== "undefined") {

        var cut_type = opt.postpress.cutting.cut_type.name;
        var cut_sizetype = opt.postpress.cutting.cut_sizetype.name;
        var cut_width = opt.postpress.cutting.cut_width.name;
        var cut_length = opt.postpress.cutting.cut_length.name;
        var cut_number = opt.postpress.cutting.cut_number;
        var cutting_detail = cut_type + ' ' + cut_sizetype + '(' + cut_width + '*' + cut_length + ') ' + cut_number;

        arr_after_code.push('cutting');
        arr_after_name.push('재단');
        arr_after_depth1.push(cut_type);
        arr_after_depth2.push(cut_sizetype);
        arr_after_depth3.push(cut_width + '*' + cut_length + '-' + cut_number);
        arr_after_detail.push(cutting_detail);
        arr_after_info.push('');
        arr_after_price.push(cal.cutting.price);
    }

    var after_code = arr_after_code.join("|");
    var after_name = arr_after_name.join("|");
    var after_depth1 = arr_after_depth1.join("|");
    var after_depth2 = arr_after_depth2.join("|");
    var after_depth3 = arr_after_depth3.join("|");
    var after_detail = arr_after_detail.join("|");
    var after_price = arr_after_price.join("|");

    $("#after_code").val(after_code);
    $("#after_name").val(after_name);
    $("#after_depth1").val(after_depth1);
    $("#after_depth2").val(after_depth2);
    $("#after_depth3").val(after_depth3);
    $("#after_detail").val(after_detail);
    $("#after_price").val(after_price);

    //---------- 후가공정보 order_after_history 정보 값 정의 /e ------------/


    return true;
};

//Embed 견적서 DataLoad
window.addEventListener("message", function(e){
    
    if(e.origin == 'https://partner.gprinting.co.kr') {
        
        if(e.data.path == 'estimate') {
            
            let res = e.data.data;
            let cal = res.calculations;
            let opt = res.options;

            let sup_price = "";
            let tax_price = "";
            let fix_price = "";

            let summary = "";
            let summary_postpress = "";
            let summary_title = "";

            resizeIframe(res.documentHeight);

            //견적서 정보
            console.log('견적항목정보', res.calculations);

            let paper_price = cal.basic.raw_material.price//용지비
            let printing_price = cal.basic.printing.price//인쇄비            

            let folding_price = (typeof cal.folding !== "undefined") ? Number(cal.folding.price) : 0; //접지비
            let scoring_price = (typeof cal.scoring !== "undefined") ? Number(cal.scoring.price) : 0; //오시비
            let perforating_price = (typeof cal.perforating !== "undefined") ? Number(cal.perforating.price) : 0; //미싱비
            let foiling1_price = (typeof cal.foiling !== "undefined") ? Number(cal.foiling.price) : 0; //박비
            let foiling2_price = (typeof cal.foiling2 !== "undefined") ? Number(cal.foiling2.price) : 0; //박비2
            let foiling3_price = (typeof cal.foiling3 !== "undefined") ? Number(cal.foiling3.price) : 0; //박비3
            let pressing1_price = (typeof cal.pressing !== "undefined") ? Number(cal.pressing.price) : 0; //형압
            let pressing2_price = (typeof cal.pressing2 !== "undefined") ? Number(cal.pressing2.price) : 0; //형압2
            let pressing3_price = (typeof cal.pressing3 !== "undefined") ? Number(cal.pressing3.price) : 0; //형압3
            let diecutting_price = (typeof cal.diecutting !== "undefined") ? Number(cal.diecutting.price) : 0; //도무송
            let coating_price = (typeof cal.coating !== "undefined") ? Number(cal.coating.price) : 0; //코팅
            let punching_price = (typeof cal.punching !== "undefined") ? Number(cal.punching.price) : 0; //타공
            let gluing_price = (typeof cal.gluing !== "undefined") ? Number(cal.gluing.price) : 0; //접착비
            let laminating_price = (typeof cal.laminating !== "undefined") ? Number(cal.laminating.price) : 0; //라미넥스
            let epoxing_price = (typeof cal.epoxing !== "undefined") ? Number(cal.epoxing.price) : 0; //에폭시
            let cutting_price = (typeof cal.cutting !== "undefined") ? Number(cal.cutting.price) : 0 //재단 

            let foiling_price = foiling1_price + foiling2_price + foiling3_price;
            let pressing_price = pressing1_price + pressing2_price + pressing3_price;


            //------------------------ 빠른 견적서 값정의 /s -------------------------//


            //접지비
            if(folding_price > 0){
                $("#esti_foldline_dt").css("display","block"); 
                $("#esti_foldline").text(folding_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_foldline_dd").css("display","block"); 
            }else{
                $("#esti_foldline_dt").css("display","none"); 
                $("#esti_foldline_dd").css("display","none");
            }


            //오시비
            if(scoring_price > 0){
                $("#esti_impression_dt").css("display","block"); 
                $("#esti_impression").text(scoring_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_impression_dd").css("display","block"); 
            }else{
                $("#esti_impression_dt").css("display","none"); 
                $("#esti_impression_dd").css("display","none");
            }

            //미싱비
            if(perforating_price > 0){
                $("#esti_dotline_dt").css("display","block"); 
                $("#esti_dotline").text(perforating_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_dotline_dd").css("display","block"); 
            }else{
                $("#esti_dotline_dt").css("display","none"); 
                $("#esti_dotline_dd").css("display","none");
            }


            //박비
            if(foiling_price > 0){
                $("#esti_foil_dt").css("display","block"); 
                $("#esti_foil").text(foiling_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_foil_dd").css("display","block");      
            }else{
                $("#esti_foil_dt").css("display","none");
                $("#esti_foil_dd").css("display","none");
            }

            //형압비
            if(pressing_price > 0){
                $("#esti_press_dt").css("display","block"); 
                $("#esti_press").text(pressing_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_press_dd").css("display","block"); 
            }else{
                $("#esti_press_dt").css("display","none"); 
                $("#esti_press_dd").css("display","none");
            }

            //도무송
            if(diecutting_price > 0){
                $("#esti_thomson_dt").css("display","block"); 
                $("#esti_thomson").text(diecutting_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_thomson_dd").css("display","block"); 
            }else{
                $("#esti_thomson_dt").css("display","none"); 
                $("#esti_thomson_dd").css("display","none");
            }

            //코팅비
            if(coating_price > 0 ){
                $("#esti_coating_dt").css("display","block"); 
                $("#esti_coating").text(coating_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_coating_dd").css("display","block");  
                
            }else{
                $("#esti_coating_dt").css("display","none");
                $("#esti_coating_dd").css("display","none");  
            }

            //타공
            if(punching_price > 0){
                $("#esti_punching_dt").css("display","block"); 
                $("#esti_punching").text(punching_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_punching_dd").css("display","block");  
                
            }else{
                $("#esti_punching_dt").css("display","none");
                $("#esti_punching_dd").css("display","none");  
            }

            //접착
            if(gluing_price > 0){
                $("#esti_bonding_dt").css("display","block"); 
                $("#esti_bonding").text(gluing_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_bonding_dd").css("display","block");  
                
            }else{
                $("#esti_bonding_dt").css("display","none");
                $("#esti_bonding_dd").css("display","none");  
            }

            //라미넥스
            if(laminating_price > 0){
                $("#esti_laminex_dt").css("display","block"); 
                $("#esti_laminex").text(laminating_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_laminex_dd").css("display","block");  
                
            }else{
                $("#esti_laminex_dt").css("display","none");
                $("#esti_laminex_dd").css("display","none");  
            }

            //에폭시
            if(epoxing_price > 0){
                $("#esti_embossing_dt").css("display","block"); 
                $("#esti_embossing").text(epoxing_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_embossing_dd").css("display","block");  
                
            }else{
                $("#esti_embossing_dt").css("display","none");
                $("#esti_embossing_dd").css("display","none");  
            }

            //재단
            if(cutting_price > 0){
                $("#esti_cutting_dt").css("display","block"); 
                $("#esti_cutting").text(cutting_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_cutting_dd").css("display","block");  
                
            }else{
                $("#esti_cutting_dt").css("display","none");
                $("#esti_cutting_dd").css("display","none");  
            }



            $(".esti_paper_info").css("display", "block");
            $(".esti_print_info").css("display", "block");
            $(".esti_pan_info").css("display", "none");
            $(".esti_output_info").css("display", "none");

            $("#esti_binding_dt").css("display", "none");
            $("#esti_binding_dd").css("display", "none");


            //------------------------ 빠른 견적서 값정의 /s -------------------------//



            //------------------------ 전송 값 정의(DB처리) /s -------------------------//
            
            //합계액
            sup_price = printing_price + paper_price + folding_price + scoring_price + perforating_price + foiling_price + foiling2_price + foiling3_price + pressing_price + pressing2_price + pressing3_price + diecutting_price + coating_price + punching_price + gluing_price + laminating_price + epoxing_price + cutting_price;
            tax_price =  Math.floor((sup_price * 1.1)/10);
            tax_price = tax_price / 11 * 10 ; 
            fix_price = tax_price + Number(sup_price) ;
            fix_price = Math.floor(fix_price);
            
            $("#esti_paper").text(paper_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_print").text(printing_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_supply").text(sup_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_tax").text(tax_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_sell_price").text(fix_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_sale_price").text(0);
            $("#esti_pay_price").text(fix_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#sell_price").text(fix_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#supply_price").text(sup_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#tax").text(tax_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#sale_price").text(fix_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            
            $("#dt_sell_price").val(fix_price);

            $("#dt_bl3_sell_price").val(fix_price);
            //esti_paper

            //견적서 정보
            console.log('견적가격정보', res.total);
            
            //견적옵션 정보
            console.log('견적옵션정보', res.options);

            $("#ad_size").val(caseInSwitch(res.options.product_size.value)); 

            $("#ad_cut_wid_size").val(res.options.cut_width.value);
            $("#ad_cut_vert_size").val(res.options.cut_length.value);
            $("#ad_work_wid_size").val(res.options.work_width.value);
            $("#ad_work_vert_size").val(res.options.work_length.value);
            $("#ad_size_name").val(res.options.product_size.value);

            $("#dt_bl3_amt").val(res.options.product_amount.value); //주문수량
            $("#dt_bl3_count").val(res.options.product_quantity.value); //주문건수
            
            $("#ad_sell_price").val(fix_price);
            $("#expect_box_num").val(res.packing.box);
            $("#expec_weight").val(res.packing.weight);
            
            $("#cate_name").val("디지털낱장");
            //$("#cover_amt").val();

            //------------------------ 전송 값 정의(DB처리) /e -------------------------//

            
            
            //------------------ 주문내역 /s ----------------//
            summary += "<li>"+ opt.raw_material.name + " " + opt.product_size.name + "</li>";
            
            summary += "<li>"+ opt.printing_method.name + " " + opt.printing_color.name;
            if(opt.full_bleed.value != "none") summary += "(" + opt.full_bleed.name + ")";
            if(opt.spot_color.value != "none") summary += " " + opt.spot_color.name;
            if(opt.spotfull_bleed.value != "none") summary += "(" + opt.spotfull_bleed.name + ")";
            summary += "</li>";

            summary += "<li>"+ opt.product_amount.name + " " + opt.product_quantity.name + "</li>";

            if(folding_price > 0){
                summary_postpress += "<li>접지 : " + opt.postpress.folding.folding_type.name + " - " +  opt.postpress.folding.folding_direction.name + "</li>";
            }

            if(scoring_price > 0){
                summary_postpress += "<li>오시 : " + opt.postpress.scoring.score_line.name + " - " +  opt.postpress.scoring.score_direction.name + "</li>";
            }

            if(perforating_price > 0){
                summary_postpress += "<li>미싱 : " + opt.postpress.perforating.perforate_line.name + " - " +  opt.postpress.perforating.perforate_direction.name + "</li>";
            }

            if(foiling_price > 0){
                summary_postpress += "<li>박 : " + opt.postpress.foiling.order_section.name + " " + opt.postpress.foiling.foil_position.name + " " +  opt.postpress.foiling.foil_type.name + " " +  opt.postpress.foiling.foil_area.name + " " +  opt.postpress.foiling.foil_width.name + " " +  opt.postpress.foiling.foil_length.name + "</li>";

                if(opt.postpress.foiling2){
                    summary_postpress += "<li>박2 : " + opt.postpress.foiling2.order_section.name + " " + opt.postpress.foiling2.foil_position.name + " " +  opt.postpress.foiling2.foil_type.name + " " +  opt.postpress.foiling2.foil_area.name + " " +  opt.postpress.foiling2.foil_width.name + " " +  opt.postpress.foiling2.foil_length.name + "</li>";
                }
                if(opt.postpress.foiling3){
                    summary_postpress += "<li>박3 : " + opt.postpress.foiling3.order_section.name + " " + opt.postpress.foiling3.foil_position.name + " " +  opt.postpress.foiling3.foil_type.name + " " +  opt.postpress.foiling3.foil_area.name + " " +  opt.postpress.foiling3.foil_width.name + " " +  opt.postpress.foiling3.foil_length.name + "</li>";
                }

             }

            if(pressing_price > 0){
                
                summary_postpress += "<li>형압 : " + opt.postpress.pressing.order_section.name + " " +  opt.postpress.pressing.press_area.name + " " +opt.postpress.pressing.press_type.name + " " + opt.postpress.pressing.press_width.name + " " +opt.postpress.pressing.press_length.name + "</li>";
                
                if(opt.postpress.pressing2){
                    summary_postpress += "<li>형압2 : " + opt.postpress.pressing2.order_section.name + " " +  opt.postpress.pressing2.press_area.name + " " +opt.postpress.pressing2.press_type.name + " " + opt.postpress.pressing2.press_width.name + " " +opt.postpress.pressing2.press_length.name + "</li>";
                }
                if(opt.postpress.pressing3){
                    summary_postpress += "<li>형압3 : " + opt.postpress.pressing3.order_section.name + " " +  opt.postpress.pressing3.press_area.name + " " +opt.postpress.pressing3.press_type.name + " " + opt.postpress.pressing3.press_width.name + " " +opt.postpress.pressing3.press_length.name + "</li>";
                }

            }
            if(diecutting_price > 0){
                summary_postpress += "<li>도무송 : " + opt.postpress.diecutting.order_section.name + " - " +  opt.postpress.diecutting.diecut_type.name + " - " +  opt.postpress.diecutting.diecut_number.name + "</li>";
            }

            if(coating_price > 0){
                summary_postpress += "<li>코팅 : " + opt.postpress.coating.coating_type.name + "</li>";
            } 

            if(punching_price > 0){
                summary_postpress += "<li>타공 : " + opt.postpress.punching.punching_number.name + "</li>";
            } 

            if(gluing_price > 0){
                summary_postpress += "<li>접착 : " + opt.postpress.gluing.gluing_type.name + "</li>";
            } 

            if(laminating_price > 0){
                summary_postpress += "<li>라미넥스 : " + opt.postpress.laminating.laminating_amount.name + "</li>";
            }

            if(epoxing_price > 0){
                summary_postpress += "<li>에폭시 : " + opt.postpress.epoxing.epoxy_type.name + "</li>";
            }

            if(cutting_price > 0){
                summary_postpress += "<li>재단 : " + opt.postpress.cutting.cut_type.name + "-" + opt.postpress.cutting.cut_sizetype.name + "(" + opt.postpress.cutting.cut_width.name + "*" + opt.postpress.cutting.cut_length.name + ") " + opt.postpress.cutting.cut_number + "</li>";
            }

            //------------------ 주문내역 /e ----------------//
            


            $(".summary > dl > dd > ul").html( summary + " " + summary_postpress);
            //console.log(summary);
            summary_title = summary.replace(/<li>/g," / ").replace(/<\/li>/g,"");

            $("#order_detail").val("디지털낱장" + summary_title);

            
            //포장 정보
            //console.log('포장정보', res.packing);
            $("#expect_weight").val(res.packing.weight);
            $("#expect_box").val(res.packing.box);
            $("#expect_dlvr_price").text((res.packing.box * 3300).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));


            //견적정보 장바구니 및 관심상품 정보 값 세팅
            setEstimateSubmitParam(opt, cal);
            
            
            function caseInSwitch(val) { //
                var answer = "";
                switch (val){
                  case "A4": 
                    answer = 537;
                    break; 
                  case "A5":
                    answer = 538;
                    break;
                  case "B5":
                    answer = 539; 
                    break;
                  case "B6":
                    answer = 540; 
                    break; 
                }
                return answer;
            }

        }
    }

}, false);

function resizeIframe(documentHeight) {

    var iframe = document.getElementById("estimate-iframe");

    var height = documentHeight;

    // iframe의 높이를 설정
    iframe.style.height = height + 'px';

}