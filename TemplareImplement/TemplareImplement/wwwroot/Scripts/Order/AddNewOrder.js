$(document).ready(function () {
    AddNewRow(1);
});

function AddNewItem() {
    AddNewRow(($('.Ttbody tr').length + 1));
}
function AddNewRow(no) {
    var tr = "<tr>" +
        "<td>" + no + "</td>" +
        "<td><select id='ddlItem_" + no + "' onchange=\"getval(this);\"></select></td>" +
        "<td><input id='txtDesc_" + no + "' type='text'/></td>" +
        "<td><input id='txtPrice_" + no + "' value='0' readonly type='text'/></td>" +
        "<td><input id='txtQty_" + no + "' onkeyup=\"ChangeQtyVal(this);\" type='text'/></td>" +
        "<td><input id='txtText_" + no + "' value='0' onkeyup=\"ChangeQtyVal(this);\" type='text'/></td>" +
        "<td><input id='txtAmount_" + no + "' value='0' readonly type='text'/></td>" +
        +"</tr>";
    $(".Ttbody").append(tr);
    BindProducts(no);
}

function BindProducts(ddlId) {
    $.ajax({
        type: "POST",
        url: "/Common/GetProducts",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                $("#ddlItem_" + ddlId).append('<option selected="selected" value="0">--Select Product--</option>');
                for (var i = 0; i < data.length; i++) {
                    $("#ddlItem_" + ddlId).append($("<option     />").val(data[i].ProductID).text(data[i].ProductName));
                }
            } else { $("#ddlItem_" + ddlId).append('<option selected="selected" value="0">--Select Product--</option>'); }
        },
        failure: function () {
            alert('An error has occured: ' + "Failed!");
        }
    });
}

function getval(obj) {
    var mainid = $(obj).attr("id");
    var PriceId = mainid.split('_')[1];
    $.ajax({
        type: "POST",
        //url: "/Common/GetPrice?ProductId=" + obj.value,
        url: "/Common/GetPrice?ProductId=" + PriceId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //data: obj.value,
        success: function (data) {
            $("#txtPrice_" + PriceId).val(data[0].ProductPrice);
        },
        failure: function () {
            alert('An error has occured: ' + "Failed!");
        }
    });
}

function ChangeQtyVal(obj) {
    var mainid = $(obj).attr("id");
    var PriceId = mainid.split('_')[1];

    var TotalAmount = $("#txtPrice_" + PriceId).val() * $("#txtQty_" + PriceId).val();
    $("#txtAmount_" + PriceId).val(TotalAmount);

    makeTotalAmount();
}

function makeTotalAmount() {
    var TotalAmount = 0;
    var TotalTax = 0;
    var TotalGrand = 0;
    var TotalTaxAmt = 0;
    for (var i = 0; i < $('.Ttbody tr').length; i++) {
        TotalAmount = parseFloat(TotalAmount) + parseFloat($("#txtAmount_" + (i + 1)).val());
        TotalTax = parseFloat(TotalTax) + parseFloat($("#txtText_" + (i + 1)).val());
    }
    TotalTaxAmt = parseFloat(((TotalAmount * TotalTax) / 100));
    TotalGrand = TotalAmount + TotalTaxAmt;
    $("#SubTotal").val(TotalAmount);
    $("#TotalTax").val(TotalTaxAmt);
    $("#GrandTotal").val(TotalGrand);
}


function saveData() {
    var logo = $('#invFile')[0].files[0];
    var InvoiceMasters = {
        InvoiceId: 0,
        CustomerId: $("#ddlCutomer").val(),
        InvoiceNo: $("#InvoiceNo").val(),
        InvoiceDate: $("#InvoiceDate").val(),
        DueDate: $("#DueDate").val(),
        Status: $("#ddlStatus").val(),
        TotalItems: 0,
        InvoiceNote: $("#InvoiceNote").val(),
        //InvoiceFile: $("#ddlCutomer").val(),
        SubTotal: $("#SubTotal").val(),
        TotalTax: $("#TotalTax").val(),
        GrandTotal: $("#GrandTotal").val(),
        InvoiceDetails: []
    }
    for (var i = 0; i < $('.Ttbody tr').length; i++) {
        var itemDetail = {
            InvoiceId: 0,
            ItemId: $("#ddlItem_" + (i + 1)).val(),
            ItemDescription: $("#txtDesc_" + (i + 1)).val(),
            Price: $("#txtPrice_" + (i + 1)).val(),
            Qty: $("#txtQty_" + (i + 1)).val(),
            Tax: $("#txtText_" + (i + 1)).val(),
            Total: $("#txtAmount_" + (i + 1)).val()
        };
        InvoiceMasters.InvoiceDetails.push(itemDetail);
    }
    $.ajax({
        type: "POST",
        cache: false,
        url: "/Invoice/SaveData",
        contentType: 'application/json',
        data: JSON.stringify(InvoiceMasters),
        dataType: "json",

        //type: 'POST',
        //url: '/Invoice/SaveData',
        //data: JSON.stringify({ InvoiceMaster: InvoiceMasters, inputFile: logo }),
        //datatype: "json",
        //contentType: "application/json; charset=utf-8",
        //processData: false,
        success: function (data) {
            alert(data.responseText);
            location.reload();
        },
        error: function () {
            alert('error');
        }
    });
}