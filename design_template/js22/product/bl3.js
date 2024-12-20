var monoYn = null;
var prdtDvs = null;
var affil = null;
var sortcode = null;
var amtUnit = null;
var cateName = null;

$(document).ready(function () {
    // 건수 초기화
    var order_count = $("#order_count").val();
    initCount(999, "count", order_count);

    monoYn = $("#bl_mono_yn").val();
    prdtDvs = $("#prdt_dvs").val();
    $("#bl_size option[value='393']").remove();
    affil = $("#bl_size").find("option:selected").attr("affil");
    sortcode = $("#bl2_cate_sortcode").val();
    cateName = $("#bl2_cate_sortcode").find("option:selected").text();
    amtUnit = $("#bl_amt").attr("amt_unit");

    $("#r_count_div").show();
    calcRCount(prdtDvs);

    var order_cut_wid = $("#order_cut_wid").val();
    var order_cut_vert = $("#order_cut_vert").val();
    var order_stan_name = $("#order_stan_nmae").val();

    $("#bl_size_name").val(order_stan_name);
    if(order_cut_wid != "" && order_cut_vert != "") {
        $("#bl_cut_wid_size").val(order_cut_wid);
        $("#bl_cut_vert_size").val(order_cut_vert);

        if(order_stan_name == "manu") {
            $("#size_dvs").val("manu");
            changeSizeDvs.exec("manu");
            size();
        }
    }

    var max = $("#bl_amt > option:last-child").val();
    aftRestrict.laminex.max = parseInt(max);
    $("#bl_laminex_max").html(max.format());

    /*
    $("input[name='chk_opt']").each(function() {
        var opt = $(this).val();

        if (opt === "당일판") {
            var idx =  $(this).attr("id").split('_')[1];
            optRestrict[opt].common(prdtDvs, idx, false);
            return false;
        }
    });
    */

   // showUvDescriptor(prdtDvs);
    //changeReleaseStr();

    var prefix = getPrefix(prdtDvs);
    var amtRate = $(prefix + "amt_sale_rate").val();
    var amtAplc = $(prefix + "amt_sale_aplc").val();
    if (checkBlank(amtRate)) {
        amtRate = 0;
    }
    if (checkBlank(amtAplc)) {
        amtAplc = 0;
    }
    loadPrdtPrice.price.amt_rate = amtRate;
    loadPrdtPrice.price.amt_aplc = amtAplc;

    loadReleaseExpect();
    showHideDayBoard();
    changeData();
});

/**
 * @brief 종이 바뀔 때 평량에 따라 규격 변경
 *
 * @param dvs = 제품구분값
 * @param val = 종이맵핑코드
 */
var changePaper = function (dvs, val) {
    var prefix = getPrefix(dvs);
    var affil = $(prefix + "size > option:selected").attr("affil");
    var posNum = $(prefix + "size > option:selected").attr("pos_num");

    changeSizeDvs.flag = false;

    $("#size_dvs").val("stan");
    $("#size_dvs").trigger("change");

    //changeReleaseStr();

    var url = "/ajax/product/load_paper_size.php";
    var data = {
        "cate_sortcode": sortcode,
        "mono_yn": $(prefix + "mono_yn").val(),
        "affil_yn": affil,
        "pos_yn": posNum,
        "size_typ_yn": 'N',
        "paper_mpcode": val
    };
    var callback = function (result) {
        $(prefix + "size").html(result);
        if (isFunc("size")) {
            size();
        }
        loadPrdtAmt(dvs);
    };

    loadPaperPreview(dvs);
    showHideDayBoard();

    ajaxCall(url, "html", data, callback);
};

/**
 * @brief 바뀐 종이와 사이즈로 수량 변경
 *
 * @param dvs = 제품구분값
 * @param val = 종이맵핑코드
 */
var loadPrdtAmt = function (dvs) {
    var prefix = getPrefix(dvs);

    var url = "/ajax/product/load_amt.php";
    var data = {
        "cate_sortcode": sortcode,
        "mono_yn": $(prefix + "mono_yn").val(),
        "amt_unit": amtUnit,
        "stan_mpcode": $(prefix + "size").val(),
        "paper_mpcode": $(prefix + "paper").val(),
        "divide" : $(prefix + "similar_size").attr("divide")
    };
    var callback = function (result) {
        $(prefix + "amt").html(result);
        calcRCount(dvs);

        var aftInfoArr = getAftInfoArr(dvs);
        var size = $(prefix + "size > option:selected").text();
        loadAfterMpcode(dvs, aftInfoArr, size);

        if (isFunc("rangeBarBySelect")) {
            rangeBarText();
        }
        changeData();
        calcLaminexMaxCount();
        //changeReleaseStr();
    };

    ajaxCall(url, "html", data, callback);
};

/**
 * @brief 계산형일 때 사이즈 선택할 경우 사이즈 계열에 맞는 도수값 검색
 *
 * @param val = 구분값
 */
var changeSize = {
    "exec": function (dvs) {
        loadPrdtAmt(dvs);
        showHideDayBoard();
    }
};

/**
 * @brief 합판전단 종이에따라 당일판 show/hide
 */
var showHideDayBoard = function () {
    var prefix = getPrefix(prdtDvs);
    var weight = $(prefix + "paper > option:selected").text().split(' ').pop();
    var idx = null;
    var $chkBox = null;
    $("input[name='chk_opt[]']").each(function (i) {
        if ($(this).val() === "당일판") {
            idx = i;
            $chkBox = $(this);
            return false;
        }
    });

    if (idx === null) {
        return false;
    }

    loadOptPrice.exec($chkBox, idx, prdtDvs);
};

var changeData = function() {
    loadDlvrPriceExpect(true, changeData1);
}

/**
 * @brief 가격 구성요소 셀렉트박스 변경시 변경된 정보로 가격 검색
 */
var changeData1 = function () {
    changeSizeDvs.flag = true;
    monoYn = $("#bl_mono_yn").val();
    var data = {
        "dvs": prdtDvs,
        "mono_yn": monoYn,
        "cate_sortcode": sortcode,
        "amt": $("#bl_amt").val(),
        "size": $("#bl_size").val(),
        "count": $("#count").val(),
        "affil": affil
    };
    data.flag = $("#frm").find("input[name='flag']").val();
    data.paper = $("#bl_paper3").val();
    data.paper_info = $("#bl_paper3 > option:selected").text()
    data.bef_tmpt = $("#bl_print_tmpt").val();
    data.bef_add_print_mpcode = '';
    data.aft_print_mpcode = '';
    data.aft_add_print_mpcode = '';
    data.print_purp = $("#bl_print_purp").val();
    data.page_info = "2";
    data.cut_wid_size = $("#bl_cut_wid_size").val();
    data.cut_vert_size = $("#bl_cut_vert_size").val();
    data.expect_box_num = $("#expect_box").val();
    data.size_name = $("#bl_size").find("option:selected").text();
    data.divide = $("#bl_similar_size").attr("divide");
    if ($("#size_dvs").val() === "manu") {
        data.size_def_val =
            $("#bl_size").attr("def_val");
        data.def_stan_name =
            $("#bl_size > option[value='" + data.size_def_val + "']").html();
        data.manu_pos_num =
            $("#manu_pos_num").val();
        data.amt_unit =
            $("#bl_amt").attr("amt_unit");
    }

    var i = 0;
    $("input[type='checkbox'][name='bl_chk_after[]']").each(function () {
        if ($(this).prop("checked") === false) {
            return true;
        }

        var aft = $(this).attr("aft");
        var aft_depth = $("#bl_" + aft).val() == undefined ? "" : $("#bl_" + aft).val();
        var aft_depth1 = $("#bl_" + aft + "_1").val() == undefined ? "" : $("#bl_" + aft + "_1").val();
        var aft_depth2 = $("#bl_" + aft + "_2").val() == undefined ? "" : $("#bl_" + aft + "_2").val();
        var aft_depth1_val = $("#bl_" + aft + "_val").val() == undefined ? "" : $("#bl_" + aft + "_val").val();
        var aft_depth1_vh = $("#bl_" + aft + "_vh").val() == undefined ? "" : $("#bl_" + aft + "_vh").val();
        var aft_depth1_cnt = $("#bl_" + aft + "_cnt").val() == undefined ? "" : $("#bl_" + aft + "_cnt").val();
        var aft_depth1_dvs = $("#bl_" + aft + "_dvs_1").val() == undefined ? "" : $("#bl_" + aft + "_dvs_1").val();
        var aft_depth2_dvs = $("#bl_" + aft + "_dvs_2").val() == undefined ? "" : $("#bl_" + aft + "_dvs_2").val();
        var aft_depth1_wid = $("#bl_" + aft + "_wid_1").val() == undefined ? "" : $("#bl_" + aft + "_wid_1").val();
        var aft_depth1_vert = $("#bl_" + aft + "_vert_1").val() == undefined ? "" : $("#bl_" + aft + "_vert_1").val();
        var aft_depth2_wid = $("#bl_" + aft + "_wid_2").val() == undefined ? "" : $("#bl_" + aft + "_wid_2").val();
        var aft_depth2_vert = $("#bl_" + aft + "_vert_2").val() == undefined ? "" : $("#bl_" + aft + "_vert_2").val();
        var selector = "input[name='" +
            'bl' + '_' + aft + '_' +
            aft_depth1_cnt +
            "_val']:checked";

        var mpcode = $(selector).val();

        if (mpcode != undefined) aft_depth1_val = mpcode;
        if (i != 0) {
            data.after_name += "|";
            data.aft_depth += "|";
            data.aft_depth1 += "|";
            data.aft_depth2 += "|";
            data.aft_depth1_val += "|";
            data.aft_depth1_vh += "|";
            data.aft_depth1_cnt += "|";
            data.aft_depth1_dvs += "|";
            data.aft_depth2_dvs += "|";
            data.aft_depth1_wid += "|";
            data.aft_depth1_vert += "|";
            data.aft_depth2_wid += "|";
            data.aft_depth2_vert += "|";
        } else {
            data.after_name = "";
            data.aft_depth = "";
            data.aft_depth1 = "";
            data.aft_depth2 = "";
            data.aft_depth1_val = "";
            data.aft_depth1_vh = "";
            data.aft_depth1_cnt = "";
            data.aft_depth1_dvs = "";
            data.aft_depth2_dvs = "";
            data.aft_depth1_wid = "";
            data.aft_depth1_vert = "";
            data.aft_depth2_wid = "";
            data.aft_depth2_vert = "";
        }
        data.aft_depth1 += aft_depth1;
        data.aft_depth2 += aft_depth2;
        data.aft_depth1_val += aft_depth1_val;
        data.aft_depth1_vh += aft_depth1_vh;
        data.aft_depth1_cnt += aft_depth1_cnt;
        data.aft_depth1_dvs += aft_depth1_dvs;
        data.aft_depth2_dvs += aft_depth2_dvs;
        data.aft_depth1_wid += aft_depth1_wid;
        data.aft_depth1_vert += aft_depth1_vert;
        data.aft_depth2_wid += aft_depth2_wid;
        data.aft_depth2_vert += aft_depth2_vert;
        if (aft == "foil") {
            data.aft_depth += $("#bl_" + aft + "_depth").val();
            data.after_name += $("#bl_" + aft + "_name").val();
        } else {
            data.after_name += aft;
            data.aft_depth += aft_depth;
        }
        i++;
    });

    i = 0;
    var j = 0;
    $("input[type='checkbox'][name='chk_opt[]']").each(function () {
        if ($(this).prop("checked") === false) {
            j++;
            return true;
        }

        var option_name = $(this).val();
        var opt_depth1 = $("#opt_" + j + "_val > option:selected").text() == undefined ? "" : $("#opt_" + j + "_val > option:selected").text();
        var opt_depth2 = "";
        var opt_depth3 = "";
        //var opt_depth2 = $("#opt_" + aft + "_1").val() == undefined ? "" : $("#ao_" + aft + "_1").val();
        //var opt_depth3 = $("#opt_" + aft + "_2").val() == undefined ? "" : $("#ao_" + aft + "_2").val();
        var opt_cnt = $("#opt_" + j + "_cnt > option:selected").val() == undefined ? "" : $("#opt_" + j + "_cnt > option:selected").val();
        var opt_mp_list = $("#opt_" + j + "_val > option:selected").val() == undefined ? "" : $("#opt_" + j + "_val > option:selected").val();

        if (i != 0) {
            data.option_name += "|";
            data.opt_depth += "|";
            data.opt_depth1 += "|";
            data.opt_depth2 += "|";
            data.opt_depth3 += "|";
            data.opt_cnt += "|";
            data.opt_mp_list += "|";
        } else {
            data.option_name = "";
            data.opt_depth = "";
            data.opt_depth1 = "";
            data.opt_depth2 = "";
            data.opt_depth3 = "";
            data.opt_cnt = "";
            data.opt_mp_list = "";
        }
        data.option_name += option_name;
        data.opt_depth1 += opt_depth1;
        data.opt_depth2 += opt_depth2;
        data.opt_depth3 += opt_depth3;
        data.opt_cnt += opt_cnt;
        data.opt_mp_list += opt_mp_list;
        j++;
        i++;
    });

    $("#after_name").val(data.after_name);
    $("#aft_depth").val(data.aft_depth);
    $("#aft_depth1").val(data.aft_depth1);
    $("#aft_depth2").val(data.aft_depth2);
    $("#aft_depth1_val").val(data.aft_depth1_val);
    $("#aft_depth1_vh").val(data.aft_depth1_vh);
    $("#aft_depth1_cnt").val(data.aft_depth1_cnt);
    $("#aft_depth1_dvs").val(data.aft_depth1_dvs);
    $("#aft_depth2_dvs").val(data.aft_depth2_dvs);
    $("#aft_depth1_wid").val(data.aft_depth1_wid);
    $("#aft_depth1_vert").val(data.aft_depth1_vert);
    $("#aft_depth2_wid").val(data.aft_depth2_wid);
    $("#aft_depth2_vert").val(data.aft_depth2_vert);

    $("#option_name").val(data.option_name);
    $("#opt_depth1").val(data.opt_depth1);
    $("#opt_depth2").val(data.opt_depth2);
    $("#opt_depth3").val(data.opt_depth3);
    $("#opt_cnt").val(data.opt_cnt);
    $("#opt_mp_list").val(data.opt_mp_list);
    $("#paper_info").val(data.paper_info);
    $("#affil").val(data.affil);
    loadPrdtPrice.data = data;
    loadPrdtPrice.exec();
};

/**
 * @brief 상품 가격정보 json으로 반환
 */
var loadPrdtPrice = {
    "data": {},
    "price": {},
    "exec": function () {
        var url = null;
        if (monoYn === '0') {
            url = "/ajax/product/load_price.php";
        } else {
            url = "/ajax/product/load_price.php";
        }
        var callback = function (result) {
            if (checkBlank(result[prdtDvs].sell_price) === true) {
                return alertReturnFalse("해당하는 가격이 존재하지 않습니다.\n관리자에게 문의하세요.");
            }
            loadPrdtPrice.price = result[prdtDvs];

            var prefix = getPrefix(prdtDvs);
            $(prefix + "prdt_price").val(result[prdtDvs].sell_price);

            $("input[name='bl_chk_after[]']:checked").each(function () {
                var $obj = $(this);
                var aft = $obj.attr('id').replace("bl_", "");
                if (aft == "foil") {
                    var totalAfterPrice = 0;
                    afterPrice = loadPrdtPrice.price["foil1"];
                    if (afterPrice) {
                        setAfterPrice("bl", "foil1", afterPrice);
                        totalAfterPrice += parseInt(afterPrice);
                    }
                    afterPrice = loadPrdtPrice.price["foil2"];
                    if (afterPrice) {
                        setAfterPrice("bl", "foil2", afterPrice);
                        totalAfterPrice += parseInt(afterPrice);
                    }
                    afterPrice = loadPrdtPrice.price["foil3"];
                    if (afterPrice) {
                        setAfterPrice("bl", "foil3", afterPrice);
                        totalAfterPrice += parseInt(afterPrice);
                    }
                    setAfterPrice("bl", "foil", totalAfterPrice);
                } else {
                    afterPrice = loadPrdtPrice.price[aft];
                    setAfterPrice("bl", aft, afterPrice);
                }
            });

            i = 0;
            var j = 0;
            $("input[type='checkbox'][name='chk_opt[]']").each(function () {
                if ($(this).prop("checked") === false) {
                    j++;
                    return true;
                }

                var $obj = $(this);
                var idx = $obj.attr('id').replace("opt_", "");
                var optPrice = loadPrdtPrice.price[$obj.val()];
                setOptPrice(idx, optPrice);
            });
            afterOverview("bl");
            calcPrice();
        };

        ajaxCall(url, "json", loadPrdtPrice.data, callback);
    }
};

/**
 * @brief 화면에 출력되는 가격 및 빠른견적서 내용 수정
 *
 * @param flag = 옵션가격 재검색 후 무한루프방지
 */
var calcPrice = function (flag) {
    // 건수
    var count = parseInt($("#count").val());
    // 특별할인
    var amtRate = parseFloat(loadPrdtPrice.price.amt_rate);
    amtRate /= 100.0;
    var amtAplc = parseInt(loadPrdtPrice.price.amt_aplc);
    // 정상판매가
    var sellPrice = loadPrdtPrice.price.sell_price;
    if (checkBlank(sellPrice)) {
        sellPrice = parseInt($("#sell_price").attr("val").replace(',', ''));
        loadPrdtPrice.price.sell_price = sellPrice;
    }
    sellPrice = ceilVal(sellPrice);
    //sellPrice *= count;
    // 등급 할인율
    var gradeSale = parseFloat($("#bl_grade_sale_rate").val());
    gradeSale /= 100.0;
    // 회원 할인율
    var memberSale = parseFloat($("#bl_member_sale_rate").val());
    memberSale /= 100.0;
    // 옵션비 총합
    var sumOptPrice = getSumOptPrice();
    sumOptPrice = ceilVal(sumOptPrice);
    // 후공정비 총합
    var sumAfterPrice = getSumAfterPrice(prdtDvs);
    sumAfterPrice = ceilVal(sumAfterPrice);

    // 견적서 종이비 계산
    var paper = 0;
    if (monoYn === '1') {
        paper = parseInt(loadPrdtPrice.price.paper);
        paper = ceilVal(paper);
        //paper *= count;
    }

    // 견적서 출력비 계산
    var output = 0;
    if (monoYn === '1') {
        output = parseInt(loadPrdtPrice.price.output);
        output = ceilVal(output);
        //output *= count;
    }

    // 견적서 인쇄비 계산
    var print = loadPrdtPrice.price.print;
    if (monoYn === '1') {
        print = parseInt(loadPrdtPrice.price.print);
        print = ceilVal(print);
        //print *= count;
    }

    // 견적서 후공정비 계산
    var after = sumAfterPrice;
    // 견적서 후공정비 계산(세금 미포함)
    var esAfter = getSumAfterPrice(prdtDvs, "T");
    // 견적서 옵션비 계산
    var opt = sumOptPrice;

    // 회원등급 할인가 계산
    var calcGradeSale = sellPrice * gradeSale;
    calcGradeSale = ceilVal(calcGradeSale);
    // 특별할인가 계산
    var calcAmtSale = (sellPrice + calcGradeSale) * amtRate + amtAplc;
    calcAmtSale = ceilVal(calcAmtSale);
    // 회원 할인가 계산
    var calcMemberSale = (sellPrice + calcGradeSale) * memberSale;
    calcMemberSale = ceilVal(calcMemberSale);
    // 기본할인가 계산
    var calcSalePrice = sellPrice + calcGradeSale + calcMemberSale + calcAmtSale;
    // 결제금액 계산
    var calcPayPrice = calcSalePrice;
    // 부가세
    var tax = ceilVal(calcPayPrice / 11);
    // 공급가
    var supplyPrice = calcPayPrice - tax;

    // 정상판매가 변경
    $("#sell_price").attr("val", (sellPrice));
    $("#sell_price").html((sellPrice).format() + ' 원');
    // 회원등급 할인가 변경
    $("#grade_sale").html((calcGradeSale + calcMemberSale).format() + ' 원');
    // 회원특별 할인가 변경
    $("#amt_member_sale").html(calcAmtSale.format() + ' 원');
    // 결제금액 변경
    $("#sale_price").attr("val", calcPayPrice);
    $("#sale_price").html(calcPayPrice.format());
    // 공급가 변경
    $("#supply_price").html(supplyPrice.format());
    // 부가세 변경
    $("#tax").html(tax.format());

    var param = {
        "paper": paper,
        "print": print,
        "output": output,
        "cut": 0,
        "afterTax": after,
        "afterNoTax": esAfter,
        "opt": opt,
        "count": count,
        "gradeSaleRate": gradeSale,
        "amtRate": amtRate,
        "amtAplc": amtAplc,
        "sellPrice": sellPrice
    };

    loadReleaseExpect();
    loadDlvrPriceExpect(flag);
    //changeQuickEsti(param);
};

/**
 * @param 인쇄방식에 해당하는 인쇄도수 검색
 *
 * @param val = 인쇄방식
 */
var loadPrintTmpt = function (dvs) {
    var callback = function (result) {
        $("#bl_print_tmpt").html(result.bef_tmpt);

        if (monoYn === '1') {
            changeData();
        }
    };

    loadPrintTmptCommon.exec(dvs, callback);
};

var changeSizeDvs2 = function() {

    var name =  $('#chgbutton').text();

    if(name == "직접입력"){
        $('#chgbutton').text("규격선택");
        changeSizeDvs.exec("manu");
        $("#size_dvs").val("manu").prop("selected", true);
    }else{
        $('#chgbutton').text("직접입력");
        changeSizeDvs.exec("stan");
        $("#size_dvs").val("stan").prop("selected", true);
    }
    size();
    
}

/**
 * @brief 비규격 사이즈 선택할 경우 재단사이즈 값 초기화
 *
 * @param val  = 구분값
 */
var changeSizeDvs = {
    "flag": true,
    "exec": function (val) {
        // 비규격 사이즈 선택시 기본 사이즈로 데이터 변경
        var prefix = getPrefix(prdtDvs);
        $(prefix + "similar_size").attr("divide", '1');

        // 비규격 사이즈 선택시 기본 사이즈로 데이터 변경
        if (val === "manu") {
            var str = $(prefix + "size > option:selected").text() + " 1/1 등분";

            $(prefix + "similar_size").show();
            $(prefix + "similar_size").html(str);
            if ($("#im").val() == "1") {
                $("#bl_size").hide();
            }
            $('#chgbutton').text("규격선택");
        } else if(val === "stan") {
            $('#chgbutton').text("직접입력");
            $(prefix + "similar_size").hide();
            calcRCount(prdtDvs);
            if ($("#im").val() == "1") {
                $("#bl_size").show();
            }
        }

        if (changeSizeDvs.flag) {
            changeData();
        }
    }
};

/**
 * @brief 수량변경시 후공정 가격 재계산 및 상품가격 재검색
 */
var changeAmt = function () {
    calcRCount(prdtDvs);
    reCalcAfterPrice(prdtDvs, null);
    changeData();
    showHideDayBoard();
    calcLaminexMaxCount();
};

/**
 * @brief 건수변경시 후공정 가격 재계산 및 상품가격 재검색
 */
var changeCount = function () {
    reCalcAfterPrice(prdtDvs, null);
    calcPrice();
}

/**
 * @brief 관심상품 등록이나 장바구니 전에 데이터 세팅
 */
var setSubmitParam = function () {
    if ($("#il").val() === "0") {
        $("#cart_flag").val('Y');
        $("#purlogin").val("1");
        showLoginBox();
        return false;
    }

    if (!aftRestrict.all(prdtDvs)) {
        return false;
    }

    var amtUnit = $("#bl_amt").attr("amt_unit");
    var paperName = $("#bl_paper").find("option:selected").text();
    if($("#bl_paper_name").val() != null) {
        paperName = $("#bl_paper_name").val() + " " + paperName;
    }

    var tmptName = $("#bl_print_tmpt").find("option:selected").text();
    var sizeName = $("#bl_size").find("option:selected").text();
    if($("#size_dvs").find("option:selected").val() == "manu") {
        sizeName = $("#bl_cut_wid_size").val() + " mm x " + $("#bl_cut_vert_size").val() + " mm";
    }

    var sellPrice = $("#sell_price").attr("val");
    var salePrice = $("#sale_price").attr("val");
    var afterPrice = getSumAfterPrice(prdtDvs);
    var optPrice = getSumOptPrice();

    var ret = makeAfterInfo.all(prdtDvs);

    if (ret === false) {
        return false;
    }

    var orderDetail = cateName + " / " +
        paperName + " / " +
        sizeName + " / " +
        tmptName;

    $("#order_detail").val(orderDetail);

    setAddOptInfo();

    $frm = $("#frm");

    $frm.find("input[name='bl_cate_name']").val(cateName);
    $frm.find("input[name='bl_amt_unit']").val(amtUnit);
    $frm.find("input[name='bl_paper_name']").val(paperName);
    $frm.find("input[name='bl_bef_tmpt_name']").val(tmptName);
    $frm.find("input[name='bl_size_name']").val(sizeName);

    $frm.find("input[name='bl_sell_price']").val(sellPrice);
    $frm.find("input[name='bl_sale_price']").val(salePrice);
    $frm.find("input[name='bl_after_price']").val(afterPrice);
    $frm.find("input[name='bl_opt_price']").val(optPrice);

    return true;
};

/**
 * @brief 견적서 팝업 본문정보 생성
 */
var makeEstiPopInfo = {
    "data": null,
    "exec": function (dvs) {
        var prefix = getPrefix(prdtDvs);

        var paper = $.trim($("#bl_paper > option:selected").text());
        var size = $.trim($(prefix + "size > option:selected").text());
        var tmpt = $.trim($("#bl_print_tmpt > option:selected").text());
        var amt = $.trim($("#bl_amt").val());
        var count = $.trim($("#esti_count").text());

        var after = '';
        $('.after .overview ul li').each(function () {
            after += $(this).text();
            after += ', ';
        });
        after = after.substr(0, after.length - 2);

        var data = {
            "cate_name": [
                cateName
            ],
            "paper": [
                paper
            ],
            "size": [
                size
            ],
            "tmpt": [
                tmpt
            ],
            "amt": [
                amt
            ],
            "amt_unit": [
                amtUnit
            ],
            "count": [
                count
            ],
            "after": [
                after
            ]
        };

        data = getEstiPopData(data);

        this.data = data;
    }
};

/**
 * @brief 납기문구 수정
 *
var changeReleaseStr = function() {
    var prefix = getPrefix(prdtDvs);
    var paper = $(prefix + "paper > option:selected").text();
    paper = paper.split(' ');
    var basisweight = parseInt(paper[paper.length - 1]);
    var size = $(prefix + "size > option:selected").text();
    var amt = parseFloat($(prefix + "amt").val());

    var str = null;

    if (basisweight === 90) {
        str  = "* 평일 오후 7시 마감(토요일 접수 없음).";
        if (amt === 0.5) {
            str += "<br/>* 출고까지 2~3일 정도 소요됩니다.";
        } else if ((size === "8절" || size === "A3") &&
                amt === 1.0 || amt === 3.0) {
            str += "<br/>* 출고까지 2~3일 정도 소요됩니다.";
	} else {
            str += "<br/>* 익일 출고됩니다.";
	}
    } else if (basisweight === 120 || basisweight === 150 || basisweight === 180) {
        str  = "* 평일 오후 6시 마감(토요일 접수 없음).";
        str += "<br/>* 납기일은 3~4일 정도 소요됩니다.";
    } else {
        str  = "* 평일 오후 6시 마감(토요일 접수 없음).";
        str += "<br/>* 익일 출고됩니다.";
    }

    $("#release_str").html(str);
};
*/

window.addEventListener("message", function(e){
    var test = window.location.protocol;
    var ser = window.location.search;
    var category_name = "";
    var origin = "";
    if(test == "https:"){
        origin = "https://partner.gprinting.co.kr";
    }else{
        origin = "http://partner.gprinting.co.kr";
    }

    if(e.origin == 'http://partner.gprinting.co.kr' || 'https://partner.gprinting.co.kr' || 'http://partner.dprinting.co.kr' || 'https://partner.dprinting.co.kr' ) {
        if(ser == "?id=cata&cs=001005001"){
            $("#productName").text("카탈로그/브로슈어");
            $("#title").val("카탈로그");
            category_name = "카탈로그";
        }else{
            $("#productName").text("책자/도서");
            category_name = "책자";
        }
        
        if(e.data.path == 'estimate') {
            
            let res = e.data.data;
            let paper1 = "";
            let paper2 = "";
            let paper3 = "";
            let ctp_plate1 = "";
            let ctp_plate2 = "";
            let ctp_plate3 = "";
            let printing1 = "";
            let printing2 = "";
            let printing3 = "";
            let sup_price = "";
            let tax_price = "";
            let fix_price = "";
            let coating = "";
            let foiling = "";
            let press = "";
            let pap_price = "" ;
            let pri_price = "";
            let ctp_price = "" ; 
            let summary1 = "";
            let summary2 = "";
            let summary3 = "";
            let summary4 = "";
            let summary5 = "";
            let summary6 = "";
            let summary7 = "";
            let summary8 = "";
            


            resizeIframe(res.documentHeight);

            //견적서 정보
            console.log('견적항목정보', res.calculations);

            if(res.calculations.coating){
                coating = res.calculations.coating.price;
                $("#esti_coating_dt").css("display","block"); 
                $("#esti_coating").text(coating.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_coating_dd").css("display","block");  
                
            }else{
                $("#esti_coating_dt").css("display","none");
                $("#esti_coating_dd").css("display","none");  
            }
            if(res.calculations.foiling){
                foiling = res.calculations.foiling.price;
                $("#esti_foil_dt").css("display","block"); 
                $("#esti_foil").text(foiling.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_foil_dd").css("display","block");      
            }else{
                $("#esti_foil_dt").css("display","none");
                $("#esti_foil_dd").css("display","none");
            }
            if(res.calculations.pressing){
                press = res.calculations.pressing.price;
                $("#esti_press_dt").css("display","block"); 
                $("#esti_press").text(press.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#esti_press_dd").css("display","block"); 
            }else{
                $("#esti_press_dt").css("display","none"); 
                $("#esti_press_dd").css("display","none"); 

            }
            $(".esti_paper_info").css("display","block");
            $(".esti_pan_info").css("display", "block");
            $(".esti_print_info").css("display", "block");
            $("#esti_binding_dt").css("display", "block");
            $("#esti_binding_dd").css("display", "block");
            
            //표지
                ctp_plate1 = res.calculations.cover.ctp_plate.price; //판비
                printing1 = res.calculations.cover.printing.price//인쇄비
                paper1 = res.calculations.cover.raw_material.price//용지비
            //내지1
            if(res.calculations.inside){
                ctp_plate2 = res.calculations.inside.ctp_plate.price; //판비
                printing2 = res.calculations.inside.printing.price//인쇄비
                paper2 = res.calculations.inside.raw_material.price//용지비

            }
            
            //내지2
            if(res.calculations.inside2){
                ctp_plate3 = res.calculations.inside2.ctp_plate.price; //판비
                printing3 = res.calculations.inside2.printing.price//인쇄비
                paper3 = res.calculations.inside2.raw_material.price//용지비
            }
           

            //접지
            let binding = res.calculations.bind.binding.price //접지

           

            pap_price = paper1 + paper2 + paper3 ;
            pri_price = printing1 + printing2 + printing3;
            ctp_price = ctp_plate1 + ctp_plate2 + ctp_plate3 ; 


            pap_price = Number(pap_price);
            pri_price = Number(pri_price);
            ctp_price = Number(ctp_price);
            coating = Number(coating);
            foiling = Number(foiling);
            press = Number(press);
            sale = Number(pri_price) * 0.2;
            sale = Math.floor(sale / 100);
            sale = sale * 100;

            let sumprice = pri_price + ctp_price;
            binding = Number(binding);
            //기본 가격구조
            sup_price = pap_price + pri_price + ctp_price + binding + coating + foiling + press;
            tax_price =  Math.floor((sup_price * 1.1)/10);
            tax_price = tax_price / 11 * 10 ; 
            fix_price = tax_price + Number(sup_price) ;
            fix_price = Math.floor(fix_price);
            fix_price_basic = fix_price;
            //할인행사 (인쇄비 20%)
            sup_price2 = pap_price + (pri_price-sale) + ctp_price + binding + coating + foiling + press; //할인행사 
            sup_price2 = Math.floor(sup_price2 / 100);
            sup_price2 = sup_price2 * 100;
            tax_price2 =  Math.floor((sup_price2 * 1.1)/10);

            tax_price2 = Math.ceil((tax_price2 / 11 * 10)) ; 
            //console.log(tax_price2);

            fix_price2 = tax_price2 + Number(sup_price2) ;
            fix_price2 = Math.floor(fix_price2);

            
            $("#esti_paper").text(pap_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_pan").text(ctp_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_print").text(pri_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_sale_price").text(sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).css("color","red");
            $("#esti_binding_dd").text(binding.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원");
            $("#esti_supply").text(sup_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_tax").text(tax_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_sell_price").text(fix_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#esti_pay_price").text(fix_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
           // $("#sell_price").text(fix_price_basic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#saletext").text(sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).css("color","red");
            $("#sell_price strong").html(fix_price_basic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

            $("#supply_price").text(sup_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#tax").text(tax_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#sale_price").text(fix_price2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#ad_sell_price").val(fix_price2);


            //견적서 정보
            console.log('견적가격정보', res.total);
            
            //견적옵션 정보
            console.log('견적옵션정보', res.options);

            $("#ad_size").val(caseInSwitch(res.options.product_size.value)); 

            $("#ad_cut_wid_size").val(res.options.cut_width.value);
            $("#ad_cut_vert_size").val(res.options.cut_length.value);
            $("#ad_work_wid_size").val(res.options.work_width.value);
            $("#ad_work_vert_size").val(res.options.work_length.value);
            $("#ad_binding_depth1").val(res.options.bind_type.name);
            $("#ad_binding_val").val(caseInSwitch2(res.options.bind_type.name,res.options.bind_direction.value));
            $("#ad_binding_price").val(binding);
            $("#ad_amt").val(res.options.product_amount.value);
            $("#ad_size_name").val(res.options.product_size.value);
            $("#expect_box_num").val(res.packing.box);
            $("#expec_weight").val(res.packing.weight);

        
            
            $("#cover_cate_sortcode").val("001005001");
            $("#cover_cate_name").val(res.options.cover_paper_code.value);
            //$("#cover_amt").val();
            
            


            
            summary1 = "<li>"+ res.options.product_size.name + " " + res.options.bind_type.name + " " + res.options.bind_direction.name +  " " + res.options.product_amount.name + "</li>";
            summary2 = "<li>"+ res.options.cover_paper_code.name + " " + res.options.cover_printing_color.name + " " + res.options.cover_page.name + "</li>";
            summary3 = "<li>"+ res.options.inside_paper_code.name + " " + res.options.inside_printing_color.name + " " + res.options.inside_page.name + "</li>";
            if(res.options.inside2_paper_code){
                summary4 = "<li>"+ res.options.inside2_paper_code.name + " " + res.options.inside2_printing_color.name + " " + res.options.inside2_page.name + "</li>";
            }
            if(res.options.startend_page){
                summary5 = "<li>"+ res.options.startend_page.name + " " + res.options.startend_paper_code.name + "</li>";
            }
            if(res.calculations.coating){
                summary6 = "<li>" + res.calculations.coating.label + " " + res.calculations.coating.value + "</li>";
               if(res.calculations.coating_inside){
                    summary6.replace("</li>","");
                    summary6 = summary6 +  res.calculations.coating_inside.label + " " + res.calculations.coating_inside.value + "</li>";
                } 
            }

         /*   if(res.calculations.foiling){
                summary7 = "<li>" + res.calculations.foiling.label + " " +  res.calculations.foiling.value + "</li>";
            }
            if(res.calculations.foiling2){
                summary7 += "<li>" + res.calculations.foiling2.label + " " +  res.calculations.foiling2.value + "</li>";
            }
            if(res.calculations.foiling3){
                summary7 += "<li>" + res.calculations.foiling3.label + " " +  res.calculations.foiling3.value + "</li>";
            } */

           // console.log(res.options.postpress);
            /*if(res.calculations.pressing){
                summary8 += "<li>" + res.calculations.pressing.label + " " +  res.calculations.pressing.value + "</li>";
            } */

            if(res.options.postpress){

              /*  if(res.options.postpress.foiling){
                    summary7 = "<li>" + res.options.postpress.foiling.order_section.name + " " +  res.options.postpress.foiling.foil_position.name + " " +  res.options.postpress.foiling.foil_type.name + " " +  res.options.postpress.foiling.foil_area.name + " " +  res.options.postpress.foiling.foil_width.name + " " +  res.options.postpress.foiling.foil_length.name + "</li>";
                }
                    
 */            
                if(res.options.postpress.coating){
                    summary6 = "<li>" + res.options.postpress.coating.coating_type.name + "</li>";
                } 
                if(res.options.postpress.coating_inside){
                    summary6 += "<li>" + res.options.postpress.coating_inside.coating_type.name + "</li>";
                } 
                if(res.options.postpress.foiling){
                   summary7 = "<li>" + res.options.postpress.foiling.order_section.name + " " + res.options.postpress.foiling.foil_position.name + " " +  res.options.postpress.foiling.foil_type.name + " " +  res.options.postpress.foiling.foil_area.name + " " +  res.options.postpress.foiling.foil_width.name + " " +  res.options.postpress.foiling.foil_length.name + "</li>";
                }
                if(res.options.postpress.foiling2){
                    summary7 += "<li>" + res.options.postpress.foiling2.order_section.name + " " + res.options.postpress.foiling2.foil_position.name + " " +  res.options.postpress.foiling2.foil_type.name + " " +  res.options.postpress.foiling2.foil_area.name + " " +  res.options.postpress.foiling2.foil_width.name + " " +  res.options.postpress.foiling2.foil_length.name + "</li>";
                }
                if(res.options.postpress.foiling3){
                    summary7 += "<li>" + res.options.postpress.foiling3.order_section.name + " " + res.options.postpress.foiling3.foil_position.name + " " +  res.options.postpress.foiling3.foil_type.name + " " +  res.options.postpress.foiling3.foil_area.name + " " +  res.options.postpress.foiling3.foil_width.name + " " +  res.options.postpress.foiling3.foil_length.name + "</li>";
                 }
                if(res.options.postpress.pressing){
                    summary8 = "<li>" + res.options.postpress.pressing.order_section.name + " " +  res.options.postpress.pressing.press_area.name + " " +res.options.postpress.pressing.press_type.name + " " + res.options.postpress.pressing.press_width.name + " " +res.options.postpress.pressing.press_length.name + "</li>";
                }
                if(res.options.postpress.pressing2){
                    summary8 += "<li>" + res.options.postpress.pressing2.order_section.name + " " +  res.options.postpress.pressing2.press_area.name + " " +res.options.postpress.pressing2.press_type.name + " " + res.options.postpress.pressing2.press_width.name + " " +res.options.postpress.pressing2.press_length.name + "</li>";
                }
                if(res.options.postpress.pressing3){
                    summary8 += "<li>" + res.options.postpress.pressing3.order_section.name + " " +  res.options.postpress.pressing3.press_area.name + " " +res.options.postpress.pressing3.press_type.name + " " + res.options.postpress.pressing3.press_width.name + " " +res.options.postpress.pressing3.press_length.name + "</li>";
                }

                

            }

            

            

            $(".summary > dl > dd > ul").html( summary1 + summary2 + summary3 + summary4 + summary5 + summary6 + summary7 + summary8 );
            summary1 = summary1.replace("<li>","");
            summary1 = summary1.replace("</li>"," / ");
            summary2 = summary2.replace("<li>","표지 : ");
            summary2 = summary2.replace("</li>"," / ");
            summary3 = summary3.replace("<li>","내지 : ");
            summary3 = summary3.replace("</li>"," / ");
            summary4 = summary4.replace("<li>","내지(2) : ");
            summary4 = summary4.replace("</li>"," / ");
            summary5 = summary5.replace("<li>","면지 : ");
            summary5 = summary5.replace("</li>","/");
            summary6 = summary6.replace("<li>","코팅 : ");
            summary6 = summary6.replace("</li>","/");
            summary6 = summary6.replace("/<li>",",");
            summary6 = summary6.replace("</li>","/");
            summary7 = summary7.replace("<li>","박 : ");
            summary7 = summary7.replace("</li>","/");
            summary7 = summary7.replace("/<li>",",");
            summary7 = summary7.replace("</li>","/");
            summary7 = summary7.replace("/<li>",",");
            summary7 = summary7.replace("</li>","/");
            summary8 = summary8.replace("<li>","형압 : ");
            summary8 = summary8.replace("</li>","");
            summary8 = summary8.replace("<li>",",");
            summary8 = summary8.replace("</li>","");
            summary8 = summary8.replace("<li>",",");
            summary8 = summary8.replace("</li>","");


            $("#ad_order_detail").val(category_name+" / "+summary1 + summary2 + summary3 + summary4 + summary5 + summary6 + summary7 + summary8);
            //포장 정보
            console.log('포장정보', res.packing);
            $("#expect_weight").val(res.packing.weight);
            $("#expect_box").val(res.packing.box);
            $("#expect_dlvr_price").text((res.packing.box * 4950).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

            
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

            function caseInSwitch2(val,val2) { //
                var answer2 = "";
                switch (val){
                  case "스프링":
                    switch(val2){
                        case "vl":
                        answer2 = 11109;
                        case "vt" :
                        answer2 = 11114;
                    } 
                    break; 
                  case "중철":
                    switch(val2){
                        case "vl":
                        answer2 = 626;
                        case "vt" :
                        answer2 = 620;
                    } 
                    break;
                  case "무선":
                    switch(val2){
                        case "vl":
                        answer2 = 650;
                        case "vt" :
                        answer2 = 644;
                    } 
                    break;
                }
                return answer2;
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