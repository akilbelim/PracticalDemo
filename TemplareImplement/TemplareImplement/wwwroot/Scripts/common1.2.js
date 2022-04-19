// Create Number Range
var NumberRange = function Range(NumberArray) {
    var VouID = NumberArray;
    var min = Math.min.apply(Math, VouID);
    var max = Math.max.apply(Math, VouID);
    var length = VouID.length;
    var range = "";
    var index = length - 2;
    var counter = 0;

    for (var j = (length - 1) ; j >= 0; j--) {

        var first = VouID[j];

        for (var i = index; i <= index; i++) {

            if (i == -1) {
                if (!range.includes(first))
                    range += first;
                break;
            }

            var minus = VouID[i] - first;

            if (minus == 1 && counter == 0) {
                if (!range.includes(first))
                    range += first;
                range += "-";
                counter++;
            }
            else if (minus == 1) {

            }
            else {
                if (!range.includes(first))
                    range += first;

                range += ", ";

                if (!range.includes(VouID[i]))
                    range += VouID[i];

                counter = 0;
            }
        }
        index--;
    }
    return range;

}

//  Print Sales Bill Function
function PrintBill(record, IsInvoiceType) {
    var printhtml = "", vc = "", multiplePagePrintHtml = "";
    var bNumOfPages = 1;
    var productLimit = 24;
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Print Header Information.
    for (var i = 0; i < record.t41.length; i++) {
        var t41 = record.t41[i];
        var t02s = find_in_object(record.t02, { T02F01: t41.T41F01 });
        if (t41.T41F01 > 0 && t02s.length > 0) {
            var bStartIndex = 0;
            var j = 1, itemAmt = 0, billAmt = 0, TotalQty = 0, city, TinNo, Comment, PartyTinNo = '';
            var grandItemAmt = 0, grandTotalQty = 0, addBlankRow = 0;
            var memo = (t41.T41F10 < 0) ? "Debit Memo" : "Cash Memo";   // T41F10 = BillAmt
            var billNoText = "Bill No: ", chalanType = "";
            bNumOfPages = (t02s.length / productLimit);
            bNumOfPages = Math.ceil(bNumOfPages);
            city = t41.M02F09;  //City
            TinNo = t41.M02F08; //TinNo
            Comment = t41.T41F11; // Comment
            if (t41.T41F15 == null || t41.T41F15 == '') {
                t41.T41F15 = t41.T41F01;
            }

            //  Loop for use in Header and Footer for each page in Print
            for (var pIndex = 1; pIndex <= bNumOfPages; pIndex++) {
                printhtml = "";
                billAmt = 0;
                TotalQty = 0;
                itemAmt = 0;
                ////  Loop Product Wise (i.e. Voucher Items details) for Sales Bill Print Body.
                for (var k = 0; k < t02s.length; k++) {
                    var t02 = t02s[k];
                    if (t02.T02F01 > 0) {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            itemAmt += parseFloat(t02.T02F05);
                            TotalQty += t02.T02F03;
                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = (t41.M05F11.length != 0) ? "TAX INVOICE" : "RETAIL INVOICE";
                                    PartyTinNo = t41.M05F11;
                                    chalanType = "";
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = "";
                                    PartyTinNo = "";
                                    billNoText = "";
                                    chalanType = "Delivery Chanllan";
                                }
                                printhtml = printhtml + "<table border='1' class='page'><tr><td colspan='2'><b>" + t41.M02F02 + "<br/>" + chalanType + "</b><br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='2'><b>Party Name : </b>" + t41.M05F04 + "</td><td colspan='3'>" + title + "</td></tr><tr><td colspan='2' rowspan='2' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</td><td colspan='3'><!--" + memo + "--></td></tr><tr><td colspan='3'><b>" + billNoText + " </b>" + t41.T41F15 + "</td></tr><tr><td colspan='2' style='font-size:12px;'><b>Phone:</b>" + t41.M05F08 + " - " + t41.M05F03 + "<br/><b>GSTIN No: " + PartyTinNo + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>#No.</b></td><td ><b>Item Name</b></td><td align='right'><b>Qty</b></td><td align='right'><b>Rate</b></td><td align='right'><b>Amount</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + t02.T02F04.toFixed(2) + "</td><td align='right'>" + t02.T02F05.toFixed(2) + "</td></tr>";
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + t02.T02F04.toFixed(2) + "</td><td align='right'>" + t02.T02F05.toFixed(2) + "</td></tr>";
                            }
                        }
                    }
                }
                grandTotalQty += TotalQty;
                grandItemAmt += itemAmt;
                if (t02s.length < productLimit) {
                    addBlankRow = productLimit - t02s.length;
                    for (var row = 1; row <= addBlankRow; row++) {
                        printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                }
                else if (t02s.length > productLimit) {
                    page = (t02s.length - (t02s.length % productLimit)) / productLimit;
                    addBlankRow = t02s.length % (productLimit);
                    addBlankRow = productLimit - addBlankRow;
                    if (pIndex == ++page) {
                        for (var row = 1; row <= addBlankRow; row++) {
                            printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                        }
                    }
                }
                if (pIndex == bNumOfPages) {
                    printhtml = printhtml + "<tr class='last'><td></td><td><b>Total</b></td><td align='right'><b>" + grandTotalQty + "</b></td><td></td><td align='right'><b>" + grandItemAmt.toFixed(2) + "</b></td></tr><tr class='last'><td colspan='5' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='3' cellspacing='0' style='font-size:10px;'>GSTIN No. :" + TinNo + "• All Taxes are Included in Rate • Check material before taking delivery</td><td rowspan='3' colspan='2' style='font-size:10px;vertical-align: bottom;' >" + t41.M02F02 + "</td></tr><tr class='last'><td colspan='3' cellspacing='0' style='font-size:10px;'> • Subject to " + city + " Jurisdiction • Rat Cutting, Other Damages material will not be Replace or Refund<br/>• Cheque Return Charge will be applicable as per Bank Charges</td></tr><tr class='last'><td colspan='3' style='font-size:13px;' cellspacing='0'><b>Sales Person: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                else {
                    printhtml = printhtml + "<tr class='last'><td></td><td>&nbsp;</td><td >&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr class='last'><td colspan='5' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='3' cellspacing='0' style='font-size:10px;'>GSTIN No. :" + TinNo + "• All Taxes are Included in Rate • Check material before taking delivery</td><td rowspan='3' colspan='2' style='font-size:10px;vertical-align: bottom;' >" + t41.M02F02 + "</td></tr><tr class='last'><td colspan='3' cellspacing='0' style='font-size:10px;'> • Subject to " + city + " Jurisdiction • Rat Cutting, Other Damages material will not be Replace or Refund<br/>• Cheque Return Charge will be applicable as per Bank Charges</td></tr><tr class='last'><td colspan='3' style='font-size:13px;' cellspacing='0'><b>Sales Person: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                multiplePagePrintHtml += printhtml;
                bStartIndex = bStartIndex + productLimit;
            }
        }
    }
    return multiplePagePrintHtml;
}

//  Print Sales Bill Function
function NewPrintBill(record, IsInvoiceType) {
    var dealerGSTNo = '';
    var printhtml = "", vc = "", multiplePagePrintHtml = "";
    var bNumOfPages = 1;
    var productLimit = 24;
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Print Header Information.]
    for (var i = 0; i < record.t41.length; i++) {

        var frimes_5 = 0, namkin_5 = 0, wafer_5 = 0, papad_5 = 0;
        var frimes_10 = 0, namkin_10 = 0, wafer_10 = 0, papad_10 = 0;
        var frimes_250gm = 0, namkin_250gm = 0, wafer_250gm = 0, papad_250gm = 0;
        var frimes_500gm = 0, namkin_500gm = 0, wafer_500gm = 0, papad_500gm = 0;
        var looseTotal = 0;
        var t41 = record.t41[i];
        var t02s = find_in_object(record.t02, { T02F01: t41.T41F01 });

        if (t41.T41F01 > 0 && t02s.length > 0) {
            var bStartIndex = 0;
            var ItemAmount = 0, TotalQty = 0, city, TinNo, Comment, PartyTinNo = '';
            var addBlankRow = 0, TotalItemAmount = 0, grandTotalQty = 0, TotalItemRate = 0, TotalCGSTAmount = 0, TotalSGSTAmount = 0;
            var memo = (t41.T41F10 < 0) ? "Debit Memo" : "Cash Memo";
            var billNoText = "Bill No: ", chalanType = "";
            bNumOfPages = (t02s.length / productLimit);
            bNumOfPages = Math.ceil(bNumOfPages);
            city = t41.M02F09;  //City
            TinNo = t41.M02F08; //TinNo
            Comment = t41.T41F11; // Comment

            if (t41.T41F15 == null || t41.T41F15 == '') {
                t41.T41F15 = t41.T41F01;
            }

            //  Loop for use in Header and Footer for each page in Print
            for (var pIndex = 1; pIndex <= bNumOfPages; pIndex++) {
                printhtml = "";
                TotalQty = 0;
                ItemAmount = 0;

                ////  Loop Product Wise (i.e. Voucher Items details) for Sales Bill Print Body.
                for (var k = 0; k < t02s.length; k++) {
                    var t02 = t02s[k];
                    if (t02.T02F01 > 0 && t41.State_Flag == 'I') {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {

                            var ItemRate = 0, IGSTAmt = 0, TotalAmount = 0;

                            TotalQty += t02.T02F03;
                            ItemAmount += t02.T02F05;

                            ItemRate = ((t02.T02F04 * 100) / (t02.T02F16 + 100)).toFixed(2);
                            IGSTAmt = (ItemRate * t02.T02F03 * t02.T02F16 / 100).toFixed(2);

                            TotalAmount = (t02.T02F04 * t02.T02F03).toFixed(2);
                            TotalItemRate += (ItemRate * t02.T02F03);

                            TotalCGSTAmount += parseFloat(IGSTAmt);
                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + parseFloat(t02.T02F03);
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + parseFloat(t02.T02F03);
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }
                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b>#InvoiceType</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b>#BillNoText</b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>IGST</b></td><td align='center' colspan='2'><b></b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b></b></td><td><b></b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + ItemRate + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + TotalAmount + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + ItemRate + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + TotalAmount + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }

                    }
                    else if (t02.T02F01 > 0) //G
                    {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {

                            var ItemRate = 0, CGSTAmt = 0, SGSTAmt = 0, TotalAmount = 0;

                            TotalQty += t02.T02F03;
                            ItemAmount += t02.T02F05;

                            ItemRate = ((t02.T02F04 * 100) / (t02.T02F14 + t02.T02F15 + 100)).toFixed(2);
                            CGSTAmt = ((ItemRate * t02.T02F03 * t02.T02F14) / 100).toFixed(2);
                            SGSTAmt = ((ItemRate * t02.T02F03 * t02.T02F15) / 100).toFixed(2);

                            TotalAmount = (t02.T02F04 * t02.T02F03).toFixed(2);
                            TotalItemRate += (ItemRate * t02.T02F03);

                            TotalCGSTAmount += parseFloat(CGSTAmt);
                            TotalSGSTAmount += parseFloat(SGSTAmt);

                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + parseFloat(t02.T02F03);
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + parseFloat(t02.T02F03);
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }
                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b>#InvoiceType</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b>#BillNoText</b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>CGST</b></td><td align='center' colspan='2'><b>SGST</b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b>%</b></td><td><b>Amt</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + ItemRate + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + TotalAmount + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + ItemRate + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + TotalAmount + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                }

                grandTotalQty += TotalQty;
                TotalItemAmount += ItemAmount;

                if (t02s.length < productLimit) {
                    addBlankRow = productLimit - t02s.length;
                    for (var row = 1; row <= addBlankRow; row++) {
                        printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                }
                else if (t02s.length > productLimit) {
                    page = (t02s.length - (t02s.length % productLimit)) / productLimit;
                    addBlankRow = t02s.length % (productLimit);
                    addBlankRow = productLimit - addBlankRow;
                    if (pIndex == ++page) {
                        for (var row = 1; row <= addBlankRow; row++) {
                            printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                        }
                    }
                }
                if (pIndex == bNumOfPages) {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'><b>Invoice Total</b></td><td align='right'><b>" + parseFloat(grandTotalQty).toFixed(2) + "</b></td><td>" + parseFloat(TotalItemRate).toFixed(2) + "</td><td>&nbsp;</td><td>" + parseFloat(TotalCGSTAmount).toFixed(2) + "</td><td>&nbsp;</td><td>" + parseFloat(TotalSGSTAmount).toFixed(2) + "</td><td align='right'><b>" + parseFloat(TotalItemAmount).toFixed(2) + "</b></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center' style='min-width:10px;'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5" + "</td><td align='center'>#5RSTOT" + "</td><td align='center'>" + "#papad_5" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#10RSTOT" + "</td><td align='center'>" + "#papad_10" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#250GTOT" + "</td><td align='center'>" + "#papad_250gm" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm" + "</td><td align='center'>#fgm" + "</td><td align='center'>#wgm" + "</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                else {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5 " + "</td><td align='center'>#5RSTOT " + "</td><td align='center'>" + "#papad_5" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#10RSTOT" + "</td><td align='center'>" + "#papad_10" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#250GTOT" + "</td><td align='center'>" + "#papad_250gm" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm" + "</td><td align='center'>#fgm" + "</td><td align='center'>#wgm" + "</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                printhtml = SummaryBoxLanguage(printhtml);
                multiplePagePrintHtml += printhtml;
                bStartIndex = bStartIndex + productLimit;
            }

        }

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_5/g, namkin_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_10/g, namkin_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_250gm/g, namkin_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#ngm/g, namkin_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_5/g, frimes_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_10/g, frimes_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_250gm/g, frimes_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#fgm/g, frimes_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_5/g, papad_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_10/g, papad_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_250gm/g, papad_250gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_5/g, wafer_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_10/g, wafer_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_250gm/g, wafer_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wgm/g, wafer_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#5RSTOT/g, (namkin_5 + frimes_5 + wafer_5));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#10RSTOT/g, (namkin_10 + frimes_10 + wafer_10));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#250GTOT/g, (namkin_250gm + frimes_250gm));
        //multiplePagePrintHtml = multiplePagePrintHtml.replace(/#500GTOT/g, (''));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#looseTotal/g, (looseTotal));
    }
    if (record.t41.length > 1) { multiplePagePrintHtml += dealersummryBill(record.t41); }

    return multiplePagePrintHtml;
}
function DealerSummaryReport(records) {
    var DSR = "";
    $(".DealerSummaryReportDiv").empty();
    $(".DealerSummaryReportDiv").attr("style", "display:none;");
    DSR = DSR + "<table id=\"DealerSummaryReportDiv\"><tbody>";
    DSR = DSR + "<tr style='text-align:center;'><td>Dealer Name</td><td>Total User</td><td>Total Active User</td><td>Total Route</td><td>Total Customer</td><td>Total Active Calls</td><td>Total In-Active Calls</td><td>Total Calls</td><td>Total Orders</td><td>Total Sale Bill</td><td>Total Sale Bill Amount</td><td>Total Pending Order</td><td>Total Deleted Order</td><td>Total Deleted Order Amount</td><td>Total Order Amount</td><td>Total Sale Return</td><td>Total Sale Return Amount</td></tr>";
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Header Information.
    for (var i = 0; i < records.DealerSummary.length; i++) {
        var DS = records.DealerSummary[i];
        DSR = DSR + "<tr><td>" + DS.DealerName + "</td><td>" + DS.tot_User + "</td><td>" + DS.tot_Active_User + "</td><td>" + DS.tot_Route + "</td><td>" + DS.tot_Customer + "</td><td>" + DS.Total_Active_Call + "</td><td>" + DS.Total_In_Active_Call + "</td><td>" + DS.Total_Call + "</td><td>" + DS.tot_Order + "</td><td>" + DS.tot_Sale_Bill + "</td><td>" + DS.tot_Sale_Bill_Amount + "</td><td>" + DS.tot_Pending_Order + "</td><td>" + DS.tot_Deleted_Order + "</td><td>" + DS.tot_Deleted_Order_Amount + "</td><td>" + DS.tot_Order_Amount + "</td><td>" + DS.tot_Sale_Returns + "</td><td>" + DS.tot_Sale_Returns_Amount + "</td></tr>";
    }
    DSR = DSR + "</tbody></table>";
    $(".DealerSummaryReportDiv").html(DSR);
}

//  Print Item Counter
function ItemCounter(record) {
    $('#ItemCounter table').empty();
    $('#ItemCounter table').append('<thead class="Tthead"><tr class="GridHeader"><th class="MainheaderText width40Per textAlignLeft paddingLeft5px">Item Name </th><th class="MainheaderText width20Per">Total Strip/Packet</th><th class="MainheaderText width20Per">Bag/Carton</th><th class="MainheaderText width20Per">Strip/Packet</th></tr>');
    $('#ItemCounter table').append('<tbody class="Ttbody">');
    var IsOdd = true;
    var bgcolor = '';
    for (var x = 0; x < record.length; x++) {
        if (IsOdd) {
            bgcolor = "GridRow";
            IsOdd = false;
        } else {
            bgcolor = "GridRowEven";
            IsOdd = true;
        }
        var val = record[x];
        $('#ItemCounter table').append('<tr class="' + bgcolor + ' GridRowFilter GridRowTR"><td class="GridRowTD width40Per paddingLeft5px">' + val.ProductName + '</td><td class="GridRowTD width20Per textAlignCenter">' + val.Qty + '</td><td class="GridRowTD width20Per textAlignCenter">' + val.Box + '</td><td class="GridRowTD width20Per textAlignCenter">' + val.Strip + '</td></tr>');
    }
    $('#ItemCounter table').append('</tbody>');
}

function ItemCounterPriting(record, vid, mode) {
    var no = "";
    var All_5 = "";
    var Tot_5 = "";
    var All_10 = "";
    var Tot_10 = "";
    var All_250 = "";
    var Tot_250 = "";
    var All_500 = "";
    var Tot_500 = "";
    var OFTble = "";

    var All_Tot_5 = 0;
    var All_Tot_10 = 0;
    var All_Tot_250 = 0;
    var All_Tot_500 = 0;

    var cnt = 1;
    OFTble = OFTble + "<table id=\"PrintOrderFormTable\" cellspacing=\"0\" cellpadding=\"1\" style=\"border: 1px solid;\"><tbody><tr style=\"font-weight: bolder;\"><td colspan=\"17\" style=\"border-bottom: 1px solid;\"><center>Order Form</center></td></tr>"
        + "<tr style=\"font-weight: bolder;\"><td colspan=\"8\" style=\"border-right: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;\">Party: #PartyName# </td><td colspan=\"9\" style=\"border-bottom: 1px solid;\">Order By: #Users# </td></tr>"
        + "<tr style=\"font-weight: bolder;\"><td colspan=\"8\" style=\"border-right: 3px solid rgb(0, 0, 0);border-bottom: 1px solid; width:550px; word-wrap: break-word;\">Order No:" + no + "</td><td colspan=\"9\" style=\"border-bottom: 1px solid;\">Date : #Date#</td></tr>"
        + "<tr style=\"font-weight: bolder;\"><td colspan=\"8\" style=\"border-right: 3px solid rgb(0, 0, 0);\">Route Name : #RouteName# </td><td colspan=\"9\">Total Amt.: #Amount# </td></tr>"
        + "<tr style=\"border-top: 3px solid rgb(0, 0, 0); font-weight: bolder;\"><td rowspan=\"2\" style=\"border-top: 3px solid rgb(0, 0, 0);border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">Sr No.</td><td rowspan=\"2\" style=\"border-right: 3px solid rgb(0, 0, 0);border-top: 3px solid rgb(0, 0, 0); border-bottom: 3px solid rgb(0, 0, 0);\">Product Name.</td><td colspan=\"3\" style=\"border-right: 3px solid rgb(0, 0, 0);border-top: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;\">Rs 5/-</td><td colspan=\"3\" style=\"border-right: 3px solid rgb(0, 0, 0);border-top: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;\">Rs 10/-</td><td colspan=\"3\" style=\"border-right: 3px solid rgb(0, 0, 0);border-top: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;\">250 Gm</td><td colspan=\"3\" style=\"border-top: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;border-right: 1px solid;\">500 Gm</td><td style=\"border-top: 3px solid rgb(0, 0, 0);border-bottom: 1px solid;border-right: 1px solid;\">Loose</td></tr>"
        + "<tr style=\"font-weight: bolder;\"><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">All</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">Strip</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 3px solid rgb(0, 0, 0);\">Carton</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">All</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">Strip</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 3px solid rgb(0, 0, 0);\">Carton</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">All</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">Packet</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 3px solid rgb(0, 0, 0);/* border-right: 1px solid; */\">Carton</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">All</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 1px solid;\">Packet</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);border-right: 3px solid rgb(0, 0, 0);/* border-right: 1px solid; */\">Carton</td><td style=\"border-bottom: 3px solid rgb(0, 0, 0);\">KG</td></tr>";
    for (var z = 0; z < record.length; z++) {
        var val = record[z];
        if (val.M21F08 != 'Total') {
            //  With All Column Data
            OFTble = OFTble + "<tr><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + cnt + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid;\">" + val.M21F08 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.TotalStrip_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.TotalStrip_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.TotalStrip_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.TotalStrip_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right; border-right: 1px solid;\">" + val.Carton_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right;\">" + val.Loose.replace(".00", "") + "</td></tr>";

            //  Without All Column Data
            //OFTble = OFTble + "<tr><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + cnt + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid;\">" + val.M21F08 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right; border-right: 1px solid;\">" + val.Carton_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right;\">" + val.Loose.replace(".00", "") + "</td></tr>";
            cnt = cnt + 1;
            if (val.TotalStrip_5 != '')
                All_Tot_5 = parseFloat(All_Tot_5) + parseFloat(val.TotalStrip_5);
            if (val.TotalStrip_10 != '')
                All_Tot_10 = parseFloat(All_Tot_10) + parseFloat(val.TotalStrip_10);
            if (val.TotalStrip_250 != '')
                All_Tot_250 = parseFloat(All_Tot_250) + parseFloat(val.TotalStrip_250);
            if (val.TotalStrip_500 != '')
                All_Tot_500 = parseFloat(All_Tot_500) + parseFloat(val.TotalStrip_500);
        }
        else {
            //  Without All Total Data
            //OFTble = OFTble + "<tr style=\"font-weight: bolder;\"><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 3px solid;\">" + val.M21F08 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right; border-right: 1px solid;\">" + val.Carton_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right;\">" + val.Loose.replace(".00", "") + "</td></tr>";

            //  With All Total Data
            OFTble = OFTble + "<tr style=\"font-weight: bolder;\"><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\"></td><td style=\"border-bottom: 1px solid;border-right: 3px solid;\">" + val.M21F08 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + All_Tot_5 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_5.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + All_Tot_10 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_10.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + All_Tot_250 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 3px solid; text-align: right;\">" + val.Carton_250.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + All_Tot_500 + "</td><td style=\"border-bottom: 1px solid;border-right: 1px solid; text-align: right;\">" + val.Strip_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right; border-right: 1px solid;\">" + val.Carton_500.replace(".00", "") + "</td><td style=\"border-bottom: 1px solid; text-align: right;\">" + val.Loose.replace(".00", "") + "</td></tr>";
            All_Tot_5 = 0;
            All_Tot_10 = 0;
            All_Tot_250 = 0;
            All_Tot_500 = 0;
        }
    }
    OFTble = OFTble + "</tbody></table>";
    return OFTble;
}

function SaleOrderReportExport(record, dealerName) {
    var OFTble = "";
    OFTble = OFTble + "<table id=\"SalesOrderReport\"><tbody>";
    OFTble = OFTble + "<caption>" + dealerName + "</caption>";
    OFTble = OFTble + "<tr><td>Order Date</td><td>Salesman</td><td>Route</td><td>Shop-Party Name</td><td>No. of Items</td><td>Item Amount</td></tr>";
    for (var x = 0; x < record.length; x++) {
        var val = record[x];
        OFTble = OFTble + "<tr><td>" + val.VoucherDate + "</td><td >" + val.SalesPerson + "</td><td >" + val.RouteName + "</td><td >" + val.PartyName + "</td><td>" + val.NoofItems + "</td><td>" + val.ItemAmount + "</td></tr>";
    }
    OFTble = OFTble + "</tbody></table>";
    return OFTble;
}

function SalesBillDetailReportExport(record, dealerName) {
    var OFTble = "";
    var CGSTTotal = 0, SGSTTotal = 0, IGSTTotal = 0, RoundOffTotal = 0, WithoutTaxTotal = 0, WithTaxTotal = 0;
    var count = 0;
    OFTble = OFTble + "<table id=\"SalesBillReport\"><tbody>";
    OFTble = OFTble + "<caption>" + dealerName + "</caption>";
    OFTble = OFTble + "<tr><td>Bill Date</td><td>Bill No</td><td>C/D</td><td>Dealer Code</td><td>Party Code</td><td>Shop Name</td><td>TIN No</td><td>HSN Code</td><td>Product Name</td><td>Qty</td><td>Rate</td><td>Amount</td><td>CGST%</td><td>CGST Amount</td><td>SGST%</td><td>SGST Amount</td><td>IGST%</td><td>IGST Amount</td><td>Round Off</td><td>Net Amount</td><td>Bill Amount</td></tr>";
    for (var x = 0; x < record.length; x++) {
        var val = record[x];
        OFTble = OFTble + "<tr><td>" + val.BillDate + "</td><td>" + val.BillNo + "</td><td>" + val.PaymentType + "</td><td>" + val.DealerCode + "</td><td>" + val.PartyCode + "</td><td>" + val.PartyEnglishName + "</td><td>" + val.TINNo + "</td><td>" + val.HSNCode + "</td><td>" + val.ProductName + "</td><td>" + val.Qty + "</td><td>" + val.Rate + "</td><td>" + val.Amount + "</td><td>" + val.CGST + "</td><td>" + val.CGSTAmount + "</td><td>" + val.SGST + "</td><td>" + val.SGSTAmount + "</td><td>" + val.IGST + "</td><td>" + val.IGSTAmount + "</td><td>" + val.RoundOff + "</td><td>" + val.NetAmount + "</td><td>" + val.BillAmount + "</td></tr>";
        count = count + 1;
        WithoutTaxTotal = WithoutTaxTotal + val.Amount;
        CGSTTotal = CGSTTotal + val.CGSTAmount;
        SGSTTotal = SGSTTotal + val.SGSTAmount;
        IGSTTotal = IGSTTotal + val.IGSTAmount;
        RoundOffTotal = RoundOffTotal + val.RoundOff;
        WithTaxTotal = WithTaxTotal + val.NetAmount;
    }
    if (count > 0) {
        OFTble = OFTble + "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>" + WithoutTaxTotal + "</td><td></td><td>" + CGSTTotal + "</td><td></td><td>" + SGSTTotal + "</td><td></td><td>" + IGSTTotal + "</td><td>" + RoundOffTotal + "</td><td>" + WithTaxTotal + "</td><td></td></tr>";
    }
    OFTble = OFTble + "</tbody></table>";
    return OFTble;
}

function PurchaseBillReportExport(record, dealerName) {
    var OFTble = "";
    OFTble = OFTble + "<table id=\"PurchaseBillReport\"><tbody>";
    OFTble = OFTble + "<caption>" + dealerName + "</caption>";
    OFTble = OFTble + "<tr><td>Bill Date</td><td>PO - Number</td><td>No. of Items</td><td>Item Amount</td></tr>";
    for (var x = 0; x < record.length; x++) {
        var val = record[x];
        OFTble = OFTble + "<tr><td>" + val.P01F04 + "</td><td >" + val.P01F10 + "</td><td >" + val.P01F05 + "</td><td >" + val.P01F07 + "</td></tr>";
    }
    OFTble = OFTble + "</tbody></table>";
    return OFTble;
}

function PartyStatusReportExport(record, dealerName) {
    var OFTble = "";
    OFTble = OFTble + "<table id=\"PurchaseBillReport\"><tbody>";
    OFTble = OFTble + "<caption>" + dealerName + "</caption>";
    OFTble = OFTble + "<tr><td>Bill Date</td><td>Shop-Party Name</td><td>Salesman</td><td>Party Status</td></tr>";
    for (var x = 0; x < record.length; x++) {
        var val = record[x];
        OFTble = OFTble + "<tr><td>" + val.R01F04 + "</td><td >" + val.M05F04 + "</td><td >" + val.M03F03 + "</td><td >" + val.R01F05 + "</td></tr>";
    }
    OFTble = OFTble + "</tbody></table>";
    return OFTble;
}
// Find Child Recrod in Jquery Array
function find_in_object(my_object, my_criteria) {
    return my_object.filter(function (obj) {
        return Object.keys(my_criteria).every(function (c) {
            return obj[c] == my_criteria[c];
        });
    });
}

//Bind Routes by dealer id
function BindDropDown(Mode, ControlId, ParentID, DealerID) {
    var url = '';
    var ddlControlId = $("[id*=" + ControlId + "]").first();
    var FromAdmin = 0;
    if (Mode == "BindRoutes") {
        if (DealerID == 0)
            //url = "GetCommonData.aspx?Mode=GetRoutes";
            url = "/Common/GetRoutes";
        else
            url = "../GetCommonData.aspx?Mode=GetRoutes&DealerID=" + DealerID;
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Route--</option>');
    }
    else if (Mode == "BindMultipleRoutes") {
        url = "/Common/GetRoutes";
    }
    else if (Mode == "BindParty") {
        if (DealerID == 0)
            //url = "GetCommonData.aspx?Mode=GetParty&RouteID=" + ParentID  //selected route id
            url = "/Common/GetParty?RouteID=" + ParentID;
        else
            url = "../GetCommonData.aspx?Mode=GetParty&RouteID=" + ParentID + "&DealerID=" + DealerID //selected route id
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Party--</option>');
    }
    else if (Mode == "BindUsers") {
        if (DealerID == 0)
            url = "/Common/GetUser?ParentID=" + ParentID
        else
            url = "../GetCommonData.aspx?Mode=GetUser" + "&DealerID=" + DealerID
        ddlControlId.empty().append('<option selected="selected" value="0">--All User--</option>');
    }
    else if (Mode == "BindSalesman") {
        if (DealerID == 0)
            url = "GetCommonData.aspx?Mode=GetSalesman";
        else
            url = "../GetCommonData.aspx?Mode=GetSalesman&DealerID=" + DealerID;
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Salesman--</option>');
    }
    else if (Mode == "BindProducts") {
        if (DealerID == 0)
            url = "GetCommonData.aspx?Mode=GetProducts";
        else
            url = "../GetCommonData.aspx?Mode=GetProducts&DealerID=" + DealerID;
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Products--</option>');
    }
    else if (Mode == "BindDealers") {
        if (DealerID == 0)
            url = "../GetCommonData.aspx?Mode=GetDealers";
        else
            url = "../GetCommonData.aspx?Mode=GetDealers";
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Dealers--</option>');
    }
    else if (Mode == "BindLiveDealers") {
        FromAdmin = 1;
        url = "GetCommonData.aspx?Mode=GetLiveDealers";
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Dealers--</option>');
    }
    else if (Mode == "BindRegion") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetRegion";
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetRegion";
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Price List--</option>');
    }
    else if (Mode == "BindRegionForBillPriceEdit") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetRegion";
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetRegion";
        ddlControlId.empty().append('<option selected="selected" value="-1">--Select  Price List--</option>');
        ddlControlId.append('<option value="0">All Price List</option>');
    }
    else if (Mode == "BindDealersAdmin") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetDealers";
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetDealers";
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Dealer--</option>');
    }
    else if (Mode == "GetUserGroup") {
        FromAdmin = 1;
        url = "../GSAdmin/GetCommonData.aspx?Mode=GetUserGroup";
        //ddlControlId.empty().append('<option selected="selected" value="0">--Select User Group--</option>');
        ddlControlId.empty().append('<option value="-1">Add New Group</option>');
        ddlControlId.append('<option selected="selected" value="0">--Select User Group--</option>');
    }
    else if (Mode == "UserGroup") {
        FromAdmin = 1;
        url = "../GSAdmin/GetCommonData.aspx?Mode=GetUserGroupRest";
        ddlControlId.empty().append('<option selected="selected" value="0">--Select User Group--</option>');
    }
    else if (Mode == "BindRegionType") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=BindRegionType&RegionType=" + ParentID;
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=BindRegionType&RegionType=" + ParentID;
        ddlControlId.empty().append('<option selected="selected" value="">--Select--</option>');
    }
    else if (Mode == "BindState") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllStates";
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllStates";
        ddlControlId.empty().append('<option selected="selected" value="">--Select State--</option>');
    }
    else if (Mode == "BindZone") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllZoneByState&stateId=" + ParentID;
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllZoneByState&stateId=";
        ddlControlId.empty().append('<option selected="selected" value="">--Select Zone--</option>');
    }
    else if (Mode == "BindDistrict") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllDistrictByZone&zoneId=" + ParentID;
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllDistrictByZone&zoneId=";
        ddlControlId.empty().append('<option selected="selected" value="">--Select District--</option>');
    }
    else if (Mode == "BindTaluka") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllTalukaByDistrict&districtId=" + ParentID;
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllTalukaByDistrict&districtId=";
        ddlControlId.empty().append('<option selected="selected" value="">--Select Taluka--</option>');
    }
    else if (Mode == "BindCities") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllCitiesByTaluka&talukaId=" + ParentID;
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllCitiesByTaluka&talukaId";
        ddlControlId.empty().append('<option selected="selected" value="">--Select City--</option>');
    }
    else if (Mode == "BindAllCity") {
        FromAdmin = 1;
        if (DealerID == 0)
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllCity";
        else
            url = "../GSAdmin/GetCommonData.aspx?Mode=GetAllCity";
        ddlControlId.empty().append('<option selected="selected" value="">--Select City--</option>');
    }
    else if (Mode == "BindMainMenu") {
        FromAdmin = 1;
        url = "../GSAdmin/GetCommonData.aspx?Mode=GetMainMenu&isAdmin=" + DealerID;
        ddlControlId.empty().append('<option selected="selected" value="0">--Select Menu--</option>');
    }
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                if (FromAdmin == 1) {
                    if (data.Data.DataList.length > 0) {
                        $.each(data.Data.DataList, function () {
                            ddlControlId.append($("<option/>").val(this['Id']).text(this['Name']));
                        });
                    }
                } else {
                    if (data.DataList.length > 0) {
                        $.each(data.DataList, function () {
                            ddlControlId.append($("<option/>").val(this['Id']).text(this['Name']));
                        });
                    }
                }
            }
            else {
                alert(data.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var error = JSON.parse(jqXHR.responseText);
            alert(error.ExceptionMessage);
        }
    });
}

function BindDropDownYear(Mode, ControlId, ParentID, FromAdmin) {
    var url = '';
    var ddlControlId = $("[id*=" + ControlId + "]").first();
    if (Mode == "BindYears") {
        if (FromAdmin == 1)
            url = "../GSAdmin/GetCommonData.aspx?Mode=YearList";
        else
            url = "GetCommonData.aspx?Mode=YearList";
        ddlControlId.empty().append('<option value="0">--Select Year--</option>');
    }
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.Result == "OK") {
                if (data.Data.DataList.length > 0) {
                    $.each(data.Data.DataList, function () {
                        if (this['Val'] == 1) {
                            ddlControlId.append($("<option selected='selected' />").val(this['Id']).text(this['Name']));
                        } else {
                            ddlControlId.append($("<option />").val(this['Id']).text(this['Name']));
                        }
                    });
                }
            }
            else {
                alert(data.Message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var error = JSON.parse(jqXHR.responseText);
            alert(error.ExceptionMessage);
        }
    });
}

function GetToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

function GetBackDate(sDay) {
    var back_GTM = new Date(); back_GTM.setDate(back_GTM.getDate() - sDay);
    var b_dd = back_GTM.getDate();
    var b_mm = back_GTM.getMonth() + 1;
    var b_yyyy = back_GTM.getFullYear();
    if (b_dd < 10) {
        b_dd = '0' + b_dd
    }
    if (b_mm < 10) {
        b_mm = '0' + b_mm
    }
    return b_dd + '-' + b_mm + '-' + b_yyyy;
}

function GetDifferenceDays(fromDate, ToDate) {

    fromDate = StringToDate(fromDate);
    ToDate = StringToDate(ToDate);

    var date1 = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, fromDate.getDate());
    var date2 = new Date(ToDate.getFullYear(), ToDate.getMonth() + 1, ToDate.getDate());
    var one_day = 1000 * 60 * 60 * 24; //Get 1 day in milliseconds
    var days = Math.ceil((date2.getTime() - date1.getTime()) / one_day);
    return days;
}

function StringToDate(dateStr) {
    var parts = dateStr.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

//Check Valid email
function ValidateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function NewPrintReturnBill(record, IsInvoiceType) {
    var dealerGSTNo = '';
    var printhtml = "", vc = "", multiplePagePrintHtml = "";
    var bNumOfPages = 1;
    var productLimit = 18;
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Print Header Information.
    for (var i = 0; i < record.t41.length; i++) {
        var frimes_5 = 0, namkin_5 = 0, wafer_5 = 0, papad_5 = 0;
        var frimes_10 = 0, namkin_10 = 0, wafer_10 = 0, papad_10 = 0;
        var frimes_250gm = 0, namkin_250gm = 0, wafer_250gm = 0, papad_250gm = 0;
        var frimes_500gm = 0, namkin_500gm = 0, wafer_500gm = 0, papad_500gm = 0;
        var looseTotal = 0;
        var t41 = record.t41[i];
        var t02s = find_in_object(record.t02, { T02F01: t41.T41F01 });
        if (t41.T41F01 > 0 && t02s.length > 0) {
            var bStartIndex = 0;
            var j = 1, itemAmt = 0, billAmt = 0, TotalQty = 0, city, TinNo, Comment, PartyTinNo = '';
            var grandItemAmt = 0, grandTotalQty = 0, addBlankRow = 0, grandItemRate = 0;
            var grandCGSTAmt = 0, grandSGSTAmt = 0, grandIGSTAmt = 0;//, grandWithouTax = 0;
            var memo = (t41.T41F10 < 0) ? "Debit Memo" : "Cash Memo";   // T41F10 = BillAmt
            var billNoText = "Bill No: ", chalanType = "";
            bNumOfPages = (t02s.length / productLimit);
            bNumOfPages = Math.ceil(bNumOfPages);
            city = t41.M02F09;  //City
            TinNo = t41.M02F08; //TinNo
            Comment = t41.T41F11; // Comment

            if (t41.T41F15 == null || t41.T41F15 == '') {
                t41.T41F15 = t41.T41F01;
            }

            //  Loop for use in Header and Footer for each page in Print
            for (var pIndex = 1; pIndex <= bNumOfPages; pIndex++) {
                printhtml = "";
                billAmt = 0;
                TotalQty = 0;
                itemAmt = 0;
                ////  Loop Product Wise (i.e. Voucher Items details) for Sales Bill Print Body.
                for (var k = 0; k < t02s.length; k++) {
                    var t02 = t02s[k];
                    if (t02.T02F01 > 0 && t41.State_Flag == 'I') {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            itemAmt += parseFloat(t02.T02F05);
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;
                            WithouTaxAmt = (t02.T02F17 / t02.T02F18).toFixed(2);   // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            //if (t02.T02F08 == 'Y') { GSTTotAmt = (t02.T02F09.toFixed(2) * t02.T02F03); } else { GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03); };
                            GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03);
                            grandItemRate += (WithouTaxAmt * t02.T02F03);

                            IGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F16) / 100).toFixed(2);

                            grandCGSTAmt += parseFloat(IGSTAmt);

                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }


                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b></b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b></b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>IGST</b></td><td align='center' colspan='2'><b></b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b></b></td><td><b></b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                    else if (t02.T02F01 > 0) {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            itemAmt += parseFloat(t02.T02F05);
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;
                            WithouTaxAmt = (t02.T02F17 / t02.T02F18).toFixed(2);   // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            //if (t02.T02F08 == 'Y') { GSTTotAmt = (t02.T02F09.toFixed(2) * t02.T02F03); } else { GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03); };
                            GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03);

                            grandItemRate += (WithouTaxAmt * t02.T02F03);
                            CGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F14) / 100).toFixed(2);
                            SGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F15) / 100).toFixed(2);
                            IGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F16) / 100).toFixed(2);

                            grandCGSTAmt += parseFloat(CGSTAmt);
                            grandSGSTAmt += parseFloat(SGSTAmt);
                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }


                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b></b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b></b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>CGST</b></td><td align='center' colspan='2'><b>SGST</b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b>%</b></td><td><b>Amt</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                }

                grandTotalQty += TotalQty;
                grandItemAmt += itemAmt;

                if (t02s.length < productLimit) {
                    addBlankRow = productLimit - t02s.length;
                    for (var row = 1; row <= addBlankRow; row++) {
                        printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                }
                else if (t02s.length > productLimit) {
                    page = (t02s.length - (t02s.length % productLimit)) / productLimit;
                    addBlankRow = t02s.length % (productLimit);
                    addBlankRow = productLimit - addBlankRow;
                    if (pIndex == ++page) {
                        for (var row = 1; row <= addBlankRow; row++) {
                            printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                        }
                    }
                }
                if (pIndex == bNumOfPages) {
                    if (pIndex == bNumOfPages) {
                        printhtml = printhtml + "<tr class='last'><td colspan='3'><b>Invoice Total</b></td><td align='right'><b>" + grandTotalQty + "</b></td><td>" + grandItemRate.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandCGSTAmt.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandSGSTAmt.toFixed(2) + "</td><td align='right'><b>" + grandItemAmt.toFixed(2) + "</b></td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center' style='min-width:10px;'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5" + "</td><td align='center'>#5RSTOT" + "</td><td align='center'>" + "#papad_5" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#10RSTOT" + "</td><td align='center'>" + "#papad_10" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#250GTOT" + "</td><td align='center'>" + "#papad_250gm" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm" + "</td><td align='center'>#fgm" + "</td><td align='center'>#wgm" + "</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                        //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                    }
                    else {
                        printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5 " + "</td><td align='center'>#papad_5 " + "</td><td align='center'>" + "#5RSTOT" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#papad_10" + "</td><td align='center'>" + "#10RSTOT" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#papad_250gm" + "</td><td align='center'>" + "#250GTOT" + "</td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm" + "</td><td align='center'>#fgm" + "</td><td align='center'>#wgm" + "</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                        //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                        printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                    }
                }
                else {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='2' align='center'>Item</td><td align='center'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>પાપડ</td><td align='center'>Total</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='2' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5 " + "</td><td align='center'>#papad_5 " + "</td><td align='center'>" + "#5RSTOT" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='2' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#papad_10" + "</td><td align='center'>" + "#10RSTOT" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='2' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#papad_250gm" + "</td><td align='center'>" + "#250GTOT" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm" + "</td><td align='center'>#fgm" + "</td><td align='center'>#wgm" + "</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'><b>GSTIN NUM. :" + TinNo + "<b/> * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                printhtml = SummaryBoxLanguage(printhtml);
                multiplePagePrintHtml += printhtml;
                bStartIndex = bStartIndex + productLimit;
            }
        }
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_5/g, namkin_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_10/g, namkin_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_250gm/g, namkin_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#ngm/g, namkin_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_5/g, frimes_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_10/g, frimes_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_250gm/g, frimes_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#fgm/g, frimes_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_5/g, papad_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_10/g, papad_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_250gm/g, papad_250gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_5/g, wafer_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_10/g, wafer_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_250gm/g, wafer_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wgm/g, wafer_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#5RSTOT/g, (namkin_5 + frimes_5 + wafer_5));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#10RSTOT/g, (namkin_10 + frimes_10 + wafer_10));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#250GTOT/g, (namkin_250gm + frimes_250gm));
        //multiplePagePrintHtml = multiplePagePrintHtml.replace(/#500GTOT/g, (namkin_500gm + frimes_500gm + wafer_500gm));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#looseTotal/g, (looseTotal));
    }
    if (record.t41.length > 1) {
        multiplePagePrintHtml += dealersummryBill(record.t41);
    }
    return multiplePagePrintHtml;
}

function NewPrintPurchaseReturnBill(record, IsInvoiceType) {
    var dealerGSTNo = '';
    var printhtml = "", vc = "", multiplePagePrintHtml = "";
    var bNumOfPages = 1;
    var productLimit = 18;
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Print Header Information.
    for (var i = 0; i < record.t41.length; i++) {
        var t41 = record.t41[i];
        var t02s = find_in_object(record.t02, { T02F01: t41.T41F01 });
        if (t41.T41F01 > 0 && t02s.length > 0) {
            var bStartIndex = 0;
            var j = 1, itemAmt = 0, billAmt = 0, TotalQty = 0, city, TinNo, Comment, PartyTinNo = '';
            var grandItemAmt = 0, grandTotalQty = 0, addBlankRow = 0, grandItemRate = 0;
            var grandCGSTAmt = 0, grandSGSTAmt = 0, grandIGSTAmt = 0;//, grandWithouTax = 0;
            var memo = (t41.T41F10 < 0) ? "Debit Memo" : "Cash Memo";   // T41F10 = BillAmt
            var billNoText = "Bill No: ", chalanType = "";
            bNumOfPages = (t02s.length / productLimit);
            bNumOfPages = Math.ceil(bNumOfPages);
            city = t41.M02F09;  //City
            TinNo = t41.M02F08; //TinNo
            Comment = t41.T41F11; // Comment

            //if ( t41.T41F15 == null || t41.T41F15 == '' ) {
            //    t41.T41F15 = t41.T41F01;
            //}

            //  Loop for use in Header and Footer for each page in Print
            for (var pIndex = 1; pIndex <= bNumOfPages; pIndex++) {
                printhtml = "";
                billAmt = 0;
                TotalQty = 0;
                itemAmt = 0;
                ////  Loop Product Wise (i.e. Voucher Items details) for Sales Bill Print Body.
                for (var k = 0; k < t02s.length; k++) {
                    var t02 = t02s[k];
                    if (t02.T02F01 > 0 && t41.State_Flag == 'I') {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            // itemAmt += parseFloat( t02.T02F05 );
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;
                            //  WithouTaxAmt = ( t02.T02F17 / t02.T02F18 ).toFixed( 2 );   // Without Tax Amount = GST Retailer Rate / Conversion Factor

                            WithouTaxAmt = (t02.T02F17).toFixed(2);   // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            // if ( t02.T02F08 == 'Y' ) { GSTTotAmt = ( t02.T02F09.toFixed( 2 ) * t02.T02F03 ); } else { GSTTotAmt = ( t02.T02F04.toFixed( 2 ) * t02.T02F03 ); };

                            grandItemRate += (WithouTaxAmt * t02.T02F03);

                            IGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F16) / 100).toFixed(2);
                            grandCGSTAmt += parseFloat(IGSTAmt);
                            GSTTotAmt = ((WithouTaxAmt * t02.T02F03) + parseFloat(IGSTAmt)).toFixed(2);
                            grandItemAmt += parseFloat(GSTTotAmt);
                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = '24AADCG6113A1ZD';
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. :  gopal sanacks pvt ltd" + "</b></td><td colspan='3'><b>" + t41.T41F14 + "</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b> Plot No. 2322-23-24, Road-F, Gate No. 2, Metoda G.I.D.C., Tal. Lodhika, Dist. Rajkot - 360021, Gujarat - India. </br><b>GST No. : 24AADCG6113A1ZD" + "</b></td><td colspan='3'><b></b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone: 02827 287 370" + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>IGST</b></td><td align='center' colspan='2'><b>&nbsp;</b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b>%</b></td><td><b>Amt</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F16 + "</td><td align='right'>" + IGSTAmt + "</td><td align='center'>" + "" + "</td><td align='right'>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                    else if (t02.T02F01 > 0) {
                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;
                            WithouTaxAmt = (t02.T02F17).toFixed(2);
                            grandItemRate += (WithouTaxAmt * t02.T02F03);
                            CGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F14) / 100).toFixed(2);
                            SGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F15) / 100).toFixed(2);
                            IGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F16) / 100).toFixed(2);

                            grandCGSTAmt += parseFloat(CGSTAmt);
                            grandSGSTAmt += parseFloat(SGSTAmt);
                            GSTTotAmt = ((WithouTaxAmt * t02.T02F03) + parseFloat(CGSTAmt) + parseFloat(SGSTAmt)).toFixed(2);
                            //grandWithouTax += parseFloat( WithouTaxAmt );
                            grandItemAmt += parseFloat(GSTTotAmt);
                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                console.log(t41.T41F14);
                                console.log(t41.T41F15);
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. :  gopal sanacks pvt ltd" + "</b></td><td colspan='3'><b>" + t41.T41F14 + "</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b> Plot No. 2322-23-24, Road-F, Gate No. 2, Metoda G.I.D.C., Tal. Lodhika, Dist. Rajkot - 360021, Gujarat - India. </br><b>GST No. : 24AADCG6113A1ZD" + "</b></td><td colspan='3'><b></b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone: 02827 287 370" + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>CGST</b></td><td align='center' colspan='2'><b>SGST</b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b>%</b></td><td><b>Amt</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='center'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td align='center'>" + t02.T02F14 + "</td><td align='right'>" + CGSTAmt + "</td><td align='center'>" + t02.T02F15 + "</td><td align='right'>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }

                }

                grandTotalQty += TotalQty;


                if (t02s.length < productLimit) {
                    addBlankRow = productLimit - t02s.length;
                    for (var row = 1; row <= addBlankRow; row++) {
                        printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                }
                else if (t02s.length > productLimit) {
                    page = (t02s.length - (t02s.length % productLimit)) / productLimit;
                    addBlankRow = t02s.length % (productLimit);
                    addBlankRow = productLimit - addBlankRow;
                    if (pIndex == ++page) {
                        for (var row = 1; row <= addBlankRow; row++) {
                            printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                        }
                    }
                }
                if (pIndex == bNumOfPages) {
                    if (pIndex == bNumOfPages) {
                        printhtml = printhtml + "<tr class='last'><td colspan='3'><b>Invoice Total</b></td><td align='right'><b>" + grandTotalQty + "</b></td><td>" + grandItemRate.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandCGSTAmt.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandSGSTAmt.toFixed(2) + "</td><td align='right'><b>" + grandItemAmt.toFixed(2) + "</b></td></tr>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' style='border:1px solid' align='right'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td></table>";
                    }
                    else {
                        printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' style='border:1px solid'  align='right'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td>";
                        printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td></table>";
                    }
                }
                else {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' style='border:1px solid'  align='right'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'><b>GSTIN NUM. :" + TinNo + "<b/> * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td></table>";
                }
                printhtml = SummaryBoxLanguage(printhtml);
                multiplePagePrintHtml += printhtml;
                bStartIndex = bStartIndex + productLimit;
            }
        }
    }
    return multiplePagePrintHtml;
}
//Function to check numeric values
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//Function to check numeric values
function isNumberWithSingleDecimal(event, obj) {
    var $this = $(obj);
    if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
       ((event.which < 48 || event.which > 57) &&
       (event.which != 0 && event.which != 8))) {
        event.preventDefault();
    }

    var text = $(this).val();
    if ((event.which == 46) && (text.indexOf('.') == -1)) {
        setTimeout(function () {
            if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
            }
        }, 1);
    }

    if ((text.indexOf('.') != -1) &&
    (text.substring(text.indexOf('.')).length > 2) &&
    (event.which != 0 && event.which != 8) &&
    ($(this)[0].selectionStart >= text.length - 2)) {
        event.preventDefault();
    }
}


function NewPrintSO(record, IsInvoiceType) {
    var dealerGSTNo = '';
    var printhtml = "", vc = "", multiplePagePrintHtml = "";
    var bNumOfPages = 1;
    var productLimit = 18;
    //  Loop Voucher Wise (i.e. Dealer and Party Detail, for Sales Bill Print Header Information.
    for (var i = 0; i < record.t41.length; i++) {
        var frimes_5 = 0, namkin_5 = 0, wafer_5 = 0, papad_5 = 0;
        var frimes_10 = 0, namkin_10 = 0, wafer_10 = 0, papad_10 = 0;
        var frimes_250gm = 0, namkin_250gm = 0, wafer_250gm = 0, papad_250gm = 0;
        var frimes_500gm = 0, namkin_500gm = 0, wafer_500gm = 0, papad_500gm = 0;
        var looseTotal = 0;
        var t41 = record.t41[i];
        var t02s = find_in_object(record.t02, { T02F01: t41.T41F01 });
        if (t41.T41F01 > 0 && t02s.length > 0) {
            var bStartIndex = 0;
            var j = 1, itemAmt = 0, billAmt = 0, TotalQty = 0, city, TinNo, Comment, PartyTinNo = '';
            var grandItemAmt = 0, grandTotalQty = 0, addBlankRow = 0, grandItemRate = 0;
            var grandCGSTAmt = 0, grandSGSTAmt = 0, grandIGSTAmt = 0;//, grandWithouTax = 0;
            var memo = (t41.T41F10 < 0) ? "Debit Memo" : "Cash Memo";   // T41F10 = BillAmt
            var billNoText = "Bill No: ", chalanType = "";
            bNumOfPages = (t02s.length / productLimit);
            bNumOfPages = Math.ceil(bNumOfPages);
            city = t41.M02F09;  //City
            TinNo = t41.M02F08; //TinNo
            Comment = t41.T41F11; // Comment

            if (t41.T41F15 == null || t41.T41F15 == '') {
                t41.T41F15 = t41.T41F01;
            }

            //  Loop for use in Header and Footer for each page in Print
            for (var pIndex = 1; pIndex <= bNumOfPages; pIndex++) {
                printhtml = "";
                billAmt = 0;
                TotalQty = 0;
                itemAmt = 0;
                ////  Loop Product Wise (i.e. Voucher Items details) for Sales Bill Print Body.
                for (var k = 0; k < t02s.length; k++) {
                    var t02 = t02s[k];
                    if (t02.T02F01 > 0 && t41.State_Flag == 'I') {

                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            itemAmt += parseFloat(t02.T02F05);
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;

                            WithouTaxAmt = ((t02.T02F04 * 100) / (t02.T02F16 + 100)).toFixed(2);  // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            //if (t02.T02F08 == 'Y') { GSTTotAmt = (t02.T02F09.toFixed(2) * t02.T02F03); } else { GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03); };
                            GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03).toFixed(2);
                            grandItemRate += (WithouTaxAmt * t02.T02F03);
                            IGSTAmt = (WithouTaxAmt * t02.T02F03 * t02.T02F16 / 100).toFixed(2);
                            grandCGSTAmt += parseFloat(IGSTAmt);

                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }

                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1' id='tblSaleOrderPreview' class='page' style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b>#InvoiceType</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b>#BillNoText</b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>IGST</b></td><td align='center' colspan='2'><b></b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b></b></td><td><b></b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td>" + t02.T02F16 + "</td><td>" + IGSTAmt + "</td><td>" + "" + "</td><td>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td>" + t02.T02F16 + "</td><td>" + IGSTAmt + "</td><td>" + "" + "</td><td>" + "" + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                    else if (t02.T02F01 > 0) {

                        if ((t02.M21F03).indexOf("100GM") >= 0 || (t02.M21F03).indexOf("200GM") >= 0) {
                            t02.M21F04 = "";
                        }
                        if (k < (pIndex * productLimit) && k >= bStartIndex) {
                            itemAmt += parseFloat(t02.T02F05);
                            TotalQty += t02.T02F03;
                            var CGSTRate = 0, CGSTAmt = 0, SGSTRate = 0, SGSTAmt = 0, WithouTaxAmt = 0;
                            var GSTTotAmt = 0; var IGSTAmt = 0;

                            //WithouTaxAmt = ((t02.T02F04 * 100) / (t02.T02F16 + 100)).toFixed(2);  // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            ////if (t02.T02F08 == 'Y') { GSTTotAmt = (t02.T02F09.toFixed(2) * t02.T02F03); } else { GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03); };
                            //GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03);
                            //grandItemRate += (WithouTaxAmt * t02.T02F03);
                            //IGSTAmt = (WithouTaxAmt * t02.T02F03 * t02.T02F16 / 100).toFixed(2);
                            //grandCGSTAmt += parseFloat(IGSTAmt);




                            WithouTaxAmt = ((t02.T02F04 * 100) / (t02.T02F14 + t02.T02F15 + 100)).toFixed(2);   // Without Tax Amount = GST Retailer Rate / Conversion Factor
                            //if (t02.T02F08 == 'Y') { GSTTotAmt = (t02.T02F09.toFixed(2) * t02.T02F03); } else { GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03); };
                            GSTTotAmt = (t02.T02F04.toFixed(2) * t02.T02F03).toFixed(2);

                            grandItemRate += (WithouTaxAmt * t02.T02F03);
                            CGSTAmt = ((WithouTaxAmt * t02.T02F03 * t02.T02F14) / 100).toFixed(2);
                            SGSTAmt = ((WithouTaxAmt * t02.T02F03 * t02.T02F15) / 100).toFixed(2);
                            //IGSTAmt = (((WithouTaxAmt * t02.T02F03) * t02.T02F16) / 100).toFixed(2);
                            grandCGSTAmt += parseFloat(CGSTAmt);
                            grandSGSTAmt += parseFloat(SGSTAmt);

                            if (t02.M21F06 == 'LOOSE') {
                                looseTotal = looseTotal + t02.T02F03;
                            }
                            if (t02.M21F11 == 'F') {
                                if (t02.M21F03 == "5RS") {
                                    frimes_5 = frimes_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    frimes_10 = frimes_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    frimes_250gm = frimes_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    frimes_500gm = frimes_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N' && (t02.M21F06 == 'MASALA BITE' || t02.M21F06 == 'SALTY PUNCH' || t02.M21F06 == 'TOMATO MUNCHIES')) {
                                if (t02.M21F03 == "5RS") {
                                    wafer_5 = wafer_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    wafer_10 = wafer_10 + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'N') {
                                if (t02.M21F03 == "5RS") {
                                    namkin_5 = namkin_5 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "10RS") {
                                    namkin_10 = namkin_10 + t02.T02F03;
                                }
                                else if (t02.M21F03 == "250G") {
                                    namkin_250gm = namkin_250gm + t02.T02F03;
                                }
                                else if (t02.M21F03 == "500G" || t02.M21F03 == "400G") {
                                    namkin_500gm = namkin_500gm + t02.T02F03;
                                }
                            }
                            else if (t02.M21F11 == 'P') {
                                papad_5 = papad_5 + t02.T02F03;
                            }


                            if (k == (bStartIndex)) {
                                var title = "";
                                if (IsInvoiceType) {
                                    title = 'TAX INVOICE';
                                    billNoText = "Bill No: ";
                                }
                                else {
                                    title = 'Estimation';
                                    billNoText = "";
                                }

                                PartyTinNo = t41.M05F11;
                                chalanType = "";
                                printhtml = printhtml + "<table border='1'  class='page'  style='font-size:13px;border-spacing: 1px;'><tr><td colspan='7'><b>" + t41.M02F02 + "<br/>" + t41.Address + "<br/>" + t41.M02F06 + "</td><td colspan='3'><center><img src='/Content/imgs/gs.png' height='45' width='45'/></center></td></tr>";
                                printhtml = printhtml + "<tr><td colspan='7'><b>M/S. : " + t41.M05F04 + "</b></td><td colspan='3'><b>#InvoiceType</b></td></tr><tr><td colspan='7' style='font-size:12px;'><b>Address :</b>" + t41.ShopAddress + "</br><b>GST No. :" + PartyTinNo + "</b></td><td colspan='3'><b>#BillNoText</b>" + t41.T41F15 + "</td></tr><tr><td colspan='7' style='font-size:12px;'><b>Phone:" + t41.M05F08 + " - " + t41.M05F03 + "</b></td><td colspan='3'><b>Dt.: </b>" + t41.T41F03 + "</td></tr>";
                                printhtml = printhtml + "<tr><td align='right' rowspan='2'><b>No.</b></td><td rowspan='2'><b>HSN</b></td><td rowspan='2' style='min-width:150px;'><b>Item Name</b></td><td align='right' rowspan='2'><b>Qty</b></td><td align='right' rowspan='2'><b>Rate</b></td><td align='center' colspan='2'><b>CGST</b></td><td align='center' colspan='2'><b>SGST</b></td><td align='right' rowspan='2'><b>Total</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'><b>%</b></td><td><b>Amt</b></td><td align='right'><b>%</b></td><td><b>Amt</b></td></tr>";
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td>" + t02.T02F14 + "</td><td>" + CGSTAmt + "</td><td>" + t02.T02F15 + "</td><td>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                            else {
                                printhtml = printhtml + "<tr><td align='right'>" + (k + 1) + "</td><td>" + t02.M21F13 + "</td><td>" + t02.M21F08 + " " + t02.M21F04 + "</td><td align='right'>" + t02.T02F03 + "</td><td align='right'>" + WithouTaxAmt + "</td><td>" + t02.T02F14 + "</td><td>" + CGSTAmt + "</td><td>" + t02.T02F15 + "</td><td>" + SGSTAmt + "</td><td align='right'>" + GSTTotAmt + "</td></tr>"; //t02.T02F05.toFixed(2)
                            }
                        }
                    }
                }


                grandTotalQty += TotalQty;
                grandItemAmt += itemAmt;

                if (t02s.length < productLimit) {
                    addBlankRow = productLimit - t02s.length;
                    for (var row = 1; row <= addBlankRow; row++) {
                        printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                    }
                }
                else if (t02s.length > productLimit) {
                    page = (t02s.length - (t02s.length % productLimit)) / productLimit;
                    addBlankRow = t02s.length % (productLimit);
                    addBlankRow = productLimit - addBlankRow;
                    if (pIndex == ++page) {
                        for (var row = 1; row <= addBlankRow; row++) {
                            printhtml = printhtml + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                        }
                    }
                }

                if (pIndex == bNumOfPages) {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'><b>Invoice Total</b></td><td align='right'><b>" + grandTotalQty + "</b></td><td>" + grandItemRate.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandCGSTAmt.toFixed(2) + "</td><td>&nbsp;</td><td>" + grandSGSTAmt.toFixed(2) + "</td><td align='right'><b>" + grandItemAmt.toFixed(2) + "</b></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center' style='min-width:10px;'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5" + "</td><td align='center'>#5RSTOT" + "</td><td align='center'>" + "#papad_5" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#10RSTOT" + "</td><td align='center'>" + "#papad_10" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#250GTOT" + "</td><td align='center'>" + "#papad_250gm" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm</td><td align='center'>#fgm</td><td align='center'>#wgm</td><td colspan='4'>Generated On: </td></tr>";
                    //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: </td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                else {
                    printhtml = printhtml + "<tr class='last'><td colspan='3'>&nbsp;</td><td align='right'>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align='right'>&nbsp;</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='center'>Item</td><td align='center'>નમકીન</td><td align='center'>ફ્રાયમ્સ</td><td align='center'>વેફર</td><td align='center'>Total</td><td align='center'>પાપડ</td><td colspan='3' rowspan='4'><div><div>" + t41.M02F02 + "</div><div style='padding-bottom: 15px;'>.</div><div>Authorised Sign.</div></div></td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.5/-પટ્ટી</td><td align='center'>#namkin_5" + "</td><td align='center'>#frimes_5" + "</td><td align='center'>#wafer_5 " + "</td><td align='center'>#5RSTOT " + "</td><td align='center'>" + "#papad_5" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Rs.10/-પટ્ટી</td><td align='center'>#namkin_10" + "</td><td align='center'>#frimes_10" + "</td><td align='center'>#wafer_10" + "</td><td align='center'>#10RSTOT" + "</td><td align='center'>" + "#papad_10" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>250 gm પાઉચ</td><td align='center'>#namkin_250gm" + "</td><td align='center'>#frimes_250gm" + "</td><td align='center'>#wafer_250gm" + "</td><td align='center'>#250GTOT" + "</td><td align='center'>" + "#papad_250gm" + "</td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'>#ngm</td><td align='center'>#fgm</td><td align='center'>#wgm</td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    //printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>500 gm પાઉચ</td><td align='center'></td><td align='center'></td><td align='center'></td><td colspan='4'>Generated On: " + t41.S01F02 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last' style='font-size:11px;'><td colspan='3' align='left'>Loose </td><td align='center'>#looseTotal" + "</td><td align='center'></td><td align='center'></td><td colspan='4'>Shop Close Time: " + t41.M05F15 + " </td></tr>";
                    printhtml = printhtml + "<tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'> • Comments : " + Comment + "</td></tr><tr class='last'><td colspan='10' cellspacing='0' style='font-size:10px;'>GSTIN NUM. :" + TinNo + " * માલ ચેક કરી ને ઉતારવો * Subject to " + city + " Jurisdiction.</td><tr class='last'><td colspan='10' style='font-size:13px;' cellspacing='0'><b>Order By: " + t41.SalesPerson + ' - ' + t41.SalesPersonMobile + "</b></td></tr></table>";
                }
                printhtml = SummaryBoxLanguage(printhtml);
                multiplePagePrintHtml += printhtml;
                bStartIndex = bStartIndex + productLimit;
            }
        }

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_5/g, namkin_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_10/g, namkin_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#namkin_250gm/g, namkin_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#ngm/g, namkin_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_5/g, frimes_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_10/g, frimes_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#frimes_250gm/g, frimes_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#fgm/g, frimes_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_5/g, papad_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_10/g, papad_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#papad_250gm/g, papad_250gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_5/g, wafer_5);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_10/g, wafer_10);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wafer_250gm/g, wafer_250gm);
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#wgm/g, wafer_500gm);

        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#5RSTOT/g, (namkin_5 + frimes_5 + wafer_5));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#10RSTOT/g, (namkin_10 + frimes_10 + wafer_10));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#250GTOT/g, (namkin_250gm + frimes_250gm));
        //multiplePagePrintHtml = multiplePagePrintHtml.replace(/#500GTOT/g, (namkin_500gm + frimes_500gm + wafer_500gm));
        multiplePagePrintHtml = multiplePagePrintHtml.replace(/#looseTotal/g, (looseTotal));
    }
    if (record.t41.length > 1) {
        multiplePagePrintHtml += dealersummryBill(record.t41);
    }
    return multiplePagePrintHtml;
}

function SummaryBoxLanguage(printhtml) {

    if ($("#hdDealerLanguage").val() == "2") {
        printhtml = printhtml.replace(/પટ્ટી/g, 'Strip');
        printhtml = printhtml.replace(/નમકીન/g, 'Namkeen');
        printhtml = printhtml.replace(/વેફર/g, 'Wafer');
        printhtml = printhtml.replace(/પાપડ/g, 'Papad');
        printhtml = printhtml.replace(/પાઉચ/g, 'Bag');
        printhtml = printhtml.replace(/ફ્રાયમ્સ/g, 'Framyas');
        printhtml = printhtml.replace(/માલ ચેક કરી ને ઉતારવો/g, 'Check out the goods');

    }
    else if ($("#hdDealerLanguage").val() == "1") {
        printhtml = printhtml.replace(/પટ્ટી/g, 'पट्टी');
        printhtml = printhtml.replace(/નમકીન/g, 'नमकीन');
        printhtml = printhtml.replace(/વેફર/g, 'वेफर');
        printhtml = printhtml.replace(/પાપડ/g, 'पापड़');
        printhtml = printhtml.replace(/પાઉચ/g, 'बेग');
        printhtml = printhtml.replace(/ફ્રાયમ્સ/g, 'फ्राम्य्स');
        printhtml = printhtml.replace(/માલ ચેક કરી ને ઉતારવો/g, 'सामान जांच करके उतारे');

    }
    return printhtml;
}
function dealersummryBill(record) {
    var DealerBillSumary = "";
    DealerBillSumary = "<table border='1' class='page'> <tr align='center'> <td colspan='5'> <b>#DealerName</b> </td> </tr> <tr> <td colspan='5'>  </td> </tr> <tr> <td colspan='5'> RootName :- #RootName </td> </tr> <tr> <td><b>No.</b></td> <td><b>Bill No.</b></td> <td><b>Party Name</b></td> <td><b>Mo.No.</b></td> <td><b>Amount</b></td> </tr> "
    var routename = "";
    var billamttottal = 0;
    DealerBillSumary = DealerBillSumary.replace(/#DealerName/g, record[0].M02F02);
    for (var i = 0; i < record.length; i++) {
        if (routename.indexOf(record[i].M04F03) <= 0)
            routename = routename + "," + record[i].M04F03;
        billamttottal = billamttottal + record[i].T41F09;
        var newrow = "<tr><td>" + (i + 1) + "</td><td>" + record[i].T41F15 + "</td><td>" + record[i].M05F04 + "</td><td>" + record[i].M05F08 + "</td><td align=right> " + record[i].T41F09 + "</td></tr>";
        DealerBillSumary = DealerBillSumary + newrow;
    }
    // DealerBillSumary = DealerBillSumary.replace( /#Date/g, T41F03 );
    DealerBillSumary = DealerBillSumary.replace(/#RootName/g, routename);
    DealerBillSumary = DealerBillSumary + "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>" + "<tr><td></td><td></td><td>Total</td><td></td><td align=right> " + billamttottal + "</td></tr>";
    DealerBillSumary += "</table>"
    return DealerBillSumary;
}

function addDaysToCurrentDate(days) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + parseInt(days));
    return currentDate;
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}
function ValidateOldOperation(OptDate) {
    var result = true;
    if ($("#hdn_DealerBackDays").val().length > 0) {
        var dtParts = OptDate.split("/");
        var sbDate = new Date(dtParts[2], dtParts[1] - 1, dtParts[0]);
        var currentDate = addDaysToCurrentDate(-parseInt($("#hdn_DealerBackDays").val()));
        if (sbDate.withoutTime() < currentDate.withoutTime()) {
            result = false;
        }
        else {
            result = true;
        }
    }
    return result;
}
function IsValidForBackDateOrderOperation(vouDate, NumOfBackDay) {
    var result = true;
    if (NumOfBackDay > 0) {
        var dtParts = vouDate.split("/");
        var sbDate = new Date(dtParts[2], dtParts[1] - 1, dtParts[0]);
        var backDate = addDaysToCurrentDate(-NumOfBackDay);
        if (sbDate.withoutTime() < backDate.withoutTime()) {
            result = false;
        }
        else {
            result = true;
        }
    }
    return result;
}

//  Checking if Allowed Half Stipe Qty or not, 9999.99 max value allowed
function funAllowHalfStripe(rights, fieldValue, allow) {
    // checking dealer's half stripe rights
    if (rights != '' & rights.indexOf("H") > -1) {
        if (allow == "1") {
            var halfStripeRegex = /^[0-9]{1,4}(?:\.5|\.50|)$/;
            if (!halfStripeRegex.test(fieldValue))
                return 'NOT ALLOWED';
            else
                return 'OK';
        }
        else {
            var halfStripeRegex = /^[0-9]{1,4}$/;
            if (!halfStripeRegex.test(fieldValue))
                return 'NOT ALLOWED';
            else
                return 'OK';
        }
    }
    else {
        var halfStripeRegex = /^[0-9]{1,4}$/;
        if (!halfStripeRegex.test(fieldValue))
            return 'NOT ALLOWED';
        else
            return 'OK';
    }
}
//  999999.99 max value allowed as a price
function funAllowRateValidate(fieldValue) {
    var halfStripeRegex = /^\-?[0-9]{1,6}(\.[0-9]{1,2})?$/;
    if (!halfStripeRegex.test(fieldValue))
        return 'NOT ALLOWED';
    else
        return 'OK';
}
//// Allow Half Strip Option for Entry Forms (SR, PV, SO, SI)
function AllowHalfStripeForEntryForm(control, rights, allow) {
    // checking dealer's half stripe rights
    if (rights != '' & rights.indexOf("H") > -1) {
        if (allow == "1") {
            var halfStripeRegex = /^\-?[0-9]{1,4}(?:\.|\.5|\.50|)$/;
            if (!halfStripeRegex.test(control.value))
                control.value = control.value.substring(0, control.value.length - 1);
        }
        else {
            var halfStripeRegex = /^\-?[0-9]{1,4}$/;
            if (!halfStripeRegex.test(control.value))
                control.value = control.value.substring(0, control.value.length - 1);
        }
    }
    else {
        var halfStripeRegex = /^\-?[0-9]{1,4}$/;
        if (!halfStripeRegex.test(control.value))
            control.value = control.value.substring(0, control.value.length - 1);
    }
}
function RemoveLastDecimal(control) {
    if (control.value.substring(control.value.length - 1) == ".")
        control.value = control.value.substring(0, control.value.length - 1);
}
$("#messageDialog").dialog({
    autoOpen: false,
    closeOnEscape: true,
    minWidth: 400,
    minHeight: 100,
    modal: true,
    buttons: [{
        text: 'close',
        click: function () {
            $("#messageDialog").dialog('close');
        },
        class: 'btn btn-warning'
    }],
    open: function () {
        $('body').css('overflow', 'hidden');
    },
    close: function () {
        $('body').css('overflow', 'auto');
    }
}); // end of dialog
function SetDialogMessage(message) {
    $("#messageDialog").html(message);
    $("#messageDialog").dialog('option', 'title', 'Message Box');
    $("#messageDialog").dialog('open');
}
function CloseDialog() {
    $("#messageDialog").dialog('close');
}
function filter() {
    if ($('#ExpandFilter').hasClass('fa fa-chevron-down panelIcon')) {
        $('#ExpandFilter').removeClass('fa fa-chevron-down panelIcon');
        $('#ExpandFilter').addClass('fa fa-chevron-up panelIcon');
    } else {
        $('#ExpandFilter').removeClass('fa fa-chevron-up panelIcon');
        $('#ExpandFilter').addClass('fa fa-chevron-down panelIcon');
    }
}
$('#zoom').click(function (e) {
    $('#ReportDiv').toggleClass('fullscreen');
    $('#zoom').toggleClass('fa-compress');
    $('#ExpBody').toggleClass('ExpBody scrollbarExp style-3');
});