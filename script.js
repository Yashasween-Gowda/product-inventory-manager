"use strict";
/**
 * ============================================================================
 * PRODUCT INVENTORY MANAGER
 * TypeScript Demo for MCA Students
 * ============================================================================
 *
 * This file demonstrates key TypeScript concepts:
 * 1. Basic Types (string, number, boolean)
 * 2. Interfaces (Custom object structures)
 * 3. Arrays (Typed arrays of interface items)
 * 4. Functions (Typed parameters & return types)
 * 5. Variable & Function Scope (Global/Module vs Block/Local Scope)
 * 6. DOM Manipulation (Type assertion & event handling)
 * 7. Compilation (Compiled to standard JavaScript for browser execution)
 */
// ============================================================================
// CONCEPT 2: GLOBAL / MODULE SCOPE VARIABLES & TYPED ARRAYS
// These variables are accessible by all functions throughout this file.
// ============================================================================
// Typed Array: Stores a list of objects conforming to the Product interface
let inventory = [
    { id: 101, name: "Mechanical Keyboard", price: 79.99, quantity: 15 },
    { id: 102, name: "Wireless Gaming Mouse", price: 49.50, quantity: 25 },
    { id: 103, name: "USB-C Fast Charger", price: 19.99, quantity: 40 }
];
// Basic type: number (Used to generate unique sequential product IDs)
let nextProductId = 104;
// ============================================================================
// CONCEPT 3: DOM ELEMENTS SELECTION (WITH TYPESCRIPT TYPE ASSERTIONS)
// Type assertions (as HTMLInputElement, etc.) inform TypeScript of exact types.
// ============================================================================
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productQtyInput = document.getElementById("product-qty");
const addProductBtn = document.getElementById("add-product-btn");
const inventoryTbody = document.getElementById("inventory-tbody");
const emptyStateDiv = document.getElementById("empty-state");
const totalProductsElem = document.getElementById("total-products");
const totalInventoryValueElem = document.getElementById("total-inventory-value");
const errorMessageElem = document.getElementById("error-message");
// ============================================================================
// CONCEPT 4: FUNCTIONS WITH SCOPE, TYPED PARAMETERS & RETURN TYPES
// ============================================================================
/**
 * Validates form inputs before adding a product.
 * Demonstrates: Basic types (string, number, boolean), Local Scope.
 *
 * @param name Product name
 * @param price Product unit price
 * @param quantity Product stock quantity
 * @returns boolean indicating if inputs are valid
 */
function validateInput(name, price, quantity) {
    // LOCAL SCOPE: 'isValid' and 'message' are only accessible inside this function
    let isValid = true;
    let message = "";
    if (name.trim() === "") {
        message = "Product name cannot be empty.";
        isValid = false;
    }
    else if (isNaN(price) || price <= 0) {
        message = "Price must be a valid number greater than 0.";
        isValid = false;
    }
    else if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        message = "Quantity must be a valid positive integer (at least 1).";
        isValid = false;
    }
    if (!isValid) {
        showError(message);
    }
    else {
        clearError();
    }
    return isValid;
}
/**
 * Displays validation error messages in the UI.
 * Demonstrates: DOM manipulation and string parameter.
 */
function showError(message) {
    if (errorMessageElem) {
        errorMessageElem.textContent = "⚠️ " + message;
        errorMessageElem.classList.remove("hidden");
    }
}
/**
 * Clears the validation error message from the UI.
 */
function clearError() {
    if (errorMessageElem) {
        errorMessageElem.textContent = "";
        errorMessageElem.classList.add("hidden");
    }
}
/**
 * Adds a new product to the inventory array and refreshes the UI.
 * Demonstrates: Object creation conforming to Interface, Array push, and Scope.
 */
function addProduct() {
    // LOCAL SCOPE: Read and convert values from input fields
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const quantity = parseInt(productQtyInput.value, 10);
    // Validate inputs
    const isValid = validateInput(name, price, quantity);
    if (!isValid) {
        return;
    }
    // Create a new Product object adhering to the Product interface
    const newProduct = {
        id: nextProductId++,
        name: name,
        price: price,
        quantity: quantity
    };
    // Add new product into global inventory array
    inventory.push(newProduct);
    // Reset input fields
    productNameInput.value = "";
    productPriceInput.value = "";
    productQtyInput.value = "";
    productNameInput.focus();
    // Refresh UI
    displayProducts();
    updateSummary();
}
/**
 * Deletes a product from the inventory array by its unique ID.
 * Demonstrates: Array filtering, number parameter, function execution.
 *
 * @param productId The unique ID of the product to delete
 */
function deleteProduct(productId) {
    // Filter out the product with the matching ID
    inventory = inventory.filter((item) => item.id !== productId);
    // Refresh UI
    displayProducts();
    updateSummary();
}
/**
 * Calculates the total inventory value across all products.
 * Total Value = Sum of (price * quantity) for all items.
 * Demonstrates: Array iteration, number return type, local accumulator.
 *
 * @returns number Total monetary value of all inventory items
 */
function calculateTotalValue() {
    // LOCAL SCOPE: 'total' accumulator variable
    let total = 0;
    for (let i = 0; i < inventory.length; i++) {
        // Basic type arithmetic calculation
        total += inventory[i].price * inventory[i].quantity;
    }
    return total;
}
/**
 * Updates the summary statistics cards on top of the page.
 * Demonstrates: DOM manipulation, formatting numbers.
 */
function updateSummary() {
    // Update total products count
    const totalCount = inventory.length;
    totalProductsElem.textContent = totalCount.toString();
    // Calculate and format total inventory value
    const totalValue = calculateTotalValue();
    totalInventoryValueElem.textContent = "$" + totalValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
/**
 * Renders the products table in the DOM based on the inventory array.
 * Demonstrates: DOM manipulation, creating table rows, template literals, event binding.
 */
function displayProducts() {
    // Clear existing table rows
    inventoryTbody.innerHTML = "";
    // Check if inventory is empty
    if (inventory.length === 0) {
        emptyStateDiv.classList.remove("hidden");
        return;
    }
    else {
        emptyStateDiv.classList.add("hidden");
    }
    // Loop through each product and build table rows
    inventory.forEach((product) => {
        // LOCAL SCOPE: 'row', 'itemTotal' exist only within this callback iteration
        const row = document.createElement("tr");
        const itemTotal = product.price * product.quantity;
        row.innerHTML = `
            <td><span class="badge-id">#${product.id}</span></td>
            <td><strong>${escapeHtml(product.name)}</strong></td>
            <td class="price-col">$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td class="total-col">$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-id="${product.id}">
                    🗑️ Delete
                </button>
            </td>
        `;
        inventoryTbody.appendChild(row);
    });
    // Attach click event listeners to all Delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const idAttr = btn.getAttribute("data-id");
            if (idAttr) {
                const idToDelete = parseInt(idAttr, 10);
                deleteProduct(idToDelete);
            }
        });
    });
}
/**
 * Sanitizes user text input to prevent HTML injection.
 * Demonstrates: Utility helper function with string parameter and return type.
 */
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
// ============================================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================================
// Click event for Add Product button
addProductBtn.addEventListener("click", () => {
    addProduct();
});
// Allow pressing 'Enter' key inside form inputs to submit
[productNameInput, productPriceInput, productQtyInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addProduct();
        }
    });
});
// Initial render on page load
displayProducts();
updateSummary();
