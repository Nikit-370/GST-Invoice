// window.onload = () => {
//     updateDateTime();
//     generateInvoiceNo();
//     calculateGrandTotal();
// };

// function updateDateTime() {
//     const now = new Date();
//     const formatted = now.toLocaleString('en-IN', {
//         day: '2-digit', month: '2-digit', year: 'numeric',
//         hour: '2-digit', minute: '2-digit', second: '2-digit',
//         hour12: true
//     });
//     document.getElementById('dateTime').textContent = formatted;
// }

// function generateInvoiceNo() {
//     const now = new Date();
//     const timeStamp = now.getFullYear().toString().slice(-2) +
//         String(now.getMonth() + 1).padStart(2, '0') +
//         String(now.getDate()).padStart(2, '0') +
//         String(now.getHours()).padStart(2, '0') +
//         String(now.getMinutes()).padStart(2, '0');
//     const invoiceNo = `INV${timeStamp}`;
//     document.getElementById('invoiceNo').textContent = invoiceNo;
// }

// function addItem() {
//     const tbody = document.getElementById('itemsBody');
//     const rowCount = tbody.rows.length + 1;
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td class="serial">${rowCount}</td>
//         <td contenteditable="true" data-placeholder="Description" class="editable"></td>
//         <td contenteditable="true" data-placeholder="HSN/SAC" class="editable alphaNum hsn"></td>
//         <td contenteditable="true" data-placeholder="Qty" class="editable numOnly qty">1</td>
//         <td contenteditable="true" data-placeholder="Rate" class="editable numOnly rate">0</td>
//         <td contenteditable="true" data-placeholder="CGST %" class="editable numOnly cgst">9</td>
//         <td contenteditable="true" data-placeholder="SGST %" class="editable numOnly sgst">9</td>
//         <td class="taxableValue">0.00</td>
//         <td class="cgstAmount">0.00</td>
//         <td class="sgstAmount">0.00</td>
//         <td class="totalAmount">0.00</td>
//         <td><button type="button" onclick="removeItem(this)">Remove</button></td>
//     `;
//     tbody.appendChild(row);
//     calculateGrandTotal(); // Auto calculate after adding
// }

// function removeItem(button) {
//     const row = button.closest('tr');
//     row.remove();
//     updateSerialNumbers();
//     calculateGrandTotal();
// }

// function updateSerialNumbers() {
//     const serials = document.querySelectorAll('#itemsBody .serial');
//     serials.forEach((cell, idx) => {
//         cell.textContent = idx + 1;
//     });
// }

// function calculateGrandTotal() {
//     const rows = document.querySelectorAll('#itemsBody tr');
//     const isIGST = document.getElementById('isIGST')?.checked;
//     let grandTotal = 0;

//     rows.forEach(row => {
//         const qty = parseFloat(row.querySelector('.qty')?.textContent) || 0;
//         const rate = parseFloat(row.querySelector('.rate')?.textContent) || 0;
//         const cgstRate = parseFloat(row.querySelector('.cgst')?.textContent) || 0;
//         const sgstRate = parseFloat(row.querySelector('.sgst')?.textContent) || 0;

//         const taxableValue = qty * rate;

//         let cgstAmount = 0, sgstAmount = 0, igstAmount = 0;

//         if (isIGST) {
//             igstAmount = taxableValue * ((cgstRate + sgstRate) / 100);
//         } else {
//             cgstAmount = taxableValue * (cgstRate / 100);
//             sgstAmount = taxableValue * (sgstRate / 100);
//         }

//         const totalAmount = taxableValue + cgstAmount + sgstAmount + igstAmount;

//         row.querySelector('.taxableValue').textContent = taxableValue.toFixed(2);
//         row.querySelector('.cgstAmount').textContent = isIGST ? '0.00' : cgstAmount.toFixed(2);
//         row.querySelector('.sgstAmount').textContent = isIGST ? '0.00' : sgstAmount.toFixed(2);
//         row.querySelector('.totalAmount').textContent = totalAmount.toFixed(2);

//         grandTotal += totalAmount;
//     });

//     const discount = parseFloat(document.getElementById('discount')?.value) || 0;
//     const shipping = parseFloat(document.getElementById('shipping')?.value) || 0;

//     grandTotal = grandTotal - discount + shipping;
//     document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
// }

// function downloadPDF() {
//     const element = document.querySelector('.invoice-box');
//     const opt = {
//         margin: 0.5,
//         filename: document.getElementById('invoiceNo').textContent + '.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//     };
//     html2pdf().set(opt).from(element).save();
// }

// // Input validation for editable cells
// document.addEventListener('keypress', function (e) {
//     const target = e.target;
//     if (target.classList.contains('numOnly') && !/[0-9.]/.test(e.key)) e.preventDefault();
//     if (target.classList.contains('alphaOnly') && !/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
//     if (target.classList.contains('alphaNum') && !/[a-zA-Z0-9\s]/.test(e.key)) e.preventDefault();
// });

// // Recalculate on input change in relevant fields
// document.addEventListener('input', function (e) {
//     if (
//         e.target.classList.contains('numOnly') ||
//         e.target.classList.contains('qty') ||
//         e.target.classList.contains('rate') ||
//         e.target.classList.contains('cgst') ||
//         e.target.classList.contains('sgst')
//     ) {
//         calculateGrandTotal();
//     }
// });


// Auto set date and time
document.getElementById("dateTime").textContent = new Date().toLocaleString();

// Add item row
function addItem() {
    const table = document.getElementById("itemsBody");
    const rowCount = table.rows.length;
    const row = table.insertRow();

    row.innerHTML = `
        <td class="serial">${rowCount + 1}</td>
        <td><input type="text" class="editable-input" placeholder="Description"></td>
        <td><input type="text" class="editable-input hsn" placeholder="HSN/SAC"></td>
        <td><input type="number" class="editable-input qty" value="1" min="1"></td>
        <td><input type="number" class="editable-input rate" value="0" min="0"></td>
        <td><input type="number" class="editable-input cgst" value="9" min="0"></td>
        <td><input type="number" class="editable-input sgst" value="9" min="0"></td>
        <td class="taxableValue">0.00</td>
        <td class="cgstAmount">0.00</td>
        <td class="sgstAmount">0.00</td>
        <td class="totalAmount">0.00</td>
        <td><button type="button" onclick="removeItem(this)">Remove</button></td>
    `;

    addInputListeners(row);
    calculateGrandTotal();
}

// Remove item row
function removeItem(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateSerialNumbers();
    calculateGrandTotal();
}

// Update serial numbers after row removal
function updateSerialNumbers() {
    const rows = document.querySelectorAll("#itemsBody tr");
    rows.forEach((row, index) => {
        row.querySelector(".serial").textContent = index + 1;
    });
}

// Recalculate grand total and update values
function calculateGrandTotal() {
    let grandTotal = 0;
    const isIGST = document.getElementById("isIGST").checked;

    document.querySelectorAll("#itemsBody tr").forEach(row => {
        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const cgst = parseFloat(row.querySelector(".cgst").value) || 0;
        const sgst = parseFloat(row.querySelector(".sgst").value) || 0;

        const taxableValue = qty * rate;
        let cgstAmount = 0, sgstAmount = 0;

        if (isIGST) {
            cgstAmount = (taxableValue * (cgst + sgst)) / 100;
            sgstAmount = 0;
        } else {
            cgstAmount = (taxableValue * cgst) / 100;
            sgstAmount = (taxableValue * sgst) / 100;
        }

        const total = taxableValue + cgstAmount + sgstAmount;

        row.querySelector(".taxableValue").textContent = taxableValue.toFixed(2);
        row.querySelector(".cgstAmount").textContent = cgstAmount.toFixed(2);
        row.querySelector(".sgstAmount").textContent = sgstAmount.toFixed(2);
        row.querySelector(".totalAmount").textContent = total.toFixed(2);

        grandTotal += total;
    });

    const discount = parseFloat(document.getElementById("discount").value) || 0;
    const shipping = parseFloat(document.getElementById("shipping").value) || 0;

    const finalAmount = grandTotal - discount + shipping;

    document.getElementById("grandTotal").textContent = finalAmount.toFixed(2);
}

// Apply input listeners for live recalculation
function addInputListeners(row) {
    const inputs = row.querySelectorAll("input.qty, input.rate, input.cgst, input.sgst");
    inputs.forEach(input => {
        input.addEventListener("input", calculateGrandTotal);
    });
}

// Apply listeners to the first row
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#itemsBody tr").forEach(addInputListeners);

    // Optional: Watch discount and shipping changes
    document.getElementById("discount").addEventListener("input", calculateGrandTotal);
    document.getElementById("shipping").addEventListener("input", calculateGrandTotal);
    document.getElementById("isIGST").addEventListener("change", calculateGrandTotal);
});

// Download as PDF
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
