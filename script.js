// Auto set current date & time
document.getElementById("dateTime").textContent = new Date().toLocaleString();

// Add new item row
function addItem() {
    const table = document.getElementById("itemsBody");
    const rowCount = table.rows.length;
    const row = table.insertRow();

    row.innerHTML = `
        <td class="serial">${rowCount + 1}</td>
        <td><input type="text" class="editable-input desc expand-description" placeholder="Description"></td>
        <td class="hsn-col"><input type="text" class="editable-input hsn alphaNum shrink-input" placeholder="HSN/SAC"></td>
        <td><input type="number" class="editable-input qty numOnly shrink-input" value="1"></td>
        <td><input type="number" class="editable-input rate rate-field numOnly wide-rate" value="0"></td>
        <td class="cgst-col"><input type="number" class="editable-input cgst numOnly shrink-input" value="9"></td>
        <td class="sgst-col"><input type="number" class="editable-input sgst numOnly shrink-input" value="9"></td>
        <td class="igst-col" style="display: none;"><input type="number" class="editable-input igst numOnly shrink-input" value="18"></td>
        <td class="taxableValue">0.00</td>
        <td class="cgstAmount cgst-col">0.00</td>
        <td class="sgstAmount sgst-col">0.00</td>
        <td class="igstAmount igst-col" style="display: none;">0.00</td>
        <td class="totalAmount">0.00</td>
        <td><button type="button" onclick="removeItem(this)">Remove</button></td>
    `;

    addInputListeners(row);
    toggleIGSTView();
    calculateGrandTotal();
}


// Remove item row
function removeItem(button) {
    const row = button.closest("tr");
    row.remove();
    updateSerialNumbers();
    calculateGrandTotal();
}

// Update serial numbers
function updateSerialNumbers() {
    const rows = document.querySelectorAll("#itemsBody tr");
    rows.forEach((row, index) => {
        row.querySelector(".serial").textContent = index + 1;
    });
}

// Recalculate totals
function calculateGrandTotal() {
    let grandTotal = 0;
    const isIGST = document.getElementById("isIGST").checked;

    document.querySelectorAll("#itemsBody tr").forEach(row => {
        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const cgst = parseFloat(row.querySelector(".cgst").value) || 0;
        const sgst = parseFloat(row.querySelector(".sgst").value) || 0;
        const igstInput = row.querySelector(".igst");
        const igst = igstInput ? parseFloat(igstInput.value) || 0 : 0;

        const taxableValue = qty * rate;
        let cgstAmt = 0, sgstAmt = 0, igstAmt = 0;

        if (isIGST) {
            igstAmt = (taxableValue * igst) / 100;
        } else {
            cgstAmt = (taxableValue * cgst) / 100;
            sgstAmt = (taxableValue * sgst) / 100;
        }

        const total = taxableValue + cgstAmt + sgstAmt + igstAmt;

        row.querySelector(".taxableValue").textContent = taxableValue.toFixed(2);
        row.querySelector(".cgstAmount").textContent = cgstAmt.toFixed(2);
        row.querySelector(".sgstAmount").textContent = sgstAmt.toFixed(2);
        if (row.querySelector(".igstAmount")) {
            row.querySelector(".igstAmount").textContent = igstAmt.toFixed(2);
        }
        row.querySelector(".totalAmount").textContent = total.toFixed(2);

        grandTotal += total;
    });

    const discount = parseFloat(document.getElementById("discount").value) || 0;
    const shipping = parseFloat(document.getElementById("shipping").value) || 0;
    const finalAmount = grandTotal - discount + shipping;

    document.getElementById("grandTotal").textContent = finalAmount.toFixed(2);
}

// Add input listeners to row inputs
function addInputListeners(row) {
    const inputs = row.querySelectorAll("input.qty, input.rate, input.cgst, input.sgst, input.igst");
    inputs.forEach(input => {
        input.addEventListener("input", calculateGrandTotal);
    });
}

// Toggle IGST view based on checkbox
function toggleIGSTView() {
    const isIGST = document.getElementById("isIGST").checked;
    document.querySelectorAll(".cgst-col, .sgst-col").forEach(el => {
        el.style.display = isIGST ? "none" : "";
    });
    document.querySelectorAll(".igst-col").forEach(el => {
        el.style.display = isIGST ? "" : "none";
    });
}

function toggleHSN() {
    const isChecked = document.getElementById('toggleHSN').checked
    const hsnColumns = document.querySelectorAll('th:nth-child(3), td:nth-child(3)')
    hsnColumns.forEach(col => col.style.display = isChecked ? '' : 'none')
}


// PDF Download
function downloadPDF() {
    const invoice = document.querySelector(".invoice-box");
    const opt = {
        margin: 0.5,
        filename: `invoice_${new Date().getTime()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(invoice).set(opt).save();
}

// Validation for keypress
document.addEventListener("keypress", function (e) {
    const target = e.target;
    if (target.classList.contains("numOnly") && !/[0-9.]/.test(e.key)) e.preventDefault();
    if (target.classList.contains("alphaOnly") && !/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
    if (target.classList.contains("alphaNum") && !/[a-zA-Z0-9\s]/.test(e.key)) e.preventDefault();
});

// Live calculate on field input
document.addEventListener("input", function (e) {
    if (e.target.classList.contains("qty") || e.target.classList.contains("rate") || e.target.classList.contains("cgst") || e.target.classList.contains("sgst") || e.target.classList.contains("igst")) {
        calculateGrandTotal();
    }
});

// Initialize listeners on page load
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#itemsBody tr").forEach(addInputListeners);

    document.getElementById("discount").addEventListener("input", calculateGrandTotal);
    document.getElementById("shipping").addEventListener("input", calculateGrandTotal);
    document.getElementById("isIGST").addEventListener("change", () => {
        toggleIGSTView();
        calculateGrandTotal();
    });

    toggleIGSTView();
    calculateGrandTotal();
});
