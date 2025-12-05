export const mapRegisterPayload = (form) => {
  return {
    fullName: form.FullName,
    email: form.Email,
    mobile: form.Mobile,
    businessName: form.BusinessName,
    businessType: form.BusinessType,
    gstNumber: form.GstNumber,
    panNumber: form.PanNumber,
    warehouseAddress: form.WarehouseAddress,
    city: form.City,
    state: form.State,
    pincode: form.Pincode,
    bankAccountName: form.BankAccountName,
    bankAccountNumber: form.BankAccountNumber,
    ifscCode: form.IfscCode,
    bankName: form.BankName,
    category: form.Category,
    productCount: form.ProductCount,
    password: form.Password,
  };
};

export const mapLoginPayload = (loginData) => ({
  email: loginData.Email,
  password: loginData.Password,
});
